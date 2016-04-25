/**
  * sticky (works with go-native)
  *
  * v0.1.3
  * @author William Lin
  * @license The MIT License (MIT)
  * https://github.com/ganlanyuan/sticky
  */
var sticky=function(){"use strict";return function(t){function i(t){this.sticky=t,this.stickyClassNames=this.sticky.className,this.inRange=!1,this.initialized=!1,this.isSticky=!1,this.fixed=!1,this.absolute=!1,this.stickyRectEdge=0,this.containerRectEdge=!1;var i=this;window.addEventListener("load",function(){i.onLoad()}),gn.optimizedResize.add(function(){i.onResize()}),window.addEventListener("scroll",function(){i.ticking=!1,i.initialized&&(i.stickyRectEdge=i.jsWrapper.getBoundingClientRect()[c],i.containerRectEdge=e?e.getBoundingClientRect().bottom:!1,i.ticking||window.requestAnimationFrame(function(){i.initialized&&i.onScroll(),i.ticking=!1}),i.ticking=!0)})}t=gn.extend({sticky:".sticky",container:!1,padding:0,position:"top",breakpoints:!1},t||{});var s=t.breakpoints,e=t.container?document.querySelector(t.container):!1,n=t.padding,c=t.position,h=window.innerWidth,o=window.innerHeight;i.prototype={init:function(){var t=this.sticky.parentNode;-1!==t.className.indexOf("sticky-container")?this.jsWrapper=t:(this.jsWrapper=document.createElement("div"),this.jsWrapper.className="js-sticky-container",gn.wrap(this.sticky,this.jsWrapper)),this.initialized=!0},getFixedBreakpoint:function(){return"top"===c?n:o-n},getAbsoluteBreakpoint:function(){return e?"top"===c?this.stickyHeight+n:o:!1},updateSizes:function(){var t=window.getComputedStyle(this.sticky),i=/\d/,s=null===i.exec(t.marginLeft)?0:parseInt(Length.toPx(sticky,t.marginLeft)),e=null===i.exec(t.marginRight)?0:parseInt(Length.toPx(sticky,t.marginRight)),n=null===i.exec(t.marginTop)?0:parseInt(Length.toPx(sticky,t.marginTop)),c=null===i.exec(t.marginBottom)?0:parseInt(Length.toPx(sticky,t.marginBottom));this.stickyWidth=this.jsWrapper.clientWidth-s-e,this.stickyHeight=this.sticky.offsetHeight+n+c,this.fixedBreakpoint=this.getFixedBreakpoint(),this.absoluteBreakpoint=this.getAbsoluteBreakpoint()},destory:function(){this.sticky.className=this.stickyClassNames,this.sticky.style.width="",this.sticky.style[c]="",gn.unwrap(this.jsWrapper),this.isSticky&&(this.sticky.className=this.sticky.className.replace(" js-sticky",""),this.sticky.style.position="",this.sticky.style.width="",this.sticky.style.top="",this.sticky.style.bottom="",this.isSticky=!1,this.fixed=!1,this.absolute=!1),this.inRange=!1,this.initialized=!1,this.isSticky=!1,this.fixed=!1,this.absolute=!1},checkRange:function(){if(!s)return!0;if("number"==typeof s)return h>=s;if(Array.isArray(s))switch(s.length){case 2:return h>=s[0]&&h<s[1];case 3:return h>=s[0]&&h<s[1]||h>=s[2];case 4:return h>=s[0]&&h<s[1]||h>=s[2]&&h<s[3]}},onLoad:function(){this.inRange=this.checkRange(),this.inRange&&!this.initialized?(this.init(),this.updateSizes()):!this.inRange&&this.initialized&&this.destory(),this.initialized&&(this.stickyRectEdge=this.jsWrapper.getBoundingClientRect()[c],this.containerRectEdge=e?e.getBoundingClientRect().bottom:!1,this.onScroll(),this.isSticky&&(this.sticky.style.width=this.stickyWidth+"px"))},onResize:function(){window.innerWidth!==h&&(h=window.innerWidth),window.innerHeight!==o&&(o=window.innerHeight),this.onLoad(),this.initialized&&this.updateSizes()},onScroll:function(){this.stickyRectEdge>this.fixedBreakpoint?this.isSticky&&(this.sticky.className=this.sticky.className.replace(" js-sticky",""),this.jsWrapper.style.height="",this.sticky.style.position="",this.sticky.style.width="",this.sticky.style.top="",this.sticky.style.bottom="",this.isSticky=!1,this.fixed=!1,this.absolute=!1):(this.isSticky||(this.sticky.className+=" js-sticky",this.sticky.style.width=this.stickyWidth+"px",this.jsWrapper.style.height=this.stickyHeight+"px",this.isSticky=!0),e?!this.fixed&&this.stickyRectEdge<=this.fixedBreakpoint&&this.containerRectEdge>this.absoluteBreakpoint?(e.style.position="",this.sticky.style.position="fixed",this.sticky.style[c]=n+"px","top"===c&&(this.sticky.style.bottom=""),this.fixed=!0,this.absolute=!1):!this.absolute&&this.containerRectEdge<=this.absoluteBreakpoint&&(e.style.position="relative",this.sticky.style.position="absolute","top"===c&&(this.sticky.style.top="",this.sticky.style.bottom="0px"),this.fixed=!1,this.absolute=!0):!this.fixed&&this.stickyRectEdge<=this.fixedBreakpoint&&(this.sticky.style.position="fixed",this.sticky.style[c]=n+"px",this.fixed=!0))}};var a=document.querySelectorAll(t.sticky),r=[];if(0!==a.length){for(var y=a.length;y--;){var d=new i(a[y]);r.unshift(d)}return r}}}();