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
!function(t){window.sticky=t()}(function(){"use strict";function t(t){t.sticky||(t.sticky=".sticky");var e=document.querySelectorAll(t.sticky);if(0!==e.length)for(var i=e.length;i--;){var o=t;return o.sticky=e[i],new n(o)}}function n(t){t=gn.extend({sticky:".sticky",container:!1,padding:0,position:"top",breakpoints:!1},t||{});var n=t.breakpoints,e=t.sticky,i=e.className,o=t.container?document.querySelector(t.container):!1,s=t.padding,r=t.position,c,a,l,u,d,p,y,h=!1,g=!1,f=!1,m=!1,w=!1,k=0,x=!1,b=!1;this.init=function(){c=document.createElement("div"),c.className="js-sticky-container",gn.wrap(e,c),g=!0},this.getFixedBreakpoint=function(){return"top"===r?function(){return s}:function(){return l-s}}(),this.getAbsoluteBreakpoint=function(){return o?function(){return"top"===r?d+s:l}:function(){return!1}}(),this.updateSizes=function(){var t=window.getComputedStyle(e),n=/\d/,i=null===n.exec(t.marginLeft)?0:parseInt(Length.toPx(e,t.marginLeft)),o=null===n.exec(t.marginRight)?0:parseInt(Length.toPx(e,t.marginRight)),s=null===n.exec(t.marginTop)?0:parseInt(Length.toPx(e,t.marginTop)),r=null===n.exec(t.marginBottom)?0:parseInt(Length.toPx(e,t.marginBottom));u=c.clientWidth-i-o,d=e.offsetHeight+s+r,l=window.innerHeight,p=this.getFixedBreakpoint(),y=this.getAbsoluteBreakpoint()},this.destory=function(){e.className=i,e.style.width="",e.style[r]="",gn.unwrap(c),f&&(e.className=e.className.replace(" js-sticky",""),e.style.position="",e.style.width="",e.style.top="",e.style.bottom="",f=!1,m=!1,w=!1),h=!1,g=!1,f=!1,m=!1,w=!1},this.checkRange=function(){if(!n)return function(){return!0};if("number"==typeof n)return function(){return a>=n};if(Array.isArray(n))switch(n.length){case 2:return function(){return a>=n[0]&&a<n[1]};case 3:return function(){return a>=n[0]&&a<n[1]||a>=n[2]};case 4:return function(){return a>=n[0]&&a<n[1]||a>=n[2]&&a<n[3]}}}(),this.onLoad=function(){a=window.innerWidth,h=this.checkRange(),h&&!g?(this.init(),this.updateSizes()):!h&&g&&this.destory(),g&&(k=c.getBoundingClientRect()[r],x=o?o.getBoundingClientRect().bottom:!1,this.onScroll(),f&&(e.style.width=u+"px"))},this.onResize=function(){this.onLoad(),g&&this.updateSizes()},this.onScroll=function(){k>p?f&&(e.className=e.className.replace(" js-sticky",""),c.style.height="",e.style.position="",e.style.width="",e.style.top="",e.style.bottom="",f=!1,m=!1,w=!1):(f||(c.style.height=d+"px",e.className+=" js-sticky",e.style.width=u+"px",f=!0),o?!m&&p>=k&&x>y?(o&&(o.style.position=""),e.style.position="fixed",e.style[r]=s+"px","top"===r&&(e.style.bottom=""),m=!0,w=!1):!w&&y>=x&&(o.style.position="relative",e.style.position="absolute","top"===r&&(e.style.top="",e.style.bottom="0px"),m=!1,w=!0):!m&&p>=k&&(e.style.position="fixed",e.style[r]=s+"px",m=!0))};var L=this;window.addEventListener("load",function(){L.onLoad()}),gn.optimizedResize.add(function(){L.onResize()}),window.addEventListener("scroll",function(){g&&(k=c.getBoundingClientRect()[r],x=o?o.getBoundingClientRect().bottom:!1,b||window.requestAnimationFrame(function(){g&&L.onScroll(),b=!1}),b=!0)})}return t});