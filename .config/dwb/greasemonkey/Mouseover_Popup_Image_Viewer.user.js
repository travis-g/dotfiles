// ==UserScript==
// @name        Mouseover Popup Image Viewer
// @namespace   http://w9p.co/userscripts/
// @description Shows larger version of thumbnails. Also supports HTML5 video.
// @version     2014.10.30
// @author      kuehlschrank
// @homepage    http://w9p.co/userscripts/mpiv/
// @icon        https://s3.amazonaws.com/uso_ss/icon/109262/large.png
// @include     http*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// ==/UserScript==

'use strict';

var d = document, wn = window, _ = {}, hostname = location.hostname, cfg = loadCfg(), imgtab = d.images.length == 1 && d.images[0].parentNode == d.body, enabled = cfg.imgtab || !imgtab, hosts, trusted = ['greasyfork.org', 'w9p.co'];

function loadCfg() {
  return fixCfg(GM_getValue('cfg'), true);
}

function fixCfg(s, save) {
  var cfg, def = {
    version: 4,
    delay: 500,
    thumbsonly: true,
    start: 'auto',
    zoom: 'context',
    center: false,
    cursor: false,
    imgtab: false,
    close: true,
    preload: false,
    css: '',
    scales: [],
    hosts: '',
    scale: 1.5
  };
  try { cfg = JSON.parse(s); } catch(ex) {}
  if(typeof cfg != 'object') cfg = {}; else if(cfg.version == def.version) return cfg;
  for(var dp in def) {
    if(def.hasOwnProperty(dp) && typeof cfg[dp] != typeof def[dp]) cfg[dp] = def[dp];
  }
  if(cfg.version == 3 && cfg.scales[0] === 0) cfg.scales[0] = '0!';
  for(var cp in cfg) {
    if(!def.hasOwnProperty(cp)) delete cfg[cp];
  }
  cfg.version = def.version;
  if(save) saveCfg(cfg);
  return cfg;
}

function saveCfg(newCfg) {
  GM_setValue('cfg', JSON.stringify(cfg = newCfg));
}

