let e=new function(e={}){let t=this;t.routes=[];let n=function(e){};Object.defineProperty(t,"onHashChange",{get:function(){return n},set:function(e){n=e,window.onhashchange=t.__onHashChange}}),t.__onHashChange=function(){let e=location.hash.slice(1).split("?")[0],r=t.routes.find((t=>t.pattern.test(e))),a=r?r.value:"404";n(a)},t.onHashChange=e.onHashChange||n,t.getSearchParams=function(e=location.search){if(e||(e=/\?.+$/.exec(location.hash))&&(e=e[0]),!e)return;e=e.replace("&amp;","&");let t=new URLSearchParams(e),n={};for(const e of t.keys())n[e]=t.get(e);return n},t.addRoutes=function(e){Array.isArray(e)&&e.forEach((e=>t.addRoute(e)))},t.addRoute=function(e){if(e.route instanceof RegExp&&(e.pattern=e.route,t.routes.push(e)),"string"==typeof e.route)return e.pattern=t.getPathRegex(e.route),t.routes.push(e),t.routes};return t.getPathRegex=function(e){return e=function(e){return["(",")","/"].forEach((t=>{e=e.replace(t,"\\"+t)})),e}(e=function(e){return e.replace(/{.+}/,".+")}(e)),new RegExp("^"+e+"$")},t},t=new function(e={}){let n=this;n.__container=null,Object.defineProperty(n,"container",{get:()=>n.__container,set:e=>{if("string"==typeof e&&(e=document.getElementById(e)),!(e instanceof HTMLElement))throw new Error("Cannot find HTMLElement: "+e);n.__container=e,n.__bindContent(),n.__bindData()}}),n.__content=null,Object.defineProperty(n,"content",{get:()=>n.__content,set:e=>{"string"==typeof e&&(n.__content=e,n.__bindContent(),n.__bindData())}}),n.__data=null,Object.defineProperty(n,"data",{get:()=>n.__data,set:e=>{n.__data=e,n.__bindData()}}),n.__bindContent=function(){if(n.__container&&n.__content){for(;n.container.firstChild;)n.container.removeChild(n.container.firstChild);n.container.insertAdjacentHTML("afterbegin",n.content)}},n.__bindData=function(){n.__container&&n.__content&&n.__data&&n.container.querySelectorAll("[data-field]").forEach((e=>{let t=(e.getAttribute("data-field")||e.id).split(".").reduce(((e,t)=>e[t]),n.__data);void 0!==e.value?e.value=t:e.innerHTML=t}))},n.loadStyleSheet=function(e){let t=document.createElement("link");t.rel="stylesheet",t.type="text/css",t.href=e;let n=document.getElementsByTagName("link");if(!Array.from(n).some((e=>e.href==t.href)))return document.getElementsByTagName("head")[0].appendChild(t),t},n.loadScript=function(e){let t=document.createElement("script");t.src=e;let n=document.getElementsByTagName("script");if(!Array.from(n).some((e=>e.src==t.src)))return document.getElementsByTagName("head")[0].appendChild(t),t},n.initialize=function(e){},n.extend=function(e={}){return function(n={}){for(let t in n)e[t]=n[t];return t.call(this,e),this}};for(let t in e)this[t]=e[t];return n.initialize.bind(n)(),n};const n=new function(){let e=this;e.open=function(t,n={}){n=e.setDefaultArgs(n);let r=new XMLHttpRequest;r.open(n.method,t,n.async),r=e.__setEvents(r,n),r=e.__setCallbackChains(r),r=e.__setHeaders(r,n);for(let e in n)r[e]=n[e];return r},e.get=function(t,n){return e.open(t,n)},e.post=function(t,n,r={}){return r.method="POST",r.data=n,e.open(t,r)},e.put=function(t,n,r={}){return r.method="PUT",r.data=n,e.open(t,r)},e.delete=function(t,n={}){return n.method="DELETE",e.open(t,n)},e.defaultArgs={method:"GET",async:!0,responseType:"text"},e.setDefaultArgs=function(t={}){for(let n in e.defaultArgs)t[n]=t[n]||e.defaultArgs[n];return t};let t=["abort","error","load","loadend","loadstart","progress","timeout"];return e.__setEvents=function(e,n={}){return t.forEach((t=>{let r=n[t]||n["on"+t];r&&e.addEventListener(t,(e=>r(e)))})),e},e.__setCallbackChains=function(e){return e.load=function(t){return e.addEventListener("load",(n=>t(e.response))),e.send(e.data),e},e.error=function(t){return e.addEventListener("error",t),e},e.then=e.load,e.catch=e.error,e},e.__setHeaders=function(e,t={}){return Array.isArray(t.headers)?(t.headers.forEach((t=>{t.header&&t.value?e.setRequestHeader(t.header,t.value):console.log('Header must be in form { header : "ABC", value : "XYZ" }')})),e):e},e};export{t as lite,e as router,n as xhr};
