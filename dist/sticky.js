Date.now                = Date.now                || function(){return +new Date};
String.prototype.trim   = String.prototype.trim   || function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");};
Object.defineProperties = Object.defineProperties || function(obj, props){for(var i in props) Object.defineProperty(obj, i, props[i]);};
Array.isArray           = Array.isArray           || function(obj){return "[object Array]" === Object.prototype.toString.call(obj)};
Number.isNaN            = Number.isNaN            || function(val){return val !== val};
String.prototype.repeat = String.prototype.repeat || function(num){return Array(num + 1).join(this)};


// Adapted from https://gist.github.com/paulirish/1579671 which derived from 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    'use strict';
    
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());


(function(window, document, undefined){
"use strict";

// create a test element
var testElem = document.createElement('test'),
    docElement = document.documentElement,
    defaultView = document.defaultView,
    getComputedStyle = defaultView && defaultView.getComputedStyle,
    computedValueBug,
    runit = /^(-?[\d+\.\-]+)([a-z]+|%)$/i,
    convert = {},
    conversions = [1/25.4, 1/2.54, 1/72, 1/6],
    units = ['mm', 'cm', 'pt', 'pc', 'in', 'mozmm'],
    i = 6; // units.length

// add the test element to the dom
docElement.appendChild(testElem);

// test for the WebKit getComputedStyle bug
// @see http://bugs.jquery.com/ticket/10639
if (getComputedStyle) {
    // add a percentage margin and measure it
    testElem.style.marginTop = '1%';
    computedValueBug = getComputedStyle(testElem).marginTop === '1%';
}

// pre-calculate absolute unit conversions
while(i--) {
    convert[units[i] + "toPx"] = conversions[i] ? conversions[i] * convert.inToPx : toPx(testElem, '1' + units[i]);
}

// remove the test element from the DOM and delete it
docElement.removeChild(testElem);
testElem = undefined;

// convert a value to pixels
function toPx(elem, value, prop, force) {
    // use width as the default property, or specify your own
    prop = prop || 'width';

    var style,
        inlineValue,
        ret,
        unit = (value.match(runit)||[])[2],
        conversion = unit === 'px' ? 1 : convert[unit + 'toPx'],
        rem = /r?em/i;

    if (conversion || rem.test(unit) && !force) {
        // calculate known conversions immediately
        // find the correct element for absolute units or rem or fontSize + em or em
        elem = conversion ? elem : unit === 'rem' ? docElement : prop === 'fontSize' ? elem.parentNode || elem : elem;

        // use the pre-calculated conversion or fontSize of the element for rem and em
        conversion = conversion || parseFloat(curCSS(elem, 'fontSize'));

        // multiply the value by the conversion
        ret = parseFloat(value) * conversion;
    } else {
        // begin "the awesome hack by Dean Edwards"
        // @see http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

        // remember the current style
        style = elem.style;
        inlineValue = style[prop];

        // set the style on the target element
        try {
            style[prop] = value;
        } catch(e) {
            // IE 8 and below throw an exception when setting unsupported units
            return 0;
        }

        // read the computed value
        // if style is nothing we probably set an unsupported unit
        ret = !style[prop] ? 0 : parseFloat(curCSS(elem, prop));

        // reset the style back to what it was or blank it out
        style[prop] = inlineValue !== undefined ? inlineValue : null;
    }

    // return a number
    return ret;
}

// return the computed value of a CSS property
function curCSS(elem, prop) {
    var value,
        pixel,
        unit,
        rvpos = /^top|bottom/,
        outerProp = ["paddingTop", "paddingBottom", "borderTop", "borderBottom"],
        innerHeight,
        parent,
        i = 4; // outerProp.length
    
    if (getComputedStyle) {
        // FireFox, Chrome/Safari, Opera and IE9+
        value = getComputedStyle(elem)[prop];
    } else if (pixel = elem.style['pixel' + prop.charAt(0).toUpperCase() + prop.slice(1)]) {
        // IE and Opera support pixel shortcuts for top, bottom, left, right, height, width
        // WebKit supports pixel shortcuts only when an absolute unit is used
        value = pixel + 'px';
    } else if (prop === 'fontSize') {
        // correct IE issues with font-size
        // @see http://bugs.jquery.com/ticket/760
        value = toPx(elem, '1em', 'left', 1) + 'px';
    } else {
        // IE 8 and below return the specified style
        value = elem.currentStyle[prop];
    }

    // check the unit
    unit = (value.match(runit)||[])[2];
    if (unit === '%' && computedValueBug) {
        // WebKit won't convert percentages for top, bottom, left, right, margin and text-indent
        if (rvpos.test(prop)) {
            // Top and bottom require measuring the innerHeight of the parent.
            innerHeight = (parent = elem.parentNode || elem).offsetHeight;
            while (i--) {
              innerHeight -= parseFloat(curCSS(parent, outerProp[i]));
            }
            value = parseFloat(value) / 100 * innerHeight + 'px';
        } else {
            // This fixes margin, left, right and text-indent
            // @see https://bugs.webkit.org/show_bug.cgi?id=29084
            // @see http://bugs.jquery.com/ticket/10639
            value = toPx(elem, value);
        }
    } else if ((value === 'auto' || (unit && unit !== 'px')) && getComputedStyle) {
        // WebKit and Opera will return auto in some cases
        // Firefox will pass back an unaltered value when it can't be set, like top on a static element
        value = 0;
    } else if (unit && unit !== 'px' && !getComputedStyle) {
        // IE 8 and below won't convert units for us
        // try to convert using a prop that will return pixels
        // this will be accurate for everything (except font-size and some percentages)
        value = toPx(elem, value) + 'px';
    }
    return value;
}

// expose the conversion function to the window object
window.Length = {
    toPx: toPx
};
}(this, this.document));

