/**
  * sticky 
  *
  * @author William Lin
  * @license The MIT License (MIT)
  * https://github.com/ganlanyuan/sticky
  * 
  * DEPENDENCIES:
  *
  * == IE8 ==
  * html5shiv
  * ES5-arrays
  * addEventListener
  * window.getComputedStyle
  * window.innerHeight
  *
  * == all ==
  * Array.isArray
  * requestAnimationFrame
  * optimizedResize
  * extend
  * Length
  * isNodeList
  * wrap
  * unwrap
  */

;(function (stickyJS) {
  window.sticky = stickyJS();
})(function () {
  'use strict';

  function sticky (options) {
    if (!options.sticky) { options.sticky = '.sticky'; }

    var stickyEls = document.querySelectorAll(options.sticky);
    if (stickyEls.length === 0) { return; }

    for (var i = stickyEls.length; i--;) {
      var newOptions = options;
      newOptions.sticky = stickyEls[i];

      return new StickyCore(newOptions);
    }
  }

  function StickyCore (options) {
    options = gn.extend({ 
      sticky: '.sticky',
      container: false,
      padding: 0,
      position: 'top',
      breakpoints: false,
    }, options || {});

    // basic variables
    var
        bp = options.breakpoints,
        sticky = options.sticky,
        stickyClassNames = sticky.className,
        container = (options.container) ? document.querySelector(options.container) : false,
        padding = options.padding,
        position = options.position;

    // global variables:
    // sticky, container and window sizes
    // ticking variables
    var 
        jsWrapper,
        windowWidth,
        windowHeight,
        stickyWidth,
        stickyHeight,
        fixedBreakpoint,
        absoluteBreakpoint,

        inRange = false,
        initialized = false,
        isSticky = false,
        fixed = false,
        absolute = false,

        stickyRectEdge = 0,
        containerRectEdge = false,
        ticking = false;

    // init: 
    // wrap sticky with a new <div>
    // to track sticky width and BoundingClientRect
    this.init = function () {
      jsWrapper = document.createElement('div');
      jsWrapper.className = 'js-sticky-wrapper';
      gn.wrap(sticky, jsWrapper);

      initialized = true;
    };

    // get pinned / fixed breakpoint
    // based on sticky scrollTop (getBoundingClientRect().top)
    this.getFixedBreakpoint = function () {
      if (position === 'top') {
        return padding;
      } else {
        return windowHeight - padding;
      }
    };

    // get followed / absolute breakpoint
    // based on container scrollTop (getBoundingClientRect().top)
    this.getAbsoluteBreakpoint = (function () {
      if (!container) {
        return function () { return false; };
      } else {
        return function () {
          if (position === 'top') {
            return  stickyHeight + padding;
          } else {
            return windowHeight;
          }
        };
      }
    })();

    // update sizes:
    // get sticky, container and window information to calculate
    // two breakpoints: pinned to window / follow container
    // 
    // do this on document load & window resize
    this.updateSizes = function () {
      var style = window.getComputedStyle(sticky),
          pattern = /\d/, // check if value contains digital number
          left = (pattern.exec(style.marginLeft) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginLeft)),
          right = (pattern.exec(style.marginRight) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginRight)),
          top = (pattern.exec(style.marginTop) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginTop)),
          bottom = (pattern.exec(style.marginBottom) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginBottom));

      // update sizes, position and breakpoints
      stickyWidth = jsWrapper.clientWidth - left - right;
      stickyHeight = sticky.offsetHeight + top + bottom;
      windowHeight = window.innerHeight;

      fixedBreakpoint = this.getFixedBreakpoint();
      absoluteBreakpoint = this.getAbsoluteBreakpoint();
    };

    // destory:
    // restore everything when window size is not in the range
    // remove inserted <div>, classnames, styles and initialize ticking variables
    this.destory = function () {
      sticky.className = stickyClassNames;
      sticky.style.width = '';
      sticky.style[position] = '';
      gn.unwrap(jsWrapper);

      if (isSticky) {
        sticky.className = sticky.className.replace(' js-sticky', '');
        sticky.style.position = '';
        sticky.style.width = '';
        sticky.style.top = '';
        sticky.style.bottom = '';
        isSticky = false;
        fixed = false;
        absolute = false;
      }

      inRange = false;
      initialized = false;
      isSticky = false;
      fixed = false;
      absolute = false;
    };

    // check if the window size is in the range
    this.checkRange = (function () {
      if (!bp) {
        return function () { return true; };
      } else if (typeof bp === 'number') {
        return function () { return windowWidth >= bp; };
      } else if (Array.isArray(bp)) {
        switch (bp.length) {
          case 2:
            return function () { return windowWidth >= bp[0] && windowWidth < bp[1]; };
          case 3:
            return function () { return windowWidth >= bp[0] && windowWidth < bp[1] || windowWidth >= bp[2]; };
          case 4:
            return function () { return windowWidth >= bp[0] && windowWidth < bp[1] || windowWidth >= bp[2] && windowWidth < bp[3]; };
        }
      }
    })();

    // onload:
    // check if the window is in the range
    // if so, wrap sticky with new <div> and store size information
    // otherwise，unwrap <div> and initialize variables
    this.onLoad = function () {
      windowWidth = window.innerWidth;
      inRange = this.checkRange();

      if (inRange && !initialized) {
        this.init();
        this.updateSizes();
      } else if (!inRange && initialized) {
        this.destory();
      }

      if (initialized) {
        stickyRectEdge = jsWrapper.getBoundingClientRect()[position];
        containerRectEdge = (container) ? container.getBoundingClientRect().bottom : false;

        this.onScroll();
        if (isSticky) { sticky.style.width = stickyWidth + 'px'; }
      }
    };

    // onresize:
    // same things with onload, but always need to chase size information to update sticky status,
    // and update sticky width while it's pinned or following
    this.onResize = function () {
      this.onLoad();

      if (initialized) {
        this.updateSizes();
      }
    };

    // onscroll:
    // change sticky status based on sticky / container scrollTop
    // the adventage of using getBoundingClientRect().top instead of offsetTop is that the sticky will not be affected by other element's height changing while scrolling
    // e.g. when window scroll down, the header become fixed positioned, thus height property become 0
    this.onScroll = function () {
      if (stickyRectEdge > fixedBreakpoint) {
        // normal - non-sticky
        // reset position, top, bottom, width, height
        if (isSticky) {
          sticky.className = sticky.className.replace(' js-sticky', '');
          jsWrapper.style.height = '';
          sticky.style.position = '';
          sticky.style.width = '';
          sticky.style.top = '';
          sticky.style.bottom = '';
          isSticky = false;
          fixed = false;
          absolute = false;
        }
      } else {
        // add .js-sticky, set width, height
        if (!isSticky) {
          jsWrapper.style.height = stickyHeight + 'px';
          sticky.className += ' js-sticky';
          sticky.style.width = stickyWidth + 'px';
          isSticky = true;
        }

        if (container) {
          if (!fixed && stickyRectEdge <= fixedBreakpoint && containerRectEdge > absoluteBreakpoint) {
            // fixed (with container):
            // remove container relative-position
            if (container) {
              container.style.position = '';
            }
            sticky.style.position = 'fixed';
            sticky.style[position] = padding + 'px';
            if (position === 'top') {
              sticky.style.bottom = '';
            }
            fixed = true;
            absolute = false;
          } else if (!absolute && containerRectEdge <= absoluteBreakpoint) {
            // absolute:
            container.style.position = 'relative';
            sticky.style.position = 'absolute';
            if (position === 'top') {
              sticky.style.top = '';
              sticky.style.bottom = '0px';
            }
            fixed = false;
            absolute = true;
          }
        } else {
          // fixed (without container)
          if (!fixed && stickyRectEdge <= fixedBreakpoint) {
            sticky.style.position = 'fixed';
            sticky.style[position] = padding + 'px';
            fixed = true;
          }
        }
      }
    };

    var that = this;
    window.addEventListener('load', function () { 
      that.onLoad(); 
    });

    gn.optimizedResize.add(function () { 
      that.onResize(); 
    });

    window.addEventListener('scroll', function () { 
      if (!initialized) { return; }
      stickyRectEdge = jsWrapper.getBoundingClientRect()[position];
      containerRectEdge = (container) ? container.getBoundingClientRect().bottom : false;
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (initialized) {
            that.onScroll(); 
          }
          ticking = false;
        });
      }
      ticking = true;
    });
  }

  return sticky;
});