// Array.isArray
if (!Array.isArray) {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) == "[object Array]";
    };
}
// forEach

if (!Array.prototype.forEach) {
    Array.prototype.forEach =  function(block, thisObject) {
        var len = this.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (i in this) {
                block.call(thisObject, this[i], i, this);
            }
        }
    };
}

// addEventListener
// removeEventListener
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener?redirectlocale=en-US&redirectslug=DOM%2FEventTarget.addEventListener#Compatibility

(function() {
  if (!Element.prototype.addEventListener) {
    var eventListeners=[];
    
    var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var self=this;
      var wrapper=function(e) {
        e.target=e.srcElement;
        e.currentTarget=self;
        if (typeof listener.handleEvent != 'undefined') {
          listener.handleEvent(e);
        } else {
          listener.call(self,e);
        }
      };
      if (type=="DOMContentLoaded") {
        var wrapper2=function(e) {
          if (document.readyState=="complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange",wrapper2);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
        
        if (document.readyState=="complete") {
          var e=new Event();
          e.srcElement=window;
          wrapper2(e);
        }
      } else {
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      }
    };
    var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var counter=0;
      while (counter<eventListeners.length) {
        var eventListener=eventListeners[counter];
        if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
          if (type=="DOMContentLoaded") {
            this.detachEvent("onreadystatechange",eventListener.wrapper);
          } else {
            this.detachEvent("on"+type,eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener=addEventListener;
    Element.prototype.removeEventListener=removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener=addEventListener;
      HTMLDocument.prototype.removeEventListener=removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener=addEventListener;
      Window.prototype.removeEventListener=removeEventListener;
    }
  }
})();
// getComputedStyle

(function(){
  "use strict";
  
  if(!window.getComputedStyle){
    window.getComputedStyle = function(el){
      if(!el) { return null; }
      
      /**
       * currentStyle returns an instance of a non-standard class called "CSSCurrentStyleDeclaration"
       * instead of "CSSStyleDeclaration", which has a few methods and properties missing (such as cssText).
       * https://msdn.microsoft.com/en-us/library/cc848941(v=vs.85).aspx
       *
       * Instead of returning the currentStyle value directly, we'll copy its properties to the style
       * of a shadow element. This ensures cssText is included, and ensures the result is an instance of
       * the correct DOM interface.
       *
       * There'll still be some minor discrepancies in the style values. For example, IE preserves the way
       * colour values were authored, whereas standards-compliant browsers will expand colours to use "rgb()"
       * notation. We won't bother to fix things like these, as they'd involve too much fiddling for little
       * gain.
       */
      
      var style   = el.currentStyle;
      var box     = el.getBoundingClientRect();
      var shadow  = document.createElement("div");
      var output  = shadow.style;
      for(var i in style) {
        output[i] = style[i];
      }
      
      /** Fix some glitches */
      output.cssFloat = output.styleFloat;
      if("auto" === output.width) { output.width  = (box.right - box.left) + "px"; }
      if("auto" === output.height) { output.height = (box.bottom - box.top) + "px"; }
      return output;
    };
  } 
})();
// window.innerWidth

(function () {
  "use strict";

  if(!("innerWidth" in window)){
    Object.defineProperty(window, "innerWidth",  {
      get: function(){ 
        return (document.documentElement || document.body.parentNode || document.body).clientWidth; 
      }
    });
  }
})();
// window.innerHeight

(function () {
  "use strict";

  if(!("innerHeight" in window)){
    Object.defineProperty(window, "innerHeight", {
      get: function(){ 
        return (document.documentElement || document.body.parentNode || document.body).clientHeight; 
      }
    });
  }
})();