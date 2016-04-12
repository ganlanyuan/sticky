"pageXOffset"in window||function(){var e=function(){return(document.documentElement||document.body.parentNode||document.body).scrollLeft},t=function(){return(document.documentElement||document.body.parentNode||document.body).scrollTop};Object.defineProperty(window,"pageXOffset",{get:e}),Object.defineProperty(window,"pageYOffset",{get:t}),Object.defineProperty(window,"scrollX",{get:e}),Object.defineProperty(window,"scrollY",{get:t})}(),"innerWidth"in window||(Object.defineProperty(window,"innerWidth",{get:function(){return(document.documentElement||document.body.parentNode||document.body).clientWidth}}),Object.defineProperty(window,"innerHeight",{get:function(){return(document.documentElement||document.body.parentNode||document.body).clientHeight}})),window.MouseEvent||"pageX"in Event.prototype||(Object.defineProperty(Event.prototype,"pageX",{get:function(){return this.clientX+window.pageXOffset}}),Object.defineProperty(Event.prototype,"pageY",{get:function(){return this.clientY+window.pageYOffset}})),window.getComputedStyle=window.getComputedStyle||function(e){if(!e)return null;var t=e.currentStyle,r=e.getBoundingClientRect(),n=document.createElement("div"),o=n.style;for(var i in t)o[i]=t[i];return o.cssFloat=o.styleFloat,"auto"===o.width&&(o.width=r.right-r.left+"px"),"auto"===o.height&&(o.height=r.bottom-r.top+"px"),o},Array.prototype.every||(Array.prototype.every=function(e,t){"use strict";var r,n;if(null==this)throw new TypeError("'this' is null or not defined");var o=Object(this),i=o.length>>>0;if("function"!=typeof e)throw new TypeError;for(arguments.length>1&&(r=t),n=0;i>n;){var a;if(n in o){a=o[n];var u=e.call(r,a,n,o);if(!u)return!1}n++}return!0}),Array.prototype.filter||(Array.prototype.filter=function(e){"use strict";if(void 0===this||null===this)throw new TypeError;var t=Object(this),r=t.length>>>0;if("function"!=typeof e)throw new TypeError;for(var n=[],o=arguments.length>=2?arguments[1]:void 0,i,a=0;r>a;a++)a in t&&e.call(o,i=t[a],a,t)&&n.push(i);return n}),Array.prototype.forEach||(Array.prototype.forEach=function(e,t){var r,n;if(null===this)throw new TypeError(" this is null or not defined");var o=Object(this),i=o.length>>>0;if("function"!=typeof e)throw new TypeError(e+" is not a function");for(arguments.length>1&&(r=t),n=0;i>n;){var a;n in o&&(a=o[n],e.call(r,a,n,o)),n++}}),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var r;if(null==this)throw new TypeError('"this" is null or not defined');var n=Object(this),o=n.length>>>0;if(0===o)return-1;var i=+t||0;if(Math.abs(i)===1/0&&(i=0),i>=o)return-1;for(r=Math.max(i>=0?i:o-Math.abs(i),0);o>r;){if(r in n&&n[r]===e)return r;r++}return-1}),Array.prototype.lastIndexOf||(Array.prototype.lastIndexOf=function(e){"use strict";if(void 0===this||null===this)throw new TypeError;var t,r,n=Object(this),o=n.length>>>0;if(0===o)return-1;for(t=o-1,arguments.length>1&&(t=Number(arguments[1]),t!=t?t=0:0!=t&&t!=1/0&&t!=-(1/0)&&(t=(t>0||-1)*Math.floor(Math.abs(t)))),r=t>=0?Math.min(t,o-1):o-Math.abs(t);r>=0;r--)if(r in n&&n[r]===e)return r;return-1}),Array.prototype.map||(Array.prototype.map=function(e,t){var r,n,o;if(null==this)throw new TypeError('"this" is null or not defined');var i=Object(this),a=i.length>>>0;if("function"!=typeof e)throw new TypeError(e+" is not a function");for(arguments.length>1&&(r=t),n=new Array(a),o=0;a>o;){var u,p;o in i&&(u=i[o],p=e.call(r,u,o,i),n[o]=p),o++}return n}),Array.prototype.reduce||(Array.prototype.reduce=function(e){"use strict";if(null==this)throw new TypeError("Array.prototype.reduce called on null or undefined");if("function"!=typeof e)throw new TypeError(e+" is not a function");var t=Object(this),r=t.length>>>0,n=0,o;if(2===arguments.length)o=arguments[1];else{for(;r>n&&!(n in t);)n++;if(n>=r)throw new TypeError("Reduce of empty array with no initial value");o=t[n++]}for(;r>n;n++)n in t&&(o=e(o,t[n],n,t));return o}),Array.prototype.reduceRight||(Array.prototype.reduceRight=function(e){"use strict";if(null==this)throw new TypeError("Array.prototype.reduce called on null or undefined");if("function"!=typeof e)throw new TypeError(e+" is not a function");var t=Object(this),r=t.length>>>0,n=r-1,o;if(arguments.length>=2)o=arguments[1];else{for(;n>=0&&!(n in t);)n--;if(0>n)throw new TypeError("Reduce of empty array with no initial value");o=t[n--]}for(;n>=0;n--)n in t&&(o=e(o,t[n],n,t));return o}),Array.prototype.some||(Array.prototype.some=function(e){"use strict";if(null==this)throw new TypeError("Array.prototype.some called on null or undefined");if("function"!=typeof e)throw new TypeError;for(var t=Object(this),r=t.length>>>0,n=arguments.length>=2?arguments[1]:void 0,o=0;r>o;o++)if(o in t&&e.call(n,t[o],o,t))return!0;return!1}),function(){if(!Element.prototype.addEventListener){var e=[],t=function(t,r){var n=this,o=function(e){e.target=e.srcElement,e.currentTarget=n,"undefined"!=typeof r.handleEvent?r.handleEvent(e):r.call(n,e)};if("DOMContentLoaded"==t){var i=function(e){"complete"==document.readyState&&o(e)};if(document.attachEvent("onreadystatechange",i),e.push({object:this,type:t,listener:r,wrapper:i}),"complete"==document.readyState){var a=new Event;a.srcElement=window,i(a)}}else this.attachEvent("on"+t,o),e.push({object:this,type:t,listener:r,wrapper:o})},r=function(t,r){for(var n=0;n<e.length;){var o=e[n];if(o.object==this&&o.type==t&&o.listener==r){"DOMContentLoaded"==t?this.detachEvent("onreadystatechange",o.wrapper):this.detachEvent("on"+t,o.wrapper),e.splice(n,1);break}++n}};Element.prototype.addEventListener=t,Element.prototype.removeEventListener=r,HTMLDocument&&(HTMLDocument.prototype.addEventListener=t,HTMLDocument.prototype.removeEventListener=r),Window&&(Window.prototype.addEventListener=t,Window.prototype.removeEventListener=r)}}();