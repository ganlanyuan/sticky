!function(t){window.sticky=t()}(function(){"use strict";function t(t){var i=document.querySelectorAll(t.sticky);if(0===i.length)return void console.log('"'+t.nav+"\" can't be found.");for(var n=i.length;n--;){var s=t;s.sticky=i[n];var o=new e(s)}}function e(t){t=gn.extend({sticky:document.querySelector(".sticky"),container:!1,padding:0,position:"top",breakpoints:!1},t||{});var e=t.breakpoints,i=t.sticky,n=i.className,s=t.container?document.querySelector(t.container):!1,o=t.padding,r=t.position,a,c,u,l,d,h,f,g,p=!1,m=!1,y=!1,x=!1,w=!1,L=0,k=!1,v=!1;this.init=function(){a=document.createElement("div"),a.className="js-sticky-wrapper",gn.wrap(i,a),m=!0},this.updateSizes=function(){var t=window.getComputedStyle(i),e=/\d/,n=null===e.exec(t.marginLeft)?0:parseInt(Length.toPx(i,t.marginLeft)),o=null===e.exec(t.marginRight)?0:parseInt(Length.toPx(i,t.marginRight)),c=null===e.exec(t.marginTop)?0:parseInt(Length.toPx(i,t.marginTop)),p=null===e.exec(t.marginBottom)?0:parseInt(Length.toPx(i,t.marginBottom));l=a.clientWidth-n-o,d=i.offsetHeight+c+p,s&&(h=s.clientHeight),u=window.innerHeight,r=this.getPosition(),f=this.getFixedBreakpoint(),g=this.getAbsoluteBreakpoint()},this.destory=function(){i.className=n,i.style.width="",i.style[r]="",gn.unwrap(a),p=!1,m=!1,y=!1,x=!1,w=!1},this.checkRange=function(){if(!e)return function(){return!0};if("number"==typeof e)return function(){return c>=e};if(Array.isArray(e))switch(e.length){case 2:return function(){return c>=e[0]&&c<e[1]};break;case 3:return function(){return c>=e[0]&&c<e[1]||c>=e[2]};break;default:return function(){return c>=e[0]&&c<e[1]||c>=e[2]&&c<e[3]}}}(),this.getPosition=function(){return d>u?"bottom":r},this.getFixedBreakpoint=function(){return"top"===r?o:u-d-o},this.getAbsoluteBreakpoint=function(){return s?function(){return"top"===r?d+o-h:u-h}:function(){return!1}}(),this.onLoad=function(){c=window.innerWidth,p=this.checkRange(),p&&!m?(this.init(),this.updateSizes()):!p&&m&&this.destory()},this.onResize=function(){this.onLoad(),this.updateSizes(),m&&(y&&(i.style.width=l+"px"),this.onScroll())},this.isNormal=function(){i.classList.remove("js-fixed-"+r,"js-sticky")},this.isFixed=function(){i.classList.contains("js-fixed-"+r)||(i.classList.add("js-fixed-"+r,"js-sticky"),i.classList.remove("js-absolute"),s&&s.classList.remove("js-relative"))},this.isAbsolute=function(){i.classList.contains("js-absolute")||(s.classList.add("js-relative"),i.classList.add("js-absolute"),i.classList.remove("js-fixed-"+r))},this.onScroll=function(){L>f?y&&(this.isNormal(),i.style.width="",i.style.top="",i.style.bottom="",a.style.height="",y=!1,x=!1,w=!1):(y||(i.style.width=l+"px",a.style.height=d+"px",y=!0),s?!x&&f>=L&&k>g?(this.isFixed(),i.style[r]=o+"px","top"===r&&(i.style.bottom=""),x=!0,w=!1):!w&&g>=k&&(this.isAbsolute(),i.style.top="","top"===r&&(i.style.bottom="0px"),x=!1,w=!0):!x&&f>=L&&(this.isFixed(),i.style[r]=o+"px",x=!0))};var b=this;window.addEventListener("load",function(){b.onLoad()}),gn.optimizedResize.add(function(){b.onResize()}),window.addEventListener("scroll",function(){L=a.getBoundingClientRect().top,s&&(k=s.getBoundingClientRect().top),v||window.requestAnimationFrame(function(){m&&b.onScroll(),v=!1}),v=!0})}return t});