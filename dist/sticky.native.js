/**
  * sticky (works with go-native)
  *
  * v0.0.2
  * @author William Lin
  * @license The MIT License (MIT)
  * https://github.com/ganlanyuan/sticky
  */
var sticky=function(){"use strict";function i(i){i=gn.extend({sticky:".sticky",container:!1,padding:0,position:"top",breakpoints:!1},i||{});var s=document.querySelectorAll(i.sticky);if(0!==s.length)for(var e=s.length;e--;){var n=i;return n.sticky=s[e],new t(n)}}function t(i){this.bp=i.breakpoints,this.sticky=i.sticky,this.stickyClassNames=this.sticky.className,this.container=i.container?document.querySelector(i.container):!1,this.padding=i.padding,this.position=i.position,this.inRange=!1,this.initialized=!1,this.isSticky=!1,this.fixed=!1,this.absolute=!1,this.stickyRectEdge=0,this.containerRectEdge=!1,this.ticking=!1;var t=this;window.addEventListener("load",function(){t.onLoad()}),gn.optimizedResize.add(function(){t.onResize()}),window.addEventListener("scroll",function(){t.initialized&&(t.stickyRectEdge=t.jsWrapper.getBoundingClientRect()[t.position],t.containerRectEdge=t.container?t.container.getBoundingClientRect().bottom:!1,t.ticking||window.requestAnimationFrame(function(){t.initialized&&t.onScroll(),t.ticking=!1}),t.ticking=!0)})}return t.prototype={init:function(){this.jsWrapper=document.createElement("div"),this.jsWrapper.className="js-sticky-container",gn.wrap(this.sticky,this.jsWrapper),this.initialized=!0},getFixedBreakpoint:function(){return"top"===this.position?this.padding:this.windowHeight-this.padding},getAbsoluteBreakpoint:function(){return this.container?"top"===this.position?this.stickyHeight+this.padding:this.windowHeight:!1},updateSizes:function(){var t=window.getComputedStyle(this.sticky),s=/\d/,e=null===s.exec(t.marginLeft)?0:parseInt(Length.toPx(i,t.marginLeft)),n=null===s.exec(t.marginRight)?0:parseInt(Length.toPx(i,t.marginRight)),h=null===s.exec(t.marginTop)?0:parseInt(Length.toPx(i,t.marginTop)),o=null===s.exec(t.marginBottom)?0:parseInt(Length.toPx(i,t.marginBottom));this.stickyWidth=this.jsWrapper.clientWidth-e-n,this.stickyHeight=this.sticky.offsetHeight+h+o,this.windowHeight=window.innerHeight,this.fixedBreakpoint=this.getFixedBreakpoint(),this.absoluteBreakpoint=this.getAbsoluteBreakpoint()},destory:function(){this.sticky.className=this.stickyClassNames,this.sticky.style.width="",this.sticky.style[this.position]="",gn.unwrap(this.jsWrapper),this.isSticky&&(this.sticky.className=this.sticky.className.replace(" js-sticky",""),this.sticky.style.position="",this.sticky.style.width="",this.sticky.style.top="",this.sticky.style.bottom="",this.isSticky=!1,this.fixed=!1,this.absolute=!1),this.inRange=!1,this.initialized=!1,this.isSticky=!1,this.fixed=!1,this.absolute=!1},checkRange:function(){if(!this.bp)return!0;if("number"==typeof this.bp)return this.windowWidth>=this.bp;if(Array.isArray(this.bp))switch(this.bp.length){case 2:return this.windowWidth>=this.bp[0]&&this.windowWidth<this.bp[1];case 3:return this.windowWidth>=this.bp[0]&&this.windowWidth<this.bp[1]||this.windowWidth>=this.bp[2];case 4:return this.windowWidth>=this.bp[0]&&this.windowWidth<this.bp[1]||this.windowWidth>=this.bp[2]&&this.windowWidth<this.bp[3]}},onLoad:function(){this.windowWidth=window.innerWidth,this.inRange=this.checkRange(),this.inRange&&!this.initialized?(this.init(),this.updateSizes()):!this.inRange&&this.initialized&&this.destory(),this.initialized&&(this.stickyRectEdge=this.jsWrapper.getBoundingClientRect()[this.position],this.containerRectEdge=this.container?this.container.getBoundingClientRect().bottom:!1,this.onScroll(),this.isSticky&&(this.sticky.style.width=this.stickyWidth+"px"))},onResize:function(){this.onLoad(),this.initialized&&this.updateSizes()},onScroll:function(){this.stickyRectEdge>this.fixedBreakpoint?this.isSticky&&(this.sticky.className=this.sticky.className.replace(" js-sticky",""),this.jsWrapper.style.height="",this.sticky.style.position="",this.sticky.style.width="",this.sticky.style.top="",this.sticky.style.bottom="",this.isSticky=!1,this.fixed=!1,this.absolute=!1):(this.isSticky||(this.sticky.className+=" js-sticky",this.sticky.style.width=this.stickyWidth+"px",this.jsWrapper.style.height=this.stickyHeight+"px",this.isSticky=!0),this.container?!this.fixed&&this.stickyRectEdge<=this.fixedBreakpoint&&this.containerRectEdge>this.absoluteBreakpoint?(this.container&&(this.container.style.position=""),this.sticky.style.position="fixed",this.sticky.style[this.position]=this.padding+"px","top"===this.position&&(this.sticky.style.bottom=""),this.fixed=!0,this.absolute=!1):!this.absolute&&this.containerRectEdge<=this.absoluteBreakpoint&&(this.container.style.position="relative",this.sticky.style.position="absolute","top"===this.position&&(this.sticky.style.top="",this.sticky.style.bottom="0px"),this.fixed=!1,this.absolute=!0):!this.fixed&&this.stickyRectEdge<=this.fixedBreakpoint&&(this.sticky.style.position="fixed",this.sticky.style[this.position]=this.padding+"px",this.fixed=!0))}},i}();