function loadHosts() {
  var hosts = [
    /* DO NOT EDIT THE CODE. USE GREASEMONKEY ICON -> USER SCRIPT COMMANDS -> SET UP... */
    {r:/[\/\?=](https?.+?)(&|$)/, s:'$1', follow:true},
    {d:'4chan.org', e:'.is_catalog .thread a', q:'.op .fileText a', css:'#post-preview{display:none}'},
    {r:/500px\.com\/photo\//, q:'.the_photo'},
    {r:/attachment\.php.+attachmentid/},
    {r:/abload\.de\/image/, q:'#image'},
    {r:/(https?:\/\/[\.a-z-]+amazon\.com\/images\/I\/.+?)\./, s:'$1.jpg', css:'#zoomWindow{display:none}'},
    {r:/depic\.me\/[0-9a-z]{8,}/, q:'#pic'},
    {r:/deviantart\.com\/art\//, s:function(m, node) { return /\b(film|lit)/.test(node.className) || /in Flash/.test(node.title) ? '' : m.input; }, q:['#download-button[href*=".jpg"], #download-button[href*=".gif"], #download-button[href*=".png"], #gmi-ResViewSizer_fullimg', 'img.dev-content-full']},
    {r:/disqus\.com/, s:''},
    {r:/dropbox\.com\/sh?\/.+\.(jpe?g|gif|png)/i, q:'#download_button_link'},
    {r:/ebay\.[^\/]+\/itm\//, q:function(text) { return text.match(/https?:\/\/i\.ebayimg\.com\/[^\.]+\.JPG/i)[0].replace(/~~60_\d+/, '~~60_57'); }},
    {r:/i.ebayimg.com/, s:function(m ,node) { if(qs('.zoom_trigger_mask', node.parentNode)) return ''; return m.input.replace(/~~60_\d+/, '~~60_57'); }},
    {r:/fastpic\.ru\/view\//, q:'#image'},
    {d:'facebook.com', r:/(fbcdn|fbexternal).*?(app_full_proxy|safe_image).+?(src|url)=(http.+?)[&\"']/, s:function(m, node) { return node.parentNode.className.indexOf('video') > -1 && m[4].indexOf('fbcdn') > -1 ? '' : decodeURIComponent(m[4]); }, html:true},
    {r:/facebook\.com\/(photo\.php|[^\/]+\/photos\/)/, s:function(m, node) { if(node.id == 'fbPhotoImage') return false; if(/gradient\.png$/.test(m.input)) return ''; return m.input; }, q:['a.fbPhotosPhotoActionsItem[href$="dl=1"]', '#fbPhotoImage', '#root img', '#root i.img'], rect:'#fbProfileCover'},
    {r:/fbcdn.+?[0-9]+_([0-9]+)_[0-9]+_[a-z]\.(jpg|png)/, s:function(m, node) { try { if(/[\.^]facebook\.com$/.test(hostname)) return unsafeWindow.PhotoSnowlift.getInstance().stream.cache.image[m[1]].url; } catch(ex) {} return false; }, manual:true},
    {r:/(https?:\/\/(fbcdn-[\w\.\-]+akamaihd|[\w\.\-]+?fbcdn)\.net\/[\w\/\.\-]+?)_[a-z]\.(jpg|png)/, s:function(m, node) { if(node.id == 'fbPhotoImage') { var a = qs('a.fbPhotosPhotoActionsItem[href$="dl=1"]', d.body); if(a) { return a.href.indexOf(m.input.match(/[0-9]+_[0-9]+_[0-9]+/)[0]) > -1 ? '' : a.href; } } if(node.parentNode.outerHTML.indexOf('/hovercard/') > -1) return ''; var gp = node.parentNode.parentNode; if(node.outerHTML.indexOf('profile') > 1 && gp.href && gp.href.indexOf('/photo') > -1) return false; return m[1].replace(/\/[spc][\d\.x]+/g, '').replace('/v/', '/') + '_n.' + m[3]; }, rect:'.photoWrap'},
    {r:/firepic\.org\/\?v=/, q:'.well img[src*="firepic.org"]'},
    {r:/flickr\.com\/photos\/([0-9]+@N[0-9]+|[a-z0-9_\-]+)\/([0-9]+)/, s:'https://www.flickr.com/photos/$1/$2/sizes/o/', q:'#allsizes-photo > img'},
    {r:/gifbin\.com\/.+\.gif/, xhr:true},
    {r:/(gfycat\.com\/)(iframe\/)?([a-z]+)/i, s:'https://$1$3', q:'#webmsource'},
    {r:/googleusercontent\.com\/(proxy|gadgets\/proxy.+?(http.+?)&)/, s:function(m, node) { return m[2] ? decodeURIComponent(m[2]) : m.input.replace(/w\d+-h\d+-p/, '-o'); }},
    {r:/(googleusercontent|ggpht)\.com\//, s:function(m, node) { if(node.outerHTML.match(/favicons\?|\b(Ol Rf Ep|Ol Zb ag|Zb HPb|Zb Gtb|Rf Pg|ho PQc|Uk wi hE)\b/) || matches(node, '.g-hovercard *, a[href*="profile_redirector"] > img')) return ''; return m.input.replace(/\/(s\d{2,}([ckno\-]*?|-fcrop[^\/]+)|w\d+-h\d+(-[po])?)\//g, '/s0/'); }},
    {r:/heberger-image\.fr\/images/, q:'#myimg'},
    {r:/hostingkartinok\.com\/show-image\.php.*/, q:'.image img'},
    {r:/imagearn\.com\/image/, q:'#img', xhr:true},
    {r:/imagefap\.com\/(image|photo)/, q:'#gallery + noscript'},
    {r:/imagebam\.com\/image\//, q:'img[id]'},
    {r:/imageban\.(ru|net)\/show|imgnova\.com|cweb-pix\.com|(imagebunk|imagewaste)\.com\/(image|pictures\/[0-9]+)/, q:'#img_obj', xhr:true},
    {r:/(imagepdb\.com|imgsure\.com|www\.pixoverflow\.com|imgwiki\.org)\/\?v=([0-9]+$|.+(?=\.[a-z]+))/, s:'http://$1/images/$2.jpg', xhr:true},
    {r:/imageshack\.us\/((i|f|photo)\/|my\.php)/, q:['div.codes > div + div', '#main_image, #fullimg']},
    {r:/imageshost\.ru\/photo\//i, q:'#bphoto'},
    {r:/imageteam\.org\/img/, q:'img[alt="image"]'},
    {r:/(imagetwist\.com|imageshimage\.com|imgflare\.com|imgearn\.net)\/[a-z0-9]{8,}/, q:'img.pic', xhr:true},
    {r:/imageupper\.com\/i\//, q:'#img', xhr:true},
    {r:/imagepix\.org\/image\/(.+)\.html$/, s:'http://imagepix.org/full/$1.jpg', xhr:true},
    {r:/imageporter\.com\/i\//, s:'/_t//', xhr:true},
    {r:/imagevenue\.com\/img\.php/, q:'#thepic'},
    {r:/imagezilla\.net\/show\//, q:'#photo', xhr:true},
    {r:/media-imdb\.com\/images\/.+?\.jpg/, s:'/V1\\.?_.+?\\.//g', distinct:true},
    {r:/imgbox\.com\/([a-z0-9]+)$/i, q:'#img', xhr:hostname != 'imgbox.com'},
    {r:/imgchili\.(net|com)\/show/, q:'#show_image', xhr:true},
    {r:/(imggoo|pixliv)\.com\/img-/, q:'img.centred_resized, #image', xhr:true, post:'imgContinue=Continue%20to%20image%20...%20'},
    {r:/imgpaying\.com\/([a-z0-9]+)\/.+html$/, q:'img.pic', xhr:true, post:function(m) { return 'op=view&id=' + m[1] + '&pre=1&submit=Continue%20to%20image...'; }},
    {r:/imgrill\.com\/upload\//, s:'/small/big/', xhr:true},
    {r:/imgtheif\.com\/image\//, q:'a > img[src*="/pictures/"]'},
    {r:/imgur\.com\/(a|gallery)\/([a-z0-9]+)(#[a-z0-9]+)?/i, s:function(m, node) { return 'https://imgur.com/' + m[1] + '/' + m[2] + (m[1] == 'a' ? '/noscript' : '') + (m[3] || ''); }, g:{entry:'div.album-image, #image-container > div.image, #image > div.image', image:'img', caption:['h2', 'div.description'], title:'meta[name="twitter:title"]', fix:function(s, isURL) { return isURL ? s.replace('http:', 'https:').replace(/([^\/]{7})h\.(gif|jpg|png)$/, '$1.$2') : s.replace(/^imgur.*| - Imgur$/, '');}}, css:'.post > .hover { display:none!important; }'},
    {r:/imgur\.com\/(r\/[a-z]+\/|[a-z0-9]+#)?([a-z0-9]{5,})b?($|\?|\.)/i, s:function(m, node) { if(/memegen|random|register|signin/.test(m.input)) return ''; return /(i\.)?imgur\.com\/(a\/|gallery\/)?/.test(node.parentNode.href || node.parentNode.parentNode.href) ? false : 'https://i.imgur.com/' + m[2] + '.jpg'; }},
    {r:/((in|web\.)stagr(\.am|am\.com)|websta\.me)\/p\//i, q:['meta[property="og:video"]', 'div.jp-jplayer', 'span.size > a[href$=".mp4"]:last-of-type', 'meta[property="og:image"]']},
    {r:/(istoreimg\.com\/i|itmages\.ru\/image\/view)\//, q:'#image'},
    {r:/(lazygirls\.info\/.+_.+?\/[a-z0-9_]+)($|\?)/i, s:'http://www.$1?display=fullsize', q:'img.photo', xhr:hostname != 'www.lazygirls.info'},
    {r:/ld-host\.de\/show/, q:'#image'},
    {r:/(listal|lisimg)\.com\/(view)?image\/([0-9]+)/, s:'http://ilarge.listal.com/image/$3/0full.jpg'},
    {r:/(livememe\.com|lvme\.me)\/([^\.]+)$/, s:'http://i.lvme.me/$2.jpg'},
    {r:/lostpic\.net\/\?(photo|view)/, q:'.casem img'},
    {r:/mediacru\.sh\/[a-z0-9_-]+($|\/direct)/i, q:'div.media img, source[src$="webm"]'},
    {r:/modelmayhem\.com\/photos\//, s:'/_m//'},
    {r:/modelmayhem\.com\/avatars\//, s:'/_t/_m/'},
    {r:/(min\.us|minus\.com)\/(i\/|l)([a-z0-9]+)$/i, s:'https://i.minus.com/i$3.jpg'},
    {r:/(min\.us|minus\.com)\/m[a-z0-9]+$/i, g:function(text) { var m = /gallerydata = ({[\w\W]+?});/.exec(text), o = JSON.parse(m[1]), items = []; items.title = o.name; for(var i = 0, len = o.items.length, cur; i < len && (cur = o.items[i]); i++) { items.push({url:'https://i.minus.com/i' + cur.id + '.jpg', desc:cur.caption}); }; return items; }},
    {r:/(panoramio\.com\/.*?photo(\/|_id=)|google\.com\/mw-panoramio\/photos\/[a-z]+\/)(\d+)/, s:'http://static.panoramio.com/photos/original/$3.jpg'},
    {r:/(\d+\.photobucket\.com\/.+\/)(\?[a-z=&]+=)?(.+\.(jpe?g|png|gif))/, s:'http://i$1$3', xhr:hostname.indexOf('photobucket.com') < 0},
    {r:/(photosex\.biz|posteram\.ru)\/.+?id=/i, q:'img[src*="/pic_b/"]', xhr:true},
    {r:/pic4all\.eu\/(images\/|view\.php\?filename=)(.+)/, s:'http://$1/images/$3'},
    {r:/piccy\.info\/view3\/(.*)\//, s:'http://piccy.info/view3/$1/orig/', q:'#mainim'},
    {r:/picsee\.net\/([\d\-]+)\/(.+?)\.html/,s:'http://picsee.net/upload/$1/$2'},
    {r:/picturescream\.com\/\?v=/, q:'#imagen img'},
    {r:/(picturescream\.[a-z\/]+|imagescream\.com\/img)\/(soft|x)/, q:'a > img[src*="/images/"]'},
    {r:/pimpandhost\.com\/(image|guest)\//, q:'#image'},
    {r:/pixhost\.org\/show\//, q:'#show_image', xhr:true},
    {r:/pixhub\.eu\/images/, q:'.image-show img', xhr:true},
    {r:/(pixroute|imgspice)\.com\/.+\.html$/, q:'img[id]', xhr:true},
    {r:/(pixsor\.com|euro-pic\.eu)\/share-([a-z0-9_]+)/i, s:'http://www.$1/image.php?id=$2', xhr:true},
    {r:/postima?ge?\.org\/image\//, q:'center img'},
    {r:/radikal\.ru\/(fp|.+\.html)/, q:function(text) { return text.match(/http:\/\/[a-z0-9]+\.radikal\.ru[a-z0-9\/]+\.(jpg|gif|png)/i)[0] }},
    {r:/screenlist\.ru\/details/, q:'#picture'},
    {r:/sharenxs\.com\/.+original$/, q:'img.view_photo', xhr:true},
    {r:/sharenxs\.com\/(gallery|view)\//, q:'a[href$="original"]', follow:true},
    {r:/sndcdn\.com.+/, s:function(m, node) { return node.width == 40 && navigator.userAgent.indexOf('WebKit') > -1 || /commentBubble|commentItem|carouselItem/.test(node.className + node.parentNode.className) ? '' : m.input.replace(/large|t[0-9]+x[0-9]+/, 't500x500'); }},
    {d:'startpage', r:/\boiu=(.+)/, s:'$1'},
    {r:/stooorage\.com\/show\//, q:'#page_body div div img', xhr:true},
    {r:/(swoopic\.com|(imgproof|imgserve)\.net)\/img-/, q:'img.centred_resized, img.centred', xhr:true},
    {r:/turboimagehost\.com\/p\//, q:'#imageid', xhr:true},
    {r:/twimg.+\/profile_images/i, s:'/_(reasonably_small|normal|bigger|\d+x\d+)\\././g'},
    {r:/([a-z0-9]+\.twimg\.com\/media\/[a-z0-9_-]+\.(jpe?g|png|gif))/i, s:'https://$1:large', rect:'div.tweet a.twitter-timeline-link, div.TwitterPhoto-media'},
    {d:'tumblr.com',  e:'div.photo_stage_img, div.photo_stage > canvas', s:function(m, node) { return /http[^"]+/.exec(node.style.cssText + node.getAttribute('data-img-src'))[0]; }, follow:true},
    {r:/tumblr\.com.+_500\.jpg/, s:['/_500/_1280/', '']},
    {r:/twimg\.com\/1\/proxy.+?t=(.+?)[&_]/i, s:function(m) { return wn.atob(m[1]).match(/http.+/); }},
    {r:/pic\.twitter\.com\/[a-z0-9]+/i, q:function(text) { return text.match(/https?:\/\/twitter\.com\/[^\/]+\/status\/\d+\/photo\/\d+/i)[0]; }, follow:true},
    {d:'tweetdeck.twitter.com', e:'a.media-item', s:function(m, node) { return /http[^\)]+/.exec(node.style.backgroundImage)[0]; }, follow:true},
    {r:/twitpic\.com(\/show\/[a-z]+)?\/([a-z0-9]+)($|#)/i, s:'https://twitpic.com/show/large/$2'},
    {r:/twitter\.com\/.+\/status\/.+\/photo\//, q:'.media img, video.animated-gif', follow:function(url) { return !/\.mp4$/.test(url); }},
    {d:'twitter.com', e:'.grid-tweet > .media-overlay', s:function(m, node) { return node.previousElementSibling.src; }, follow:true},
    {r:/upix\.me\/files/, s:'/#//'},
    {r:/(vine|seenive)\.com?\/v\//, q:'video source, meta[property="twitter:player:stream"]'},
    {r:/wiki.+\/thumb\/.+\.(jpe?g|gif|png|svg)\//i, s:'/\\/thumb(?=\\/)|\\/[^\\/]+$//g'},
    {d:'last', r:/(userserve-ak\.last\.fm\/serve\/).+?(\/\d+)/, s:'http://$1_$2/0.jpg', html:true},
    {r:/((xxxhost|tinypix)\.me|(xxxces|imgtiger)\.com)\/viewer/, q:['.text_align_center > img', 'img[alt]'], xhr:true},
    {r:/(i[0-9]*\.ytimg\.com\/vi\/[^\/]+)/, s:'https://$1/0.jpg', rect:'.video-list-item'},
    {r:/\/\/([^\/]+)\/viewer\.php\?file=(.+)/, s:'http://$1/images/$2', xhr:true},
    {r:/\/albums.+\/thumb_[^\/]/, s:'/thumb_//'},
    {r:/\/\/[^\/]+[^\?:]+\.(jpe?g?|gif|png|svg|webm)($|\?)/i, distinct:true}
  ];
  if(cfg.hosts) {
    var lines = cfg.hosts.split(/[\r\n]+/);
    for(var i = lines.length, s; i-- && (s = lines[i]);) {
      try {
        var h = JSON.parse(s);
        if(h.r) h.r = new RegExp(h.r, 'i');
        if(h.s && h.s.indexOf('return ') > -1) h.s = new Function('m', 'node', h.s);
        if(h.q && h.q.indexOf('return ') > -1) h.q = new Function('text', 'doc', h.q);
        if(h.c && h.c.indexOf('return ') > -1) h.c = new Function('text', 'doc', h.c);
        hosts.splice(0, 0, h);
      } catch(ex) {
        handleError('Invalid host: ' + s + '\nReason: ' + ex);
      }
    }
  }
  var filter = function(hn, h) {
    return !h.d || hn.indexOf(h.d) > -1;
  };
  return hosts.filter(filter.bind(null, hostname));
}

function onMouseOver(e) {
  if(!enabled || e.shiftKey || _.zoom || !activate(e.target)) return;
  _.cx = e.clientX;
  _.cy = e.clientY;
  if(cfg.start == 'auto' && !_.manual) {
    if(cfg.preload) {
      _.preloadStart = Date.now();
      startPopup();
      setStatus('preloading', 'add');
    } else {
      _.timeout = wn.setTimeout(startPopup, cfg.delay);
    }
    wn.setTimeout(function() { setStatus('preloading', 'remove'); }, cfg.delay);
  }
  else if(cfg.start != 'auto' && e.ctrlKey)
    startPopup();
  else
    setStatus('ready');
}

function onMouseOut(e) {
  if(!e.relatedTarget && !e.shiftKey) deactivate();
}

function onMouseMove(e) {
  _.cx = e.clientX;
  _.cy = e.clientY;
  var r = _.rect;
  _.cr = _.cx < r.right + 2 && _.cx > r.left - 2 && _.cy < r.bottom + 2 && _.cy > r.top - 2;
  if(e.shiftKey) return;
  if(!_.zoomed && !_.cr) return deactivate();
  if(_.zoom) {
    placePopup();
    if(!cfg.cursor) {
      var bx = _.view.width/6, by = _.view.height/6;
      setStatus(_.cx < bx || _.cx > _.view.width - bx || _.cy < by || _.cy > _.view.height - by ? 'edge' : false);
    }
  }
}

function onMouseDown(e) {
  if(e.which != 3 && !e.shiftKey) deactivate(true);
}

function onMouseScroll(e) {
  var dir = (e.deltaY || -e.wheelDelta) > 0 ? 1 : -1;
  if(_.zoom) {
    drop(e);
    var idx = _.scales.indexOf(_.scale);
    idx -= dir;
    if(idx >= 0 && idx < _.scales.length) _.scale = _.scales[idx];
    if(idx == 0 && cfg.close) {
      if(!_.gItems || _.gItems.length < 2) return deactivate(true);
      _.zoom = false;
      showGalleryInfo();
    }
    _.popup.classList.add('mpiv-zooming');
    placePopup();
    setTitle();
  } else if(_.gItems && _.gItems.length > 1 && _.popup) {
    drop(e);
    nextGalleryItem(dir);
  } else if(cfg.zoom == 'wheel' && dir < 0 && _.popup) {
    drop(e);
    toggleZoom();
  } else {
    deactivate();
  }
}

function onKeyDown(e) {
  if(e.keyCode == 17 && (cfg.start != 'auto' || _.manual) && !_.popup) startPopup();
}

function onKeyUp(e) {
  switch(e.keyCode) {
    case 16:
      _.popup && (_.zoomed || !('cr' in _) || _.cr) ? toggleZoom() : deactivate(true);
      break;
    case 17:
      if(cfg.start == 'auto' && !_.manual) deactivate(true);
      break;
    case 27:
      deactivate(true);
      break;
    case 39:
    case 74:
      drop(e);
      nextGalleryItem(1);
      break;
    case 37:
    case 75:
      drop(e);
      nextGalleryItem(-1);
      break;
    case 84:
      GM_openInTab(_.popup.src);
      deactivate();
      break;
    default:
      deactivate(true);
  }

}

function onContext(e) {
  if(e.shiftKey) return;
  if(cfg.zoom == 'context' && _.popup && toggleZoom()) return drop(e);
  if((cfg.start == 'context' || (cfg.start == 'auto' && _.manual)) && !_.status && !_.popup) {
    startPopup();
    return drop(e);
  }
  wn.setTimeout(function() { deactivate(true); }, 50);
}

function onMessage(e) {
  if(trusted.indexOf(e.origin.substr(e.origin.indexOf('//') + 2)) < 0 || typeof e.data != 'string' || e.data.indexOf('mpiv-rule ') !== 0) return;
  if(!qs('#mpiv-setup', d)) setup();
  var inp = qs('#mpiv-hosts input:first-of-type', d);
  inp.value = e.data.substr(10).trim();
  inp.dispatchEvent(new Event('input', {bubbles:true}));
  inp.parentNode.scrollTop = 0;
  inp.select();
}

function startPopup() {
  setStatus(false);
  _.g ? startGalleryPopup() : startSinglePopup(_.url);
}

function startSinglePopup(url) {
  setStatus('loading');
  if(!_.q || Array.isArray(_.urls)) return _.xhr ? downloadImage(url, _.url) : setPopup(url);
  parsePage(url, _.q, _.c, _.post, function(iurl, cap) {
    if(!iurl) throw 'File not found.';
    _.caption = cap;
    if(_.follow === true || typeof _.follow == 'function' && _.follow(iurl)) {
      var info = findInfo(iurl, _.node, true);
      if(!info || !info.url) throw "Couldn't follow URL: " + iurl;
      for(var prop in info) _[prop] = info[prop];
      return startSinglePopup(_.url);
    }
    if(_.distinct && existsUnscaled(iurl, _.node.parentNode)) return setStatus(false);
    if(_.xhr) downloadImage(iurl, url); else setPopup(iurl);
  });
}

function startGalleryPopup() {
  setStatus('loading');
  downloadPage(_.url, null, function(text, url) {
    try {
      _.gItems = _.g(text, url);
      if(_.gItems.length == 0) {
        _.gItems = false;
        throw 'empty';
      }
      _.gIndex = findGalleryPosition(_.url);
      nextGalleryItem();
    } catch(ex) {
      handleError('Parsing error: ' + ex);
    }
  });
}

function findGalleryPosition(gUrl) {
  var dir = 0, sel = gUrl.split('#')[1];
  if(sel) {
    if(/^[0-9]+$/.test(sel)) {
      dir += parseInt(sel);
    } else {
      for(var i = _.gItems.length; i--;) {
        var url = _.gItems[i].url;
        if(Array.isArray(url)) url = url[0];
        var file = url.substr(url.lastIndexOf('/') + 1);
        if(file.indexOf(sel) > -1) {
          dir += i;
          break;
        }
      }
    }
  }
  return dir;
}

function loadGalleryParser(g) {
  if(typeof g == 'function') return g;
  if(typeof g == 'string') return new Function('text', g);
  return function(text, url) {
    var qE = g.entry, qC = g.caption, qI = g.image, qT = g.title, fix = (typeof g.fix == 'string' ? new Function('s', 'isURL', g.fix) : g.fix) || function(s) { return s.trim(); };
    var doc = createDoc(text);
    var nodes = doc.querySelectorAll(qE), items = [];
    if(!Array.isArray(qC)) qC = [qC];
    for(var i = 0, node, len = nodes.length; i < len && (node = nodes[i]); i++) {
      var item = {};
      try {
        item.url = fix(findFile(qs(qI, node), url), true);
        item.desc = qC.reduce(function(prev, q) {
          var n = qs(q, node);
          if(!n) {
            [node.previousElementSibling, node.nextElementSibling].forEach(function(es) {
              if(es && matches(es, qE) === false) n = matches(es, q) ? es : qs(q, es);
            });
          }
          return n ? (prev ? prev + ' - ' : '') + fix(n.textContent) : prev;
        }, '');
      } catch(ex) {}
      if(item.url) items.push(item);
    }
    var title = qs(qT, doc);
    if(title) items.title = fix(title.getAttribute('content') || title.textContent);
    return items;
  };
}

function nextGalleryItem(dir) {
  if(dir > 0 && (_.gIndex += dir) >= _.gItems.length)
    _.gIndex = 0;
  else if(dir < 0 && (_.gIndex += dir) < 0)
    _.gIndex = _.gItems.length - 1;
  var item = _.gItems[_.gIndex];
  if(Array.isArray(item.url)) {
    _.urls =  item.url.slice(0);
    _.url = _.urls.shift();
  } else {
    delete _.urls;
    _.url = item.url;
  }
  setPopup(false);
  startSinglePopup(_.url);
  showGalleryInfo();
  preloadNextGalleryItem(dir);
}

function showGalleryInfo() {
  var item = _.gItems[_.gIndex];
  var c = _.gItems.length > 1 ? '[' + (_.gIndex + 1) + '/' + _.gItems.length + '] ' : '';
  if(_.gIndex == 0 && _.gItems.title && (!item.desc || item.desc.indexOf(_.gItems.title) < 0)) c += _.gItems.title + (item.desc ? ' - ' : '');
  if(item.desc) c += item.desc;
  if(c) setBar(c.trim(), 'gallery', true);
}

function preloadNextGalleryItem(dir) {
  var idx = _.gIndex + dir;
  if(_.popup && idx >= 0 && idx < _.gItems.length) {
    var url = _.gItems[idx].url;
    if(Array.isArray(url)) url = url[0];
    on(_.popup, 'load', function() {
      var img = ce('img');
      img.src = url;
    });
  }
}

function activate(node) {
  if(node == _.popup || node == d.body || node == d.documentElement) return;
  var info = parseNode(node);
  if(!info || !info.url || info.node == _.node || info.distinct && existsUnscaled(info.url, info.node.parentNode)) return;
  deactivate();
  _ = info;
  _.view = viewRect();
  _.style = addStyle('\
    #mpiv-bar { position:fixed;z-index:2147483647;left:0;right:0;top:0;transform:scaleY(0);-webkit-transform:scaleY(0);transform-origin:top;-webkit-transform-origin:top;transition:transform 500ms ease 1000ms;-webkit-transition:-webkit-transform 500ms ease 1000ms;text-align:center;font-family:sans-serif;font-size:15px;font-weight:bold;background:rgba(0, 0, 0, 0.6);color:white;padding:4px 10px; }\
    #mpiv-bar.mpiv-show { transform:scaleY(1);-webkit-transform:scaleY(1); }\
    #mpiv-popup { display:none;border:1px solid gray;box-sizing:content-box;background-color:white;position:fixed;z-index:2147483647;margin:0;max-width:none;max-height:none;cursor:' + (cfg.cursor ? 'default' : 'none') + '; }\
    #mpiv-popup.mpiv-show { display:inline; }\
    #YTLT-preview, body > div.tipsy { display:none!important; }\
    .mpiv-loading:not(.mpiv-preloading) * { cursor:wait!important; }\
    .mpiv-edge #mpiv-popup { cursor:default; }\
    .mpiv-error * { cursor:not-allowed!important; }\
    .mpiv-ready *, .mpiv-large * { cursor:zoom-in!important; cursor:-webkit-zoom-in!important; }' +
    (cfg.css.indexOf('{') < 0 ? '#mpiv-popup {' + cfg.css + '}' : cfg.css) +
    (_.css ? _.css : ''));
  on(d, 'mousemove', onMouseMove);
  on(d, 'mouseout', onMouseOut);
  on(d, 'mousedown', onMouseDown);
  on(d, 'contextmenu', onContext);
  on(d, 'keydown', onKeyDown);
  on(d, 'keyup', onKeyUp);
  on(d, 'onwheel' in d ? 'wheel' : 'mousewheel', onMouseScroll);
  return true;
}

function deactivate(wait) {
  wn.clearTimeout(_.timeout);
  if(_.req && 'abort' in _.req) _.req.abort();
  if(_.tooltip) _.tooltip.node.title = _.tooltip.text;
  setTitle(true);
  setStatus(false);
  setPopup(false);
  setBar(false);
  rm(_.style);
  _ = {};
  off(d, 'mousemove', onMouseMove);
  off(d, 'mouseout', onMouseOut);
  off(d, 'mousedown', onMouseDown);
  off(d, 'contextmenu', onContext);
  off(d, 'keydown', onKeyDown);
  off(d, 'keyup', onKeyUp);
  off(d, 'onwheel' in d ? 'wheel' : 'mousewheel', onMouseScroll);
  if(wait) {
    enabled = false;
    wn.setTimeout(function() { enabled = true; }, 200);
  }
}

function parseNode(node) {
  var a, img, url, info;
  if(!hosts) hosts = loadHosts();
  if(tag(node) == 'A') {
    a = node;
  } else {
    if(tag(node) == 'IMG') {
      img = node;
      if(img.src.substr(0, 5) != 'data:') url = rel2abs(img.src, location.href);
    }
    info = findInfo(url, node);
    if(info) return info;
    a = tag(node.parentNode) == 'A' ? node.parentNode : (tag(node.parentNode.parentNode) == 'A' ? node.parentNode.parentNode : false);
  }
  if(a) {
    if(cfg.thumbsonly && !(img || qs('i', a) || a.rel == 'theater') && !hasBg(a) && !hasBg(a.parentNode) && !hasBg(a.firstElementChild)) return;
    url = a.getAttribute('data-expanded-url') || a.getAttribute('data-full-url') || a.getAttribute('data-url') || a.href;
    if(url.substr(0, 5) == 'data:') url = false;
    else if(url.indexOf('//t.co/') > -1) url = 'http://' + a.textContent;
    info = findInfo(url, a);
    if(info) return info;
  }
  if(img) return {url:img.src, node:img, rect:rect(img), distinct:true};
}

function findInfo(url, node, noHtml, skipHost) {
  for(var i = 0, len = hosts.length, tn = tag(node), h, m, html, urls; i < len && (h = hosts[i]); i++) {
    if(h.e && !matches(node, h.e) || h == skipHost) continue;
    if(h.r) {
      if(h.html && !noHtml && (tn == 'A' || tn == 'IMG' || h.e)) {
        if(!html) html = node.outerHTML;
        m = h.r.exec(html)
      } else if(url) {
        m = h.r.exec(url);
      } else {
        m = null;
      }
    } else {
      m = url ? /.*/.exec(url) : [];
    }
    if(!m || tn == 'IMG' && !('s' in h)) continue;
    if('s' in h) {
      urls = (Array.isArray(h.s) ? h.s : [h.s]).map(function(s) { if(typeof s == 'string') return decodeURIComponent(replace(s, m)); if(typeof s == 'function') return s(m, node); return s; });
      if(h.q && urls.length > 1) { console.log('Rule discarded. Substitution arrays can\'t be combined with property q.'); continue; }
      if(Array.isArray(urls[0])) urls = urls[0];
      if(urls[0] === false) continue;
      urls = urls.map(function(u) { return u ? decodeURIComponent(u) : u; });
    } else {
      urls = [m.input];
    }
    if((h.follow === true || typeof h.follow == 'function' && h.follow(urls[0])) && !h.q) return findInfo(urls[0], node, false, h);
    return {
      node: node,
      url: urls.shift(),
      urls: urls.length ? urls : false,
      r: h.r,
      q: h.q,
      c: h.c,
      g: h.g ? loadGalleryParser(h.g) : h.g,
      xhr: h.xhr,
      post: typeof h.post == 'function' ? h.post(m) : h.post,
      follow: h.follow,
      css: h.css,
      manual: h.manual,
      distinct: h.distinct,
      rect: rect(node, h.rect)
    };
  };
}

function downloadPage(url, post, cb) {
  var opts = {
    method: 'GET',
    url: url,
    onload: function(req) {
      try {
        delete _.req;
        if(req.status > 399) throw 'Server error: ' + req.status;
        cb(req.responseText, req.finalUrl || url);
      } catch(ex) {
        handleError(ex);
      }
    },
    onerror: handleError
  };
  if(post) {
    opts.method = 'POST';
    opts.data = post;
    opts.headers = {'Content-Type':'application/x-www-form-urlencoded','Referer':url};
  }
  _.req = GM_xmlhttpRequest(opts);
}

function downloadImage(url, referer) {
  var start = Date.now(), bar;
  _.req = GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    overrideMimeType: 'text/plain; charset=x-user-defined',
    headers: {'Accept':'image/png,image/*;q=0.8,*/*;q=0.5','Referer':referer},
    onprogress: function(e) {
      if(!bar && Date.now() - start > 3000 && e.loaded/e.total < 0.5) bar = true;
      if(bar) setBar(parseInt(e.loaded/e.total * 100) + '% of ' + (e.total/1000000).toFixed(1) + ' MB', 'xhr');
    },
    onload: function(req) {
      try {
        delete _.req;
        setBar(false);
        if(req.status > 399) throw 'HTTP error ' + req.status;
        var txt = req.responseText, ui8 = new Uint8Array(txt.length), type;
        for(var i = txt.length; i--;) {
          ui8[i] = txt.charCodeAt(i);
        }
        if(/Content-Type:\s*(.+)/i.exec(req.responseHeaders) && RegExp.$1.indexOf('text/plain') < 0) type = RegExp.$1;
        if(!type) {
          var ext = /\.([a-z0-9]+?)($|\?|#)/i.exec(url) ? RegExp.$1.toLowerCase() : 'jpg', types = {bmp:'image/bmp', gif:'image/gif', jpe:'image/jpeg', jpeg:'image/jpeg', jpg:'image/jpeg', mp4:'video/mp4', png:'image/png', svg:'image/svg+xml', tif:'image/tiff', tiff:'image/tiff', webm:'video/webm'};
          type = ext in types ? types[ext] : 'application/octet-stream';
        }
        var b = new Blob([ui8.buffer], {type:type});
        var u = wn.URL || wn.webkitURL;
        if(u) return setPopup(u.createObjectURL(b));
        var fr = new FileReader();
        fr.onload = function() { setPopup(fr.result); };
        fr.onerror = handleError;
        fr.readAsDataURL(b);
      } catch(ex) {
        handleError(ex);
      }
    },
    onerror: handleError
  });
}

function parsePage(url, q, c, post, cb) {
  downloadPage(url, post, function(html) {
    var iurl, cap, doc = createDoc(html);
    if(typeof q == 'function') {
      iurl = q(html, doc);
      if(Array.isArray(iurl)) {
        _.urls = iurl.slice(0);
        iurl = _.urls.shift();
      }
    } else {
      var inode = findNode(q, doc);
      iurl = inode ? findFile(inode, url) : false;
    }
    if(typeof c == 'function') {
      cap = c(html, doc);
    } else {
      var cnode = findNode(c, doc);
      cap = cnode ? findCaption(cnode) : false;
    }
    cb(iurl, cap);
  });
}

function findNode(q, doc) {
  var node;
  if(!Array.isArray(q)) q = [q];
  for(var i = 0, len = q.length; i < len; i++) {
    node = qs(q[i], doc);
    if(node) break;
  }
  return node;
}

function findFile(n, url) {
  var base = qs('base[href]', n.ownerDocument);
  var path =  n.getAttribute('src') || n.getAttribute('data-m4v') || n.getAttribute('href') || /https?:\/\/[.\/a-z0-9_+%\-]+\.(jpe?g|gif|png|svg|webm|mp4)/i.exec(n.outerHTML) && RegExp.lastMatch;
  return path ? rel2abs(path.trim(), base ? base.getAttribute('href') : url) : false;
}

function findCaption(n) {
  return n.getAttribute('content') || n.getAttribute('title') || n.textContent;
}

function checkProgress(start) {
  if(start === true) {
    if(checkProgress.interval) wn.clearInterval(checkProgress.interval);
    checkProgress.interval = wn.setInterval(checkProgress, 150);
    return;
  }
  var p = _.popup;
  if(!p) return wn.clearInterval(checkProgress.interval);
  _.nheight = p.naturalHeight || p.videoHeight;
  _.nwidth  = p.naturalWidth || p.videoWidth;
  if(!_.nheight) return;
  wn.clearInterval(checkProgress.interval);
  if(_.preloadStart) {
    var wait = _.preloadStart + cfg.delay - Date.now();
    if(wait > 0) return _.timeout = wn.setTimeout(checkProgress, wait);
  }
  if(_.urls && _.urls.length && Math.max(_.nheight, _.nwidth) < 130) return handleError({type:'error'});
  setStatus(false);
  p.clientHeight;
  p.className = 'mpiv-show';
  var s = wn.getComputedStyle(p);
  _.pw = styleSum(s, ['padding-left', 'padding-right']);
  _.ph = styleSum(s, ['padding-top', 'padding-bottom']);
  _.mbw = styleSum(s, ['margin-left', 'margin-right', 'border-left-width', 'border-right-width']);
  _.mbh = styleSum(s, ['margin-top', 'margin-bottom', 'border-top-width', 'border-bottom-width']);
  var scales = cfg.scales.length ? cfg.scales : ['0!', 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5, 8, 16], fit = Math.min(( _.view.width - _.mbw)/_.nwidth, (_.view.height - _.mbh)/_.nheight), cutoff = _.scale = Math.min(1, fit);
  _.scales = [];
  for(var i = scales.length; i--;) {
    var val = parseFloat(scales[i]) || fit, opt = typeof scales[i] == 'string' ? scales[i].slice(-1) : 0;
    if(opt == '!') cutoff = val;
    if(opt == '*') _.zscale = val;
    if(val != _.scale) _.scales.push(val);
  }
  _.scales = _.scales.filter(function(x) { return x >= cutoff; });
  _.scales.sort(function(a, b) { return a - b; });
  _.scales.unshift(_.scale);
  if(!_.bar) {
    if(_.caption) {
      setBar(_.caption, 'caption');
    } else {
      [_.node.parentNode, _.node, _.node.firstElementChild].some(function(n) {
        if(n && n.title && n.title != n.textContent && d.title.indexOf(n.title) < 0 && !/^http\S+$/.test(n.title)) {
          _.tooltip = {node:n, text:n.title};
          setBar(_.tooltip.text, 'tooltip');
          n.title = '';
          return true;
        }
      });
    }
  }
  setTitle();
  placePopup();
  if(_.large = _.nwidth > p.clientWidth + _.mbw || _.nheight > p.clientHeight + _.mbh) setStatus('large');
  if(cfg.imgtab && imgtab || cfg.zoom == 'auto') toggleZoom();
}

function placePopup() {
  var p = _.popup;
  if(!p) return;
  var x = null, y = null, w = Math.round(_.scale * _.nwidth), h = Math.round(_.scale * _.nheight), cx = _.cx, cy = _.cy, vw = _.view.width, vh = _.view.height;
  if(!_.zoom && (!_.gItems || _.gItems.length < 2) && !cfg.center) {
    var r = _.rect, rx = (r.left + r.right) / 2, ry = (r.top + r.bottom) / 2;
    if(vw - r.right - 40 > w + _.mbw || w + + _.mbw < r.left - 40) {
      if(h + _.mbh < vh - 60) y = Math.min(Math.max(ry - h/2, 30), vh - h - 30);
      x = rx > vw/2 ? r.left - 40 - w : r.right + 40;
    } else if(vh - r.bottom - 40 > h + _.mbh || h + _.mbh < r.top - 40) {
      if(w + _.mbw < vw - 60) x = Math.min(Math.max(rx - w/2, 30), vw - w - 30);
      y = ry > vh/2 ? r.top - 40 - h : r.bottom + 40;
    }
  }
  if(x == null) x = Math.round((vw > w ? vw/2 - w/2 : -1 * Math.min(1, Math.max(0, 5/3*(cx/vw-0.2))) * (w - vw)) - (_.pw + _.mbw)/2);
  if(y == null) y = Math.round((vh > h ? vh/2 - h/2 : -1 * Math.min(1, Math.max(0, 5/3*(cy/vh-0.2))) * (h - vh)) - (_.ph + _.mbh)/2);
  p.style.cssText = 'width:' + w + 'px;height:' + h + 'px;left:' + x + 'px;top:' + y + 'px';
}

function toggleZoom() {
  var p = _.popup;
  if(!p || !_.scales || _.scales.length < 2) return;
  _.zoom = !_.zoom;
  _.zoomed = true;
  _.scale = _.scales[ _.zoom ? (_.scales.indexOf(_.zscale) > 0 ? _.scales.indexOf(_.zscale) : 1) : 0];
  p.classList.add('mpiv-zooming');
  placePopup();
  setTitle();
  setStatus(_.zoom ? 'zoom' : false);
  if(cfg.zoom != 'auto') setBar(false);
  if(!_.zoom && _.gItems) showGalleryInfo();
  return _.zoom;
}

function handleError(o) {
  var msg = o.message || (o.readyState ? 'Request failed.' : (o.type == 'error' ? 'File can\'t be displayed.' + (qs('div[bgactive*="flashblock"]', d) ? ' Check Flashblock settings.' : '') : o));
  try {
    console.log(msg + '\nRegExp: ' + _.r  +'\nURL: ' + _.url);
  } catch(ex) {}
  if(_.urls && _.urls.length) {
    _.url = _.urls.shift();
    if(!_.url || _.distinct && existsUnscaled(_.url, _.node.parentNode))
      deactivate()
    else
      startSinglePopup(_.url);
  } else if(_.node) {
    setStatus('error');
    setBar(msg, 'error');
  }
}

function setStatus(status, flag) {
  var de = d.documentElement, cn = de.className;
  if(flag == 'remove') {
        cn = cn.replace('mpiv-' + status, '');
  } else {
    if(flag != 'add') cn = cn.replace(/mpiv-[a-z]+/g, '');
    if(status) cn += ' mpiv-' + status;
  }
  de.className = cn;
}

function setPopup(src) {
  var p = _.popup;
  if(p) {
    _.zoom = false;
    off(p, 'error', handleError);
    if(p.src.substr(0, 5) == 'blob:') (wn.URL || wn.webkitURL).revokeObjectURL(p.src);
    p.src = '';
    rm(p);
    delete _.popup;
  }
  if(!src) return;
  if(/\.(webm|mp4)($|\?)/.test(src)) {
    var start = Date.now(), bar;
    var onProgress = function(e) {
      var p = e.target;
      if(!p.duration || !p.buffered.length || Date.now() - start < 2000) return;
      var per = parseInt(p.buffered.end(0)/p.duration * 100);
      if(!bar && per > 0 && per < 50) bar = true;
      if(bar) setBar(per + '% of ' + Math.round(p.duration) + 's', 'xhr');
    };
    p = _.popup = ce('video');
    p.autoplay = true;
    p.loop = true;
    p.volume = 0.5;
    on(p, 'progress', onProgress);
    on(p, 'canplaythrough', function(e) { off(e.target, 'progress', onProgress); setBar(false); });
  } else {
    p = _.popup = ce('img');
  }
  p.id = 'mpiv-popup';
  on(p, 'error', handleError);
  on(p, 'transitionend', function(e) { e.target.classList.remove('mpiv-zooming'); });
  _.bar ? d.body.insertBefore(p, _.bar) : d.body.appendChild(p);
  p.src = src;
  p = null;
  checkProgress(true);
}

function setBar(label, cn) {
  var b = _.bar;
  if(!label) {
    rm(b);
    delete _.bar;
    return
  }
  if(!b) {
    b = _.bar = ce('div');
    b.id = 'mpiv-bar';
  }
  b.innerHTML = label;
  if(!b.parentNode) {
    d.body.appendChild(b);
    b.clientHeight;
  }
  b.className = 'mpiv-show mpiv-' + cn;
}

function setTitle(reset) {
  if(reset) {
    if(typeof _.title == 'string') d.title = _.title;
  } else {
    if(typeof _.title != 'string') _.title = d.title;
    var p = _.popup;
    d.title = Math.round(_.scale * 100) + '% - ' + _.nwidth + 'x' + _.nheight;
  }
}

function rel2abs(rel, abs) {
  if(rel.indexOf('//') === 0) rel = 'http:' + rel;
  var re = /^([a-z]+:)?\/\//;
  if(re.test(rel))  return rel;
  if(!re.exec(abs)) return;
  if(rel[0] == '/') return abs.substr(0, abs.indexOf('/', RegExp.lastMatch.length)) + rel;
  return abs.substr(0, abs.lastIndexOf('/')) + '/' + rel;
}

function replace(s, m) {
  if(!m) return s;
  if(s.indexOf('/') === 0) {
    var mid = /[^\\]\//.exec(s).index+1;
    var end = s.lastIndexOf('/');
    var re = new RegExp(s.substring(1, mid), s.substr(end+1));
    return m.input.replace(re, s.substring(mid+1, end));
  }
  for(var i = m.length; i--;) {
    s = s.replace('$'+i, m[i]);
  }
  return s;
}

function addStyle(css) {
  var s = ce('style');
  s.textContent = css;
  d.head.appendChild(s);
  return s;
}

function styleSum(s, p) {
  for(var i = p.length, x = 0; i--;) {
    x += parseInt(s.getPropertyValue([p[i]])) || 0;
  }
  return x;
}

function hasBg(node) {
  return node ? wn.getComputedStyle(node).backgroundImage != 'none' && node.className.indexOf('YTLT-') < 0 : false;
}

function existsUnscaled(url, parent) {
  var imgs = parent.querySelectorAll('img, video');
  for(var i = imgs.length, img; i-- && (img = imgs[i]);) {
    if(img.src != url) continue;
    var scale = Math.max((img.naturalHeight || img.videoHeight)/img.offsetHeight, (img.naturalWidth || img.videoWidth)/img.offsetWidth);
    if(isNaN(scale) || scale < cfg.scale) return true;
  }
}

function viewRect() {
  var node = d.compatMode == 'BackCompat' ? d.body : d.documentElement;
  return {width:node.clientWidth, height:node.clientHeight};
}

function rect(node, q) {
  if(q) {
    var n = node;
    while(tag(n = n.parentNode) != 'BODY') {
      if(matches(n, q)) return n.getBoundingClientRect();
    }
  }
  var nodes = node.querySelectorAll('*');
  for(var i = nodes.length; i-- && (n = nodes[i]);) {
    if(n.offsetHeight > node.offsetHeight) node = n;
  }
  return node.getBoundingClientRect();
}

function matches(n, q) {
  var p = Element.prototype, m = p.mozMatchesSelector || p.webkitMatchesSelector || p.oMatchesSelector || p.matchesSelector || p.matches;
  if(m) return m.call(n, q);
}

function tag(n) {
  return n.tagName.toUpperCase();
}

function createDoc(text) {
  var doc = d.implementation.createHTMLDocument('MPIV');
  doc.documentElement.innerHTML = text;
  return doc;
}

function rm(n) {
  if(n && n.parentNode) n.parentNode.removeChild(n);
}

function on(n, e, f) {
  n.addEventListener(e, f);
}

function off(n, e, f) {
  n.removeEventListener(e, f);
}

function drop(e) {
  e.preventDefault();
  e.stopPropagation();
}

function ce(s) {
  return d.createElement(s);
}

function qs(s, n) {
  return n.querySelector(s);
}

function setup() {
  var $ = function(s) { return d.getElementById('mpiv-'+s); }
  var close = function() { rm($('setup')); if(trusted.indexOf(hostname) < 0) off(wn, 'message', onMessage); };
  var update = function() { $('delay').parentNode.style.display = $('preload').parentNode.style.display = $('start-auto').selected ? '' : 'none'; };
  var check = function(e) {
    var t = e.target, ok;
    try {
      var pes = t.previousElementSibling;
      if(t.value) {
        if(!pes) { var inp = t.cloneNode(); inp.value = ''; t.parentNode.insertBefore(inp, t); }
        new RegExp(JSON.parse(t.value).r);
      } else if(pes) {
        pes.focus();
        rm(t);
      }
      ok = 1;
    } catch(ex) {}
    t.style.backgroundColor = ok ? '' : '#ffaaaa';
  }
  var exp = function(e) {
    drop(e);
    var s = JSON.stringify(getCfg());
    if(typeof GM_setClipboard == 'function') {
      GM_setClipboard(s);
      wn.alert('Settings copied to clipboard!');
    } else {
      wn.alert(s);
    }
  };
  var imp = function(e) {
    drop(e);
    var s = wn.prompt('Paste settings:');
    if(!s) return;
    init(fixCfg(s));
  };
  var install = function(e) {
    drop(e);
    e.target.parentNode.innerHTML = '<span>Loading...</span><iframe style="width:100%;height:26px;border:0;margin:0;display:none;" src="//w9p.co/userscripts/mpiv/more_host_rules.html" onload="this.style.display=\'\';this.previousElementSibling.style.display=\'none\';"></iframe>';
  };
  var getCfg = function() {
    var cfg = {};
    var delay = parseInt($('delay').value);
    if(!isNaN(delay) && delay >= 0) cfg.delay = delay;
    var scale = parseFloat($('scale').value.replace(',', '.'));
    if(!isNaN(scale)) cfg.scale = Math.max(1, scale);
    cfg.thumbsonly = $('thumbsonly').selected;
    cfg.start = $('start-context').selected ? 'context' : ($('start-ctrl').selected ? 'ctrl' : 'auto');
    cfg.zoom = $('zoom-context').selected ? 'context' : ($('zoom-wheel').selected ? 'wheel' : ($('zoom-shift').selected ? 'shift' : 'auto'));
    cfg.center = $('center').checked;
    cfg.cursor = !$('cursor').checked;
    cfg.imgtab = $('imgtab').checked;
    cfg.close = $('close').selected;
    cfg.preload = $('preload').checked;
    cfg.css = $('css').value.trim();
    cfg.scales = $('scales').value.trim().split(/[,;]*\s+/).map(function(x) { return x.replace(',', '.'); }).filter(function(x) { return !isNaN(parseFloat(x)); });
    var inps = $('hosts').querySelectorAll('input'), lines = [];
    for(var i = 0; i < inps.length; i++) {
      var s = inps[i].value.trim();
      if(s) lines.push(s);
    }
    lines.sort();
    cfg.hosts = lines.join('\n');
    return fixCfg(JSON.stringify(cfg));
  };
  var init = function(cfg) {
    close();
    if(trusted.indexOf(hostname) < 0) on(wn, 'message', onMessage);
    addStyle('\
      #mpiv-setup { position:fixed;z-index:2147483647;top:20px;right:20px;padding:20px 30px;background:#eee;width:640px;border:1px solid black; }\
      #mpiv-setup * { color:black;text-align:left;line-height:15px;font-size:12px;font-family:sans-serif;box-shadow:none; }\
      #mpiv-setup a { color:darkblue!important;text-decoration:underline!important; }\
      #mpiv-setup ul { margin:10px 0 15px 0;padding:0;list-style:none;background:#eee;border:0; }\
      #mpiv-setup input, #mpiv-setup select, #mpiv-css { display:inline;border:1px solid gray;padding:2px;background:white; }\
      #mpiv-css { resize:vertical; height:45px; }\
      #mpiv-scales { width:130px; }\
      #mpiv-setup li { margin:0;padding:7px 0;vertical-align:middle;background:#eee;border:0 }\
      #mpiv-zoom { margin-right: 18px; }\
      #mpiv-delay, #mpiv-scale { width:36px; }\
      #mpiv-cursor, #mpiv-imgtab, #mpiv-preload { margin-left:18px; }\
      #mpiv-hosts { max-height:150px;overflow-y:auto; padding:2px; margin:4px 0; }\
      #mpiv-hosts input, #mpiv-css { width:98%;margin:3px 0; }\
      #mpiv-setup button { width:150px;margin:0 10px;text-align:center; }\
    ');
    var div = ce('div');
    div.id = 'mpiv-setup';
    d.body.appendChild(div);
    div.innerHTML = '\
      <div><a href="http://w9p.co/userscripts/mpiv/">Mouseover Popup Image Viewer</a><span style="float:right"><a href="#" id="mpiv-import">Import</a> | <a href="#" id="mpiv-export">Export</a></span></div><ul>\
      <li>Popup: <select><option id="mpiv-start-auto">automatically</option><option id="mpiv-start-context">right click or ctrl</option><option id="mpiv-start-ctrl">ctrl</option></select> <span>after <input id="mpiv-delay" type="text"/> ms</span> over <select><option>thumbnails and text links</option><option id="mpiv-thumbsonly">thumbnails only</option></select> <span><input type="checkbox" id="mpiv-preload"/> Preloading</span></li>\
      <li>Zoom: <select id="mpiv-zoom"><option id="mpiv-zoom-context">right click or shift</option><option id="mpiv-zoom-wheel">wheel up or shift</option><option id="mpiv-zoom-shift">shift</option><option id="mpiv-zoom-auto">automatically</option></select> Custom scale factors: <input type="text" id="mpiv-scales" placeholder="e.g. 0 0.5 1* 2"/> <span title="values smaller than popup\'s non-zoomed size are skipped, 0 = fit to window, 0! = same as 0 but replaces factors smaller than calculated value so zoom jumps directly to calculated value, asterisk after value marks default zoom factor (e.g. 1*)" style="cursor:help">(?)</span></li>\
      <li>Only show popup over scaled-down images when natural size is <input id="mpiv-scale" type="text"/> times larger</li>\
      <li><input type="checkbox" id="mpiv-center"/> Always centered <input type="checkbox" id="mpiv-cursor"/> Autohide cursor <input type="checkbox" id="mpiv-imgtab"/> Run in image tabs</li>\
      <li>If zooming out further is not possible, <select><option>stay in zoom mode</option><option id="mpiv-close">close popup</option></select></li>\
      <li><a href="http://w9p.co/userscripts/mpiv/css.html" target="_blank">Custom CSS:</a><div><textarea id="mpiv-css" spellcheck="false"></textarea></li>\
      <li><a href="http://w9p.co/userscripts/mpiv/host_rules.html" target="_blank">Custom host rules:</a><div id="mpiv-hosts"><input type="text" spellcheck="false"></div></li>\
      <li><a href="#" id="mpiv-install">Install rule from repository...</a></li>\
      </ul><div style="text-align:center"><button id="mpiv-ok">OK</button><button id="mpiv-cancel">Cancel</button></div>';
    if(cfg.hosts) {
      var parent = $('hosts');
      var lines = cfg.hosts.split(/[\r\n]+/);
      for(var i = 0, s, r; i < lines.length && (s = lines[i]); i++) {
        var inp = parent.firstElementChild.cloneNode();
        inp.value = s;
        parent.appendChild(inp);
        check({target:inp});
      }
    }
    on($('start-auto').parentNode, 'change', update);
    on($('cancel'), 'click', close);
    on($('export'), 'click', exp);
    on($('import'), 'click', imp);
    on($('hosts'), 'input', check);
    on($('install'), 'click', install);
    on($('ok'), 'click', function() {
      saveCfg(getCfg());
      hosts = loadHosts();
      close();
    });
    $('delay').value = cfg.delay;
    $('scale').value = cfg.scale;
    $('thumbsonly').selected = cfg.thumbsonly;
    $('center').checked = cfg.center;
    $('cursor').checked = !cfg.cursor;
    $('imgtab').checked = cfg.imgtab;
    $('close').selected = cfg.close;
    $('preload').checked = cfg.preload;
    $('css').value = cfg.css;
    $('scales').value = cfg.scales.join(' ');
    $('zoom-' + cfg.zoom).selected = true;
    $('start-' + cfg.start).selected = true;
    update();
    var free = viewRect().height - div.offsetHeight - 60;
    $('hosts').style.maxHeight = parseInt($('hosts').offsetHeight + 0.8 * free) + 'px';
    $('css').style.height = parseInt($('css').offsetHeight + 0.2 * free) + 'px';
    div = null;
  };
  init(loadCfg());
}

on(d, 'mouseover', onMouseOver);
if(hostname.indexOf('google') > -1) {
  var node = d.getElementById('main');
  if(node) on(node, 'mouseover', onMouseOver);
} else if(trusted.indexOf(hostname) > -1) {
  on(wn, 'message', onMessage);
  on(d, 'click', function(e) {
    var t = e.target;
    if(e.which != 1 || !/BLOCKQUOTE|CODE|PRE/.test(tag(t) + tag(t.parentNode)) || !/^\s*\{\s*".+:.+\}\s*$/.test(t.textContent)) return;
    wn.postMessage('mpiv-rule ' + t.textContent, '*');
    e.preventDefault();
  });
}
GM_registerMenuCommand('Set up Mouseover Popup Image Viewer', setup);
