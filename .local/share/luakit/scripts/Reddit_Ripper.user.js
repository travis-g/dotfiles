// ==UserScript==
// @name        Reddit Ripper
// @namespace   http://tjg.io
// @description Rip reddit UI elements (written for netbooks)
// @include     http*://*.reddit.com/*
// @version     0.0.1
// @grant       none
// ==/UserScript==
(function(){
  function stylesheetInjector(){
    this.inject_stylesheet('\
.side, .organic-listing,\
.expando-button {display:none !important;}\
      ');
  };

  stylesheetInjector.prototype.inject_stylesheet = function(css){
    var payload = document.createElement("style");
    payload.setAttribute('type', 'text/css');
    payload.appendChild(document.createTextNode(css));

    // insert payload at the end of zeroeth <head> element
    document.getElementsByTagName('head')[0].appendChild(payload);
  };

  var stylesheetInjector = new stylesheetInjector();  // instantiate & construct
})();
// vim: set et:sw=2:ts=2:ft=javascript