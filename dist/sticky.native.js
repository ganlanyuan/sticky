/**
  * sticky.native (works with go-native)
  *
  * v0.1.5
  * @author William Lin
  * @license The MIT License (MIT)
  * https://github.com/ganlanyuan/sticky
  */

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
        CONTAINER,
        PADDING = options.padding,
        POSITION = options.position,
        WINDOWWIDTH = window.innerWidth,
        WINDOWHEIGHT = window.innerHeight;

    function Core (sticky) {
      this.sticky = sticky;
      this.stickyClassNames = this.sticky.className;

      this.isInRange = false;
      this.isWrapped = false;
      this.isSticking = false;
      this.isFixed = false;
      this.isAbsolute = false;
      this.stickyRectEdge = 0;
      this.containerRectEdge = false;

      this.init(); 

      var scope = this;
      gn.optimizedResize.add(function () { 
        scope.onResize(); 
      });

      window.addEventListener('scroll', function () { 
        scope.ticking = false;
        if (!scope.isWrapped) { return; }
        scope.stickyRectEdge = scope.jsWrapper.getBoundingClientRect()[POSITION];
        scope.containerRectEdge = (CONTAINER) ? CONTAINER.getBoundingClientRect().bottom : false;
        if (!scope.ticking) {
          window.requestAnimationFrame(function () {
            if (scope.isWrapped) {
              scope.onScroll(); 
            }
            scope.ticking = false;
          });
        }
        scope.ticking = true;
      });
    }

    Core.prototype = {
      // wrap sticky with a new <div>
      // to track sticky width and BoundingClientRect
      wrapSticky: function () {
        var parent = this.sticky.parentNode;
        if (parent.className.indexOf('sticky-container') !== -1) {
          this.jsWrapper = parent;
        } else {
          this.jsWrapper = document.createElement('div');
          this.jsWrapper.className = 'js-sticky-container';
          gn.wrap(this.sticky, this.jsWrapper);
        }

        this.isWrapped = true;
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

        this.isFixedBreakpoint = this.getFixedBreakpoint();
        this.isAbsoluteBreakpoint = this.getAbsoluteBreakpoint();
      },

      // destory:
      // restore everything when window size is not in the range
      // remove inserted <div>, classnames, styles and initialize ticking variables
      destory: function () {
        this.sticky.className = this.stickyClassNames;
        this.sticky.style.width = '';
        this.sticky.style[POSITION] = '';
        gn.unwrap(this.jsWrapper);

        if (this.isSticking) {
          this.sticky.className = this.sticky.className.replace(' js-sticky', '');
          this.sticky.style.position = '';
          this.sticky.style.width = '';
          this.sticky.style.top = '';
          this.sticky.style.bottom = '';
          this.isSticking = false;
          this.isFixed = false;
          this.isAbsolute = false;
        }

        this.isInRange = false;
        this.isWrapped = false;
        this.isSticking = false;
        this.isFixed = false;
        this.isAbsolute = false;
      },

      // check if the window size is in the range
      checkRange: function () {
        if (!BP) {
          return true;
        } else if (typeof BP === 'number') {
          return WINDOWWIDTH >= BP;
        } else if (Array.isArray(BP)) {
          switch (BP.length) {
            case 1:
              return WINDOWWIDTH >= BP[0];
            case 2:
              return WINDOWWIDTH >= BP[0] && WINDOWWIDTH < BP[1];
            case 3:
              return WINDOWWIDTH >= BP[0] && WINDOWWIDTH < BP[1] || WINDOWWIDTH >= BP[2];
            case 4:
              return WINDOWWIDTH >= BP[0] && WINDOWWIDTH < BP[1] || WINDOWWIDTH >= BP[2] && WINDOWWIDTH < BP[3];
          }
        }
      },

      // init:
      // check if the window is in the range
      // if so, wrap sticky with new <div> and store size information
      // otherwise，unwrap <div> and initialize variables
      init: function () {
        this.isInRange = this.checkRange();

        if (this.isInRange && !this.isWrapped) {
          this.wrapSticky();
          this.updateSizes();
        } else if (!this.isInRange && this.isWrapped) {
          this.destory();
        }

        if (this.isWrapped) {
          this.stickyRectEdge = this.jsWrapper.getBoundingClientRect()[POSITION];
          this.containerRectEdge = (CONTAINER) ? CONTAINER.getBoundingClientRect().bottom : false;

          this.onScroll();
          if (this.isSticking) { this.sticky.style.width = this.stickyWidth + 'px'; }
        }
      },

      // onresize:
      // same things with init, but always need to check size information to update sticky status,
      // and update sticky width while it's pinned or following
      onResize: function () {
        if (window.innerWidth !== WINDOWWIDTH) { WINDOWWIDTH = window.innerWidth; }
        if (window.innerHeight !== WINDOWHEIGHT) { WINDOWHEIGHT = window.innerHeight; }

        this.init();

        if (this.isWrapped) {
          this.updateSizes();
        }
      },

      // onscroll:
      // change sticky status based on sticky / container scrollTop
      // the adventage of using getBoundingClientRect().top instead of offsetTop is scope the sticky will not be affected by other element's height changing while scrolling
      // e.g. when window scroll down, the header become fixed positioned, thus height property become 0
      onScroll: function () {
        if (this.stickyRectEdge > this.isFixedBreakpoint) {
          // normal - non-sticky
          // reset position, top, bottom, width, height
          if (this.isSticking) {
            this.sticky.className = this.sticky.className.replace(' js-sticky', '');
            this.jsWrapper.style.height = '';
            this.sticky.style.position = '';
            this.sticky.style.width = '';
            this.sticky.style.top = '';
            this.sticky.style.bottom = '';
            this.isSticking = false;
            this.isFixed = false;
            this.isAbsolute = false;
          }
        } else {
          // add .js-sticky, set width, height
          if (!this.isSticking) {
            this.sticky.className += ' js-sticky';
            this.sticky.style.width = this.stickyWidth + 'px';
            this.jsWrapper.style.height = this.stickyHeight + 'px';
            this.isSticking = true;
          }

          if (CONTAINER) {
            if (!this.isFixed && this.stickyRectEdge <= this.isFixedBreakpoint && this.containerRectEdge > this.isAbsoluteBreakpoint) {
              // fixed (with container):
              // remove container relative-position
              CONTAINER.style.position = '';
              this.sticky.style.position = 'fixed';
              this.sticky.style[POSITION] = PADDING + 'px';
              if (POSITION === 'top') {
                this.sticky.style.bottom = '';
              }
              this.isFixed = true;
              this.isAbsolute = false;
            } else if (!this.isAbsolute && this.containerRectEdge <= this.isAbsoluteBreakpoint) {
              // absolute:
              CONTAINER.style.position = 'relative';
              this.sticky.style.position = 'absolute';
              if (POSITION === 'top') {
                this.sticky.style.top = '';
                this.sticky.style.bottom = '0px';
              }
              this.isFixed = false;
              this.isAbsolute = true;
            }
          } else {
            // fixed (without container)
            if (!this.isFixed && this.stickyRectEdge <= this.isFixedBreakpoint) {
              this.sticky.style.position = 'fixed';
              this.sticky.style[POSITION] = PADDING + 'px';
              this.isFixed = true;
            }
          }
        }
      },
    };

    gn.ready(function () {
      // get sticky elements on dom ready
      var stickyEls = document.querySelectorAll(options.sticky),
          arr = [];
      // if not sticky element been found, do nothing
      if (stickyEls.length === 0) { 
        throw new Error('"' + options.sticky + '" doesn\'t exist.');
      }

      // get CONTAINER on dom ready
      CONTAINER = (options.container) ? document.querySelector(options.container) : false;

      for (var i = stickyEls.length; i--;) {
        arr.push(new Core(stickyEls[i]));
      }

      // return sticky Array
      return arr;
    });
  };

})();

