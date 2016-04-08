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
!function(t){window.sticky=t()}(function(){"use strict";function t(t){t.sticky||(t.sticky=".sticky");var n=document.querySelectorAll(t.sticky);if(0!==n.length)for(var i=n.length;i--;){var o=t;return o.sticky=n[i],new e(o)}}function e(t){t=gn.extend({sticky:".sticky",container:!1,padding:0,position:"top",breakpoints:!1},t||{});var e=t.breakpoints,n=t.sticky,i=n.className,o=t.container?document.querySelector(t.container):!1,s=t.padding,r=t.position,c,a,l,u,d,p,y,h=!1,g=!1,f=!1,m=!1,w=!1,k=0,x=!1,b=!1;this.init=function(){c=document.createElement("div"),c.className="js-sticky-wrapper",gn.wrap(n,c),g=!0},this.getFixedBreakpoint=function(){return"top"===r?s:l-s},this.getAbsoluteBreakpoint=function(){return o?function(){return"top"===r?d+s:l}:function(){return!1}}(),this.updateSizes=function(){var t=window.getComputedStyle(n),e=/\d/,i=null===e.exec(t.marginLeft)?0:parseInt(Length.toPx(n,t.marginLeft)),o=null===e.exec(t.marginRight)?0:parseInt(Length.toPx(n,t.marginRight)),s=null===e.exec(t.marginTop)?0:parseInt(Length.toPx(n,t.marginTop)),r=null===e.exec(t.marginBottom)?0:parseInt(Length.toPx(n,t.marginBottom));u=c.clientWidth-i-o,d=n.offsetHeight+s+r,l=window.innerHeight,p=this.getFixedBreakpoint(),y=this.getAbsoluteBreakpoint()},this.destory=function(){n.className=i,n.style.width="",n.style[r]="",gn.unwrap(c),f&&(n.className=n.className.replace(" js-sticky",""),n.style.position="",n.style.width="",n.style.top="",n.style.bottom="",f=!1,m=!1,w=!1),h=!1,g=!1,f=!1,m=!1,w=!1},this.checkRange=function(){if(!e)return function(){return!0};if("number"==typeof e)return function(){return a>=e};if(Array.isArray(e))switch(e.length){case 2:return function(){return a>=e[0]&&a<e[1]};case 3:return function(){return a>=e[0]&&a<e[1]||a>=e[2]};case 4:return function(){return a>=e[0]&&a<e[1]||a>=e[2]&&a<e[3]}}}(),this.onLoad=function(){a=window.innerWidth,h=this.checkRange(),h&&!g?(this.init(),this.updateSizes()):!h&&g&&this.destory(),g&&(k=c.getBoundingClientRect()[r],x=o?o.getBoundingClientRect().bottom:!1,this.onScroll(),f&&(n.style.width=u+"px"))},this.onResize=function(){this.onLoad(),g&&this.updateSizes()},this.onScroll=function(){k>p?f&&(n.className=n.className.replace(" js-sticky",""),c.style.height="",n.style.position="",n.style.width="",n.style.top="",n.style.bottom="",f=!1,m=!1,w=!1):(f||(c.style.height=d+"px",n.className+=" js-sticky",n.style.width=u+"px",f=!0),o?!m&&p>=k&&x>y?(o&&(o.style.position=""),n.style.position="fixed",n.style[r]=s+"px","top"===r&&(n.style.bottom=""),m=!0,w=!1):!w&&y>=x&&(o.style.position="relative",n.style.position="absolute","top"===r&&(n.style.top="",n.style.bottom="0px"),m=!1,w=!0):!m&&p>=k&&(n.style.position="fixed",n.style[r]=s+"px",m=!0))};var L=this;window.addEventListener("load",function(){L.onLoad()}),gn.optimizedResize.add(function(){L.onResize()}),window.addEventListener("scroll",function(){g&&(k=c.getBoundingClientRect()[r],x=o?o.getBoundingClientRect().bottom:!1,b||window.requestAnimationFrame(function(){g&&L.onScroll(),b=!1}),b=!0)})}return t});