// *** gn *** //
var gn = {};

/** 
  * optimizedResize
  * https://developer.mozilla.org/en-US/docs/Web/Events/resize#requestAnimationFrame
  */

gn.optimizedResize = (function() {

  var callbacks = [],
  running = false;

  // fired on resize event
  function resize() {

    if (!running) {
      running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(runCallbacks);
      } else {
        setTimeout(runCallbacks, 66);
      }
    }

  }

  // run the actual callbacks
  function runCallbacks() {

    callbacks.forEach(function(callback) {
      callback();
    });

    running = false;
  }

  // adds callback to loop
  function addCallback(callback) {

    if (callback) {
      callbacks.push(callback);
    }

  }

  return {
    // public method to add additional callback
    add: function(callback) {
      if (!callbacks.length) {
        window.addEventListener('resize', resize);
      }
      addCallback(callback);
    }
  };
}());

// start process
// optimizedResize.add(function() {
//   console.log('Resource conscious resize callback!')
// });

/* extend */
gn.extend = function () {
  var obj, name, copy,
  target = arguments[0] || {},
  i = 1,
  length = arguments.length;

  for (; i < length; i++) {
    if ((obj = arguments[i]) !== null) {
      for (name in obj) {
        copy = obj[name];

        if (target === copy) {
          continue;
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
};

/** isNodeList **/
gn.isNodeList = function (el) {
  // Only NodeList has the "item()" function
  return typeof el.item !== 'undefined'; 
};


/** wrap **/
gn.wrap = function (els, obj) {
    var elsNew = (gn.isNodeList(els)) ? els : [els];
  // Loops backwards to prevent having to clone the wrapper on the
  // first element (see `wrapper` below).
  for (var i = elsNew.length; i--;) {
      var wrapper = (i > 0) ? obj.cloneNode(true) : obj,
          el = elsNew[i];

      // Cache the current parent and sibling.
      var parent = el.parentNode,
          sibling = el.nextSibling;

      // Wrap the element (is automatically removed from its current parent).
      wrapper.appendChild(el);

      // If the element had a sibling, insert the wrapper before
      // the sibling to maintain the HTML structure; otherwise, just
      // append it to the parent.
      if (sibling) {
          parent.insertBefore(wrapper, sibling);
      } else {
          parent.appendChild(wrapper);
      }
  }
};



/* unwrap */
gn.unwrap = function (els) {
  var elsNew = (gn.isNodeList(els)) ? els : [els];
  for (var i = elsNew.length; i--;) {
    var el = elsNew[i];

    // get the element's parent node
    var parent = el.parentNode;
    
    // move all children out of the element
    while (el.firstChild) { 
      parent.insertBefore(el.firstChild, el); 
    }
    
    // remove the empty element
    parent.removeChild(el);
  }
};

/**
  * sticky (works with go-native)
  *
  * v0.1.3
  * @author William Lin
  * @license The MIT License (MIT)
  * https://github.com/ganlanyuan/sticky
  */

// DEPENDENCIES:
//
// == IE8 ==
// html5shiv
// ES5-arrays
// addEventListener
// window.getComputedStyle
// window.innerHeight
//
// == all ==
// Array.isArray
// requestAnimationFrame
// optimizedResize
// extend
// Length
// isNodeList
// wrap
// unwrap

var sticky = (function () {
  'use strict';

  return function (options) {
    options = gn.extend({ 
      sticky: '.sticky',
      container: false,
      padding: 0,
      position: 'top',
      breakpoints: false,
    }, options || {});

    var BP = options.breakpoints,
        CONTAINER = (options.container) ? document.querySelector(options.container) : false,
        PADDING = options.padding,
        POSITION = options.position,
        WINDOWWIDTH = window.innerWidth,
        WINDOWHEIGHT = window.innerHeight;

    function Core (sticky) {
      this.sticky = sticky;
      this.stickyClassNames = this.sticky.className;

      this.inRange = false;
      this.initialized = false;
      this.isSticky = false;
      this.fixed = false;
      this.absolute = false;
      this.stickyRectEdge = 0;
      this.containerRectEdge = false;

      var scope = this;
      window.addEventListener('load', function () { 
        scope.onLoad(); 
      });

      gn.optimizedResize.add(function () { 
        scope.onResize(); 
      });

      window.addEventListener('scroll', function () { 
        scope.ticking = false;
        if (!scope.initialized) { return; }
        scope.stickyRectEdge = scope.jsWrapper.getBoundingClientRect()[POSITION];
        scope.containerRectEdge = (CONTAINER) ? CONTAINER.getBoundingClientRect().bottom : false;
        if (!scope.ticking) {
          window.requestAnimationFrame(function () {
            if (scope.initialized) {
              scope.onScroll(); 
            }
            scope.ticking = false;
          });
        }
        scope.ticking = true;
      });
    }

    Core.prototype = {
      // init: 
      // wrap sticky with a new <div>
      // to track sticky width and BoundingClientRect
      init: function () {
        var parent = this.sticky.parentNode;
        if (parent.className.indexOf('sticky-container') !== -1) {
          this.jsWrapper = parent;
        } else {
          this.jsWrapper = document.createElement('div');
          this.jsWrapper.className = 'js-sticky-container';
          gn.wrap(this.sticky, this.jsWrapper);
        }

        this.initialized = true;
      },

      // get pinned / fixed breakpoint
      // based on sticky getBoundingClientRect().top/bottom
      getFixedBreakpoint: function () {
        if (POSITION === 'top') {
          return PADDING;
        } else {
          return WINDOWHEIGHT - PADDING;
        }
      },

      // get followed / absolute breakpoint
      // based on container getBoundingClientRect().bottom
      getAbsoluteBreakpoint: function () {
        if (!CONTAINER) {
          return false;
        } else {
          if (POSITION === 'top') {
            return  this.stickyHeight + PADDING;
          } else {
            return WINDOWHEIGHT;
          }
        }
      },

      // update sizes:
      // get sticky, container and window information to calculate
      // two breakpoints: pinned to window / follow container
      // 
      // do this on document load & window resize
      updateSizes: function () {
        var style = window.getComputedStyle(this.sticky),
            pattern = /\d/, // check if value contains digital number
            left = (pattern.exec(style.marginLeft) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginLeft)),
            right = (pattern.exec(style.marginRight) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginRight)),
            top = (pattern.exec(style.marginTop) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginTop)),
            bottom = (pattern.exec(style.marginBottom) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginBottom));

        // update sizes, position and breakpoints
        this.stickyWidth = this.jsWrapper.clientWidth - left - right;
        this.stickyHeight = this.sticky.offsetHeight + top + bottom;

        this.fixedBreakpoint = this.getFixedBreakpoint();
        this.absoluteBreakpoint = this.getAbsoluteBreakpoint();
      },

      // destory:
      // restore everything when window size is not in the range
      // remove inserted <div>, classnames, styles and initialize ticking variables
      destory: function () {
        this.sticky.className = this.stickyClassNames;
        this.sticky.style.width = '';
        this.sticky.style[POSITION] = '';
        gn.unwrap(this.jsWrapper);

        if (this.isSticky) {
          this.sticky.className = this.sticky.className.replace(' js-sticky', '');
          this.sticky.style.position = '';
          this.sticky.style.width = '';
          this.sticky.style.top = '';
          this.sticky.style.bottom = '';
          this.isSticky = false;
          this.fixed = false;
          this.absolute = false;
        }

        this.inRange = false;
        this.initialized = false;
        this.isSticky = false;
        this.fixed = false;
        this.absolute = false;
      },

      // check if the window size is in the range
      checkRange: function () {
        if (!BP) {
          return true;
        } else if (typeof BP === 'number') {
          return WINDOWWIDTH >= BP;
        } else if (Array.isArray(BP)) {
          switch (BP.length) {
            case 2:
              return WINDOWWIDTH >= BP[0] && WINDOWWIDTH < BP[1];
            case 3:
              return WINDOWWIDTH >= BP[0] && WINDOWWIDTH < BP[1] || WINDOWWIDTH >= BP[2];
            case 4:
              return WINDOWWIDTH >= BP[0] && WINDOWWIDTH < BP[1] || WINDOWWIDTH >= BP[2] && WINDOWWIDTH < BP[3];
          }
        }
      },

      // onload:
      // check if the window is in the range
      // if so, wrap sticky with new <div> and store size information
      // otherwise，unwrap <div> and initialize variables
      onLoad: function () {
        this.inRange = this.checkRange();

        if (this.inRange && !this.initialized) {
          this.init();
          this.updateSizes();
        } else if (!this.inRange && this.initialized) {
          this.destory();
        }

        if (this.initialized) {
          this.stickyRectEdge = this.jsWrapper.getBoundingClientRect()[POSITION];
          this.containerRectEdge = (CONTAINER) ? CONTAINER.getBoundingClientRect().bottom : false;

          this.onScroll();
          if (this.isSticky) { this.sticky.style.width = this.stickyWidth + 'px'; }
        }
      },

      // onresize:
      // same things with onload, but always need to chase size information to update sticky status,
      // and update sticky width while it's pinned or following
      onResize: function () {
        if (window.innerWidth !== WINDOWWIDTH) { WINDOWWIDTH = window.innerWidth; }
        if (window.innerHeight !== WINDOWHEIGHT) { WINDOWHEIGHT = window.innerHeight; }

        this.onLoad();

        if (this.initialized) {
          this.updateSizes();
        }
      },

      // onscroll:
      // change sticky status based on sticky / container scrollTop
      // the adventage of using getBoundingClientRect().top instead of offsetTop is scope the sticky will not be affected by other element's height changing while scrolling
      // e.g. when window scroll down, the header become fixed positioned, thus height property become 0
      onScroll: function () {
        if (this.stickyRectEdge > this.fixedBreakpoint) {
          // normal - non-sticky
          // reset position, top, bottom, width, height
          if (this.isSticky) {
            this.sticky.className = this.sticky.className.replace(' js-sticky', '');
            this.jsWrapper.style.height = '';
            this.sticky.style.position = '';
            this.sticky.style.width = '';
            this.sticky.style.top = '';
            this.sticky.style.bottom = '';
            this.isSticky = false;
            this.fixed = false;
            this.absolute = false;
          }
        } else {
          // add .js-sticky, set width, height
          if (!this.isSticky) {
            this.sticky.className += ' js-sticky';
            this.sticky.style.width = this.stickyWidth + 'px';
            this.jsWrapper.style.height = this.stickyHeight + 'px';
            this.isSticky = true;
          }

          if (CONTAINER) {
            if (!this.fixed && this.stickyRectEdge <= this.fixedBreakpoint && this.containerRectEdge > this.absoluteBreakpoint) {
              // fixed (with container):
              // remove container relative-position
              CONTAINER.style.position = '';
              this.sticky.style.position = 'fixed';
              this.sticky.style[POSITION] = PADDING + 'px';
              if (POSITION === 'top') {
                this.sticky.style.bottom = '';
              }
              this.fixed = true;
              this.absolute = false;
            } else if (!this.absolute && this.containerRectEdge <= this.absoluteBreakpoint) {
              // absolute:
              CONTAINER.style.position = 'relative';
              this.sticky.style.position = 'absolute';
              if (POSITION === 'top') {
                this.sticky.style.top = '';
                this.sticky.style.bottom = '0px';
              }
              this.fixed = false;
              this.absolute = true;
            }
          } else {
            // fixed (without container)
            if (!this.fixed && this.stickyRectEdge <= this.fixedBreakpoint) {
              this.sticky.style.position = 'fixed';
              this.sticky.style[POSITION] = PADDING + 'px';
              this.fixed = true;
            }
          }
        }
      },
    };

    var stickyEls = document.querySelectorAll(options.sticky),
        arr = [];
    if (stickyEls.length === 0) { return; }

    for (var i = stickyEls.length; i--;) {
      var a = new Core(stickyEls[i]);
      arr.unshift(a);
    }

    return arr;
  };

})();

/**
  * sticky 
  *
  * v0.1.3
  * @author William Lin
  * @license The MIT License (MIT)
  * https://github.com/ganlanyuan/sticky
  */

// @codekit-prepend "../bower_components/fix-ie/src/es5-methods.js";
// @codekit-prepend "../bower_components/requestAnimationFrame/requestAnimationFrame.js";
// @codekit-prepend "../bower_components/Units/Length.js";
// @codekit-prepend "../bower_components/go-native/src/components/gn.js";
// @codekit-prepend "../bower_components/go-native/src/components/optimizedResize.js";
// @codekit-prepend "../bower_components/go-native/src/components/extend.js";
// @codekit-prepend "../bower_components/go-native/src/components/isNodeList.js";
// @codekit-prepend "../bower_components/go-native/src/components/wrap.js";
// @codekit-prepend "../bower_components/go-native/src/components/unwrap.js";

// @codekit-prepend "sticky.native.js";



