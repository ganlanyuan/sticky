/**
  * sticky (works with go-native)
  *
  * v0.1.1
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

  function sticky (options) {
    options = gn.extend({ 
      sticky: '.sticky',
      container: false,
      padding: 0,
      position: 'top',
      breakpoints: false,
    }, options || {});

    var stickyEls = document.querySelectorAll(options.sticky);
    if (stickyEls.length === 0) { return; }

    for (var i = stickyEls.length; i--;) {
      var newOptions = options;
      newOptions.sticky = stickyEls[i];

      return new Core(newOptions);
    }
  }

  function Core (options) {
    // basic variables
    this.bp = options.breakpoints;
    this.sticky = options.sticky;
    this.stickyClassNames = this.sticky.className;
    this.container = (options.container) ? document.querySelector(options.container) : false;
    this.padding = options.padding;
    this.position = options.position;

    // global variables:
    // sticky, container and window sizes
    // ticking variables
    this.inRange = false;
    this.initialized = false;
    this.isSticky = false;
    this.fixed = false;
    this.absolute = false;

    this.stickyRectEdge = 0;
    this.containerRectEdge = false;
    this.ticking = false;


    var scope = this;
    window.addEventListener('load', function () { 
      scope.onLoad(); 
    });

    gn.optimizedResize.add(function () { 
      scope.onResize(); 
    });

    window.addEventListener('scroll', function () { 
      if (!scope.initialized) { return; }
      scope.stickyRectEdge = scope.jsWrapper.getBoundingClientRect()[scope.position];
      scope.containerRectEdge = (scope.container) ? scope.container.getBoundingClientRect().bottom : false;
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
      this.jsWrapper = document.createElement('div');
      this.jsWrapper.className = 'js-sticky-container';
      gn.wrap(this.sticky, this.jsWrapper);

      this.initialized = true;
    },

    // get pinned / fixed breakpoint
    // based on sticky getBoundingClientRect().top/bottom
    getFixedBreakpoint: function () {
      if (this.position === 'top') {
        return this.padding;
      } else {
        return this.windowHeight - this.padding;
      }
    },

    // get followed / absolute breakpoint
    // based on container getBoundingClientRect().bottom
    getAbsoluteBreakpoint: function () {
      if (!this.container) {
        return false;
      } else {
        if (this.position === 'top') {
          return  this.stickyHeight + this.padding;
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
      this.sticky.style[this.position] = '';
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
      if (!this.bp) {
        return true;
      } else if (typeof this.bp === 'number') {
        return this.windowWidth >= this.bp;
      } else if (Array.isArray(this.bp)) {
        switch (this.bp.length) {
          case 2:
            return this.windowWidth >= this.bp[0] && this.windowWidth < this.bp[1];
          case 3:
            return this.windowWidth >= this.bp[0] && this.windowWidth < this.bp[1] || this.windowWidth >= this.bp[2];
          case 4:
            return this.windowWidth >= this.bp[0] && this.windowWidth < this.bp[1] || this.windowWidth >= this.bp[2] && this.windowWidth < this.bp[3];
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
        this.stickyRectEdge = this.jsWrapper.getBoundingClientRect()[this.position];
        this.containerRectEdge = (this.container) ? this.container.getBoundingClientRect().bottom : false;

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

        if (this.container) {
          if (!this.fixed && this.stickyRectEdge <= this.fixedBreakpoint && this.containerRectEdge > this.absoluteBreakpoint) {
            // fixed (with container):
            // remove container relative-position
            if (this.container) {
              this.container.style.position = '';
            }
            this.sticky.style.position = 'fixed';
            this.sticky.style[this.position] = this.padding + 'px';
            if (this.position === 'top') {
              this.sticky.style.bottom = '';
            }
            this.fixed = true;
            this.absolute = false;
          } else if (!this.absolute && this.containerRectEdge <= this.absoluteBreakpoint) {
            // absolute:
            this.container.style.position = 'relative';
            this.sticky.style.position = 'absolute';
            if (this.position === 'top') {
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
            this.sticky.style[this.position] = this.padding + 'px';
            this.fixed = true;
          }
        }
      }
    },
  };

  return sticky;
})();