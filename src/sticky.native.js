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
        POSITION = options.position;

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
          return this.windowHeight - PADDING;
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
            return this.windowHeight;
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
        this.windowHeight = window.innerHeight;

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
          return this.windowWidth >= BP;
        } else if (Array.isArray(BP)) {
          switch (BP.length) {
            case 2:
              return this.windowWidth >= BP[0] && this.windowWidth < BP[1];
            case 3:
              return this.windowWidth >= BP[0] && this.windowWidth < BP[1] || this.windowWidth >= BP[2];
            case 4:
              return this.windowWidth >= BP[0] && this.windowWidth < BP[1] || this.windowWidth >= BP[2] && this.windowWidth < BP[3];
          }
        }
      },

      // onload:
      // check if the window is in the range
      // if so, wrap sticky with new <div> and store size information
      // otherwise，unwrap <div> and initialize variables
      onLoad: function () {
        this.windowWidth = window.innerWidth;
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