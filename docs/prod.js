!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=12)}([function(t,e,n){t.exports=n(11)},function(t,e){function n(t,e,n,r,o,i,s){try{var a=t[i](s),c=a.value}catch(t){return void n(t)}a.done?e(c):Promise.resolve(c).then(r,o)}t.exports=function(t){return function(){var e=this,r=arguments;return new Promise((function(o,i){var s=t.apply(e,r);function a(t){n(s,o,i,a,c,"next",t)}function c(t){n(s,o,i,a,c,"throw",t)}a(void 0)}))}},t.exports.default=t.exports,t.exports.__esModule=!0},function(t,e){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},t.exports.default=t.exports,t.exports.__esModule=!0},function(t,e){function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}t.exports=function(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t},t.exports.default=t.exports,t.exports.__esModule=!0},function(t,e,n){var r=n(6),o=n(7),i=n(8),s=n(10);t.exports=function(t,e){return r(t)||o(t,e)||i(t,e)||s()},t.exports.default=t.exports,t.exports.__esModule=!0},function(t,e){window.addEventListener("load",(function(){window.__DATA__.externalSearchSites.push({name:"Jisho sentences",url:"https://jisho.org/search/%s%20%23sentences",iconUrl:"/dict/icons/jisho.png"}),console.log("Added Jisho sentence search")}))},function(t,e){t.exports=function(t){if(Array.isArray(t))return t},t.exports.default=t.exports,t.exports.__esModule=!0},function(t,e){t.exports=function(t,e){var n=t&&("undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"]);if(null!=n){var r,o,i=[],s=!0,a=!1;try{for(n=n.call(t);!(s=(r=n.next()).done)&&(i.push(r.value),!e||i.length!==e);s=!0);}catch(t){a=!0,o=t}finally{try{s||null==n.return||n.return()}finally{if(a)throw o}}return i}},t.exports.default=t.exports,t.exports.__esModule=!0},function(t,e,n){var r=n(9);t.exports=function(t,e){if(t){if("string"==typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}},t.exports.default=t.exports,t.exports.__esModule=!0},function(t,e){t.exports=function(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r},t.exports.default=t.exports,t.exports.__esModule=!0},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},t.exports.default=t.exports,t.exports.__esModule=!0},function(t,e,n){var r=function(t){"use strict";var e=Object.prototype,n=e.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},o=r.iterator||"@@iterator",i=r.asyncIterator||"@@asyncIterator",s=r.toStringTag||"@@toStringTag";function a(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{a({},"")}catch(t){a=function(t,e,n){return t[e]=n}}function c(t,e,n,r){var o=e&&e.prototype instanceof l?e:l,i=Object.create(o.prototype),s=new b(r||[]);return i._invoke=function(t,e,n){var r="suspendedStart";return function(o,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw i;return S()}for(n.method=o,n.arg=i;;){var s=n.delegate;if(s){var a=x(s,n);if(a){if(a===h)continue;return a}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var c=u(t,e,n);if("normal"===c.type){if(r=n.done?"completed":"suspendedYield",c.arg===h)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r="completed",n.method="throw",n.arg=c.arg)}}}(t,n,s),i}function u(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=c;var h={};function l(){}function d(){}function f(){}var p={};p[o]=function(){return this};var v=Object.getPrototypeOf,y=v&&v(v(E([])));y&&y!==e&&n.call(y,o)&&(p=y);var m=f.prototype=l.prototype=Object.create(p);function g(t){["next","throw","return"].forEach((function(e){a(t,e,(function(t){return this._invoke(e,t)}))}))}function w(t,e){var r;this._invoke=function(o,i){function s(){return new e((function(r,s){!function r(o,i,s,a){var c=u(t[o],t,i);if("throw"!==c.type){var h=c.arg,l=h.value;return l&&"object"==typeof l&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,s,a)}),(function(t){r("throw",t,s,a)})):e.resolve(l).then((function(t){h.value=t,s(h)}),(function(t){return r("throw",t,s,a)}))}a(c.arg)}(o,i,r,s)}))}return r=r?r.then(s,s):s()}}function x(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,x(t,e),"throw"===e.method))return h;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return h}var r=u(n,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,h;var o=r.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,h):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function _(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function b(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function E(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,i=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return i.next=i}}return{next:S}}function S(){return{value:void 0,done:!0}}return d.prototype=m.constructor=f,f.constructor=d,d.displayName=a(f,s,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===d||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,f):(t.__proto__=f,a(t,s,"GeneratorFunction")),t.prototype=Object.create(m),t},t.awrap=function(t){return{__await:t}},g(w.prototype),w.prototype[i]=function(){return this},t.AsyncIterator=w,t.async=function(e,n,r,o,i){void 0===i&&(i=Promise);var s=new w(c(e,n,r,o),i);return t.isGeneratorFunction(n)?s:s.next().then((function(t){return t.done?t.value:s.next()}))},g(m),a(m,s,"Generator"),m[o]=function(){return this},m.toString=function(){return"[object Generator]"},t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=E,b.prototype={constructor:b,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(_),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return s.type="throw",s.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],s=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var a=n.call(i,"catchLoc"),c=n.call(i,"finallyLoc");if(a&&c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(a){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var s=i?i.completion:{};return s.type=t,s.arg=e,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(s)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),_(n),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;_(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:E(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),h}},t}(t.exports);try{regeneratorRuntime=r}catch(t){Function("r","regeneratorRuntime = r")(r)}},function(t,e,n){"use strict";function r(){var t=document.querySelectorAll("div.dict:not(.dict-hidden)");return Array.from(t)}function o(){var t=document.querySelectorAll("div.dict:not(.dict-hidden) a");return Array.from(t)}function i(){return document.querySelector("div.dict > a.active")}n.r(e);var s=["広辞苑","大辞林","大辞泉","ハイブリッド新辞林","学研古語辞典","日本国語大辞典","学研国語大辞典","明鏡国語辞典","新明解国語辞典","学研漢和大字典","英辞郎"];function a(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"prefix";return"https://sakura-paris.org/dict/".concat(t,"/").concat(n,"/").concat(e)}function c(){r().forEach((function(t){s.includes(t.title)||t.classList.add("dict-hidden")}))}window.addEventListener("load",c),window.addEventListener("DOMNodeInserted",c),console.log("Enabled preloading of results for selected dicts."),window.addEventListener("DOMNodeInserted",(function(){document.querySelectorAll(".external-search a.external").forEach((function(t){return t.target="_blank"}))})),console.log("Loaded externalLinksAsNewTabs.js");n(5);var u=n(4),h=n.n(u),l=n(1),d=n.n(l),f=n(0),p=n.n(f),v={};function y(t){return m.apply(this,arguments)}function m(){return(m=d()(p.a.mark((function t(e){var n;return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=Object.fromEntries(e.map((function(t,e){return[t,e]}))),v=n;case 2:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function g(t){var e=v[t]||999999,n=0;return e<=1500?n=5:e<=5e3?n=4:e<=15e3?n=3:(e<=3e4||e<=6e4)&&(n=2),{index:e,rating:n}}function w(t){var e,n=function(){var e=t.match(/【(.+?)】/),n=h()(e,2);n[0];return[n[1]]};try{return e=n(),h()(e,1)[0].replace(/＝/g,"").replace(/×/g,"").replace(/△/g,"").replace(/（.*?）/g,"").split("・")||n()}catch(t){}}function x(){Array.from(document.querySelectorAll(".word-title-text, .livepreview-word-permalink")).filter((function(t){return!t.dataset.frequencified})).forEach((function(t){t.dataset.frequencified=!0;var e=w(t.innerText);if(e){var n=e.map(g).map((function(t){return"★".repeat(t.rating)})).join(",");t.innerHTML+='<span class="frequency-info">'.concat(n,"</span>")}}))}function T(){return(T=d()(p.a.mark((function t(){return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",fetch("https://sp3ctum.github.io/hare/frequency.json").then((function(t){return t.json()})).then(y).then((function(){window.frequency=g,console.log("Loaded frequency list.")})));case 1:case"end":return t.stop()}}),t)})))).apply(this,arguments)}window.addEventListener("load",(function(){(function(){return T.apply(this,arguments)})().then(x),window.addEventListener("DOMNodeInserted",x)}));class _{constructor(t,e){e=Object.assign({},_.defaults,e),this.element=t,this.opts=e,this.touchStartX=null,this.touchStartY=null,this.touchEndX=null,this.touchEndY=null,this.velocityX=null,this.velocityY=null,this.longPressTimer=null,this.doubleTapWaiting=!1,this.handlers={panstart:[],panmove:[],panend:[],swipeleft:[],swiperight:[],swipeup:[],swipedown:[],tap:[],doubletap:[],longpress:[]},this._onTouchStart=this.onTouchStart.bind(this),this._onTouchMove=this.onTouchMove.bind(this),this._onTouchEnd=this.onTouchEnd.bind(this),this.element.addEventListener("touchstart",this._onTouchStart,b),this.element.addEventListener("touchmove",this._onTouchMove,b),this.element.addEventListener("touchend",this._onTouchEnd,b),this.opts.mouseSupport&&!("ontouchstart"in window)&&(this.element.addEventListener("mousedown",this._onTouchStart,b),document.addEventListener("mousemove",this._onTouchMove,b),document.addEventListener("mouseup",this._onTouchEnd,b))}destroy(){this.element.removeEventListener("touchstart",this._onTouchStart),this.element.removeEventListener("touchmove",this._onTouchMove),this.element.removeEventListener("touchend",this._onTouchEnd),this.element.removeEventListener("mousedown",this._onTouchStart),document.removeEventListener("mousemove",this._onTouchMove),document.removeEventListener("mouseup",this._onTouchEnd),clearTimeout(this.longPressTimer),clearTimeout(this.doubleTapTimer)}on(t,e){if(this.handlers[t])return this.handlers[t].push(e),{type:t,fn:e,cancel:()=>this.off(t,e)}}off(t,e){if(this.handlers[t]){const n=this.handlers[t].indexOf(e);-1!==n&&this.handlers[t].splice(n,1)}}fire(t,e){for(let n=0;n<this.handlers[t].length;n++)this.handlers[t][n](e)}onTouchStart(t){this.thresholdX=this.opts.threshold("x",this),this.thresholdY=this.opts.threshold("y",this),this.disregardVelocityThresholdX=this.opts.disregardVelocityThreshold("x",this),this.disregardVelocityThresholdY=this.opts.disregardVelocityThreshold("y",this),this.touchStartX="mousedown"===t.type?t.screenX:t.changedTouches[0].screenX,this.touchStartY="mousedown"===t.type?t.screenY:t.changedTouches[0].screenY,this.touchMoveX=null,this.touchMoveY=null,this.touchEndX=null,this.touchEndY=null,this.longPressTimer=setTimeout(()=>this.fire("longpress",t),this.opts.longPressTime),this.fire("panstart",t)}onTouchMove(t){if("mousemove"===t.type&&(!this.touchStartX||null!==this.touchEndX))return;const e=("mousemove"===t.type?t.screenX:t.changedTouches[0].screenX)-this.touchStartX;this.velocityX=e-this.touchMoveX,this.touchMoveX=e;const n=("mousemove"===t.type?t.screenY:t.changedTouches[0].screenY)-this.touchStartY;this.velocityY=n-this.touchMoveY,this.touchMoveY=n;const r=Math.abs(this.touchMoveX),o=Math.abs(this.touchMoveY);this.swipingHorizontal=r>this.thresholdX,this.swipingVertical=o>this.thresholdY,this.swipingDirection=r>o?this.swipingHorizontal?"horizontal":"pre-horizontal":this.swipingVertical?"vertical":"pre-vertical",Math.max(r,o)>this.opts.pressThreshold&&clearTimeout(this.longPressTimer),this.fire("panmove",t)}onTouchEnd(t){if("mouseup"===t.type&&(!this.touchStartX||null!==this.touchEndX))return;this.touchEndX="mouseup"===t.type?t.screenX:t.changedTouches[0].screenX,this.touchEndY="mouseup"===t.type?t.screenY:t.changedTouches[0].screenY,this.fire("panend",t),clearTimeout(this.longPressTimer);const e=this.touchEndX-this.touchStartX,n=Math.abs(e),r=this.touchEndY-this.touchStartY,o=Math.abs(r);n>this.thresholdX||o>this.thresholdY?(this.swipedHorizontal=this.opts.diagonalSwipes?Math.abs(e/r)<=this.opts.diagonalLimit:n>=o&&n>this.thresholdX,this.swipedVertical=this.opts.diagonalSwipes?Math.abs(r/e)<=this.opts.diagonalLimit:o>n&&o>this.thresholdY,this.swipedHorizontal&&(e<0?(this.velocityX<-this.opts.velocityThreshold||e<-this.disregardVelocityThresholdX)&&this.fire("swipeleft",t):(this.velocityX>this.opts.velocityThreshold||e>this.disregardVelocityThresholdX)&&this.fire("swiperight",t)),this.swipedVertical&&(r<0?(this.velocityY<-this.opts.velocityThreshold||r<-this.disregardVelocityThresholdY)&&this.fire("swipeup",t):(this.velocityY>this.opts.velocityThreshold||r>this.disregardVelocityThresholdY)&&this.fire("swipedown",t))):n<this.opts.pressThreshold&&o<this.opts.pressThreshold&&(this.doubleTapWaiting?(this.doubleTapWaiting=!1,clearTimeout(this.doubleTapTimer),this.fire("doubletap",t)):(this.doubleTapWaiting=!0,this.doubleTapTimer=setTimeout(()=>this.doubleTapWaiting=!1,this.opts.doubleTapTime),this.fire("tap",t)))}}_.defaults={threshold:(t,e)=>Math.max(25,Math.floor(.15*("x"===t?window.innerWidth||document.body.clientWidth:window.innerHeight||document.body.clientHeight))),velocityThreshold:10,disregardVelocityThreshold:(t,e)=>Math.floor(.5*("x"===t?e.element.clientWidth:e.element.clientHeight)),pressThreshold:8,diagonalSwipes:!1,diagonalLimit:Math.tan(.375*Math.PI),longPressTime:500,doubleTapTime:300,mouseSupport:!0};let b=!1;try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:function(){b={passive:!0}}}))}catch(t){}var E=document.body,S=new _(E);function L(){return o().map((function(t){return t.text})).findIndex((function(t){return t==i().text}))}window.gesture=S,S.on("swiperight",(function(){var t=L()-1,e=o()[t];null==e||e.click()})),S.on("swipeleft",(function(){var t=L()+1,e=o()[t];null==e||e.click()})),console.log("Loaded swiping");var M=n(2),O=n.n(M),j=n(3),X=n.n(j),Y=function(){function t(){O()(this,t),this.cache={}}return X()(t,[{key:"store",value:function(t,e,n){var r=this.hashed(t,e);this.cache[r]=n}},{key:"get",value:function(t,e){var n=this.hashed(t,e);return this.cache[n]}},{key:"hashed",value:function(t,e){return"".concat(t,"/").concat(e)}}]),t}(),P=function(){function t(e,n){O()(this,t),this.previousState={},this.store=e,this.changedFunction=n}return X()(t,[{key:"listen",value:function(t){var e=this;this.store.subscribe((function(){var n=e.store.getState();e.changedFunction(e.previousState,n)&&t(e.previousState,n,e.store),e.previousState=n}))}}]),t}();var k=new Y;function q(t,e){return t.q!=e.q}function A(){return __STORE__.getState().q}function N(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:A(),n=k.get(t,e);n&&(__STORE__.dispatch(__ACTIONS__.selectDict(t)),__STORE__.dispatch(__ACTIONS__.search_result(n)));var r=a(t,e);history.pushState({dict:t,offset:null,page:null,q:e,romaji:1,type:0},"",r)}function I(){document.querySelector(".search").addEventListener("click",(function(t){var e;N(__USERCONFIG__.defaultDict||(null===(e=o[0])||void 0===e?void 0:e.text)),t.stopPropagation(),t.preventDefault()}))}function V(){var t=A(),e=s.map((function(e){return function(t,e){var n=new URLSearchParams;return n.append("api","1"),n.append("dict",t),n.append("q",e),fetch("/dict/?".concat(n)).then((function(t){return t.json()}))}(e,t).then((function(n){return k.store(e,t,n)})).then((function(){var t;(t=e,document.querySelector('div.dict[title="'.concat(t,'"]'))).classList.add("preloaded")}))}));return Promise.allSettled(e)}function D(){document.querySelector("#sitetitle a").addEventListener("click",(function(){document.querySelector("input[type='search']").focus()}))}window.addEventListener("load",(function(){new P(__STORE__,q).listen(d()(p.a.mark((function t(){return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r().forEach((function(t){return t.classList.remove("preloaded")})),t.next=3,V();case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}}),t)})))),V(),o().forEach((function(t){return t.addEventListener("click",(function(t){N(t.path[1].title),t.stopPropagation(),t.preventDefault()}))})),I()})),console.log("Enabled preloading of results for selected dicts."),window.addEventListener("load",(function(){D()}));try{D()}catch(t){}function F(){var t;(t=document.querySelectorAll("div.word"),Array.from(t)).forEach((function(t){return function(t){var e,n=t.querySelector(".word-title-text").textContent,r=i().text,o=null===(e=w(n))||void 0===e?void 0:e[0];if(o){var s=a(r,o);t.querySelector(".word-permalink").href=s}}(t)}))}window.addEventListener("DOMNodeInserted",F),window.addEventListener("load",F)}]);