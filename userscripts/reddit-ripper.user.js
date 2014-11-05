// ==UserScript==
// @name            Reddit Ripper
// @author          @travis-g
// @namespace       http://gist.github.com/
// @description     Remove reddit adds/sidebars for a simpler reddit UI
// @license         WTFPL 2 (http://wtfpl2.com/)
// @version         0.0.1
// @include         http*://*.reddit.com/*
// @released        2014-10-31
// @updated         2014-10-31
// @compatible      Greasemonkey
// ==/UserScript==  // UserScript Metadata
(function(){

  var CSS = ""
  
  function stylesheetInjector(){ // constructor
    this.inject_stylesheet(CSS);
  };

  stylesheetInjector.prototype.inject_stylesheet = function(css){
    var payload = document.createElement("style");
    payload.setAttribute('type', 'text/css');
    payload.appendChild(document.createTextNode(css));

    // insert payload at the end of zeroth <head> element
    document.getElementsByTagName('head')[0].appendChild(payload);
  };

  var stylesheetInjector = new stylesheetInjector();  // instantiate & construct

  var 
})();
// vim: set et:sw=2:ts=2:sts=2:ft=javascript
