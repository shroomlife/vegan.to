(function(e){function t(t){for(var s,i,c=t[0],d=t[1],o=t[2],h=0,u=[];h<c.length;h++)i=c[h],Object.prototype.hasOwnProperty.call(n,i)&&n[i]&&u.push(n[i][0]),n[i]=0;for(s in d)Object.prototype.hasOwnProperty.call(d,s)&&(e[s]=d[s]);l&&l(t);while(u.length)u.shift()();return r.push.apply(r,o||[]),a()}function a(){for(var e,t=0;t<r.length;t++){for(var a=r[t],s=!0,c=1;c<a.length;c++){var d=a[c];0!==n[d]&&(s=!1)}s&&(r.splice(t--,1),e=i(i.s=a[0]))}return e}var s={},n={app:0},r=[];function i(t){if(s[t])return s[t].exports;var a=s[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=e,i.c=s,i.d=function(e,t,a){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)i.d(a,s,function(t){return e[t]}.bind(null,s));return a},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],d=c.push.bind(c);c.push=t,c=c.slice();for(var o=0;o<c.length;o++)t(c[o]);var l=d;r.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("56d7")},"1a36":function(e,t,a){},4678:function(e,t,a){var s={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn-bd":"9686","./bn-bd.js":"9686","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-in":"ec2e","./en-in.js":"ec2e","./en-nz":"6f50","./en-nz.js":"6f50","./en-sg":"b7e9","./en-sg.js":"b7e9","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-mx":"b5b7","./es-mx.js":"b5b7","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fil":"d69a","./fil.js":"d69a","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-deva":"aaf2","./gom-deva.js":"aaf2","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./oc-lnc":"167b","./oc-lnc.js":"167b","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tk":"5aff","./tk.js":"5aff","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf75","./tlh.js":"cf75","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-mo":"3a6c","./zh-mo.js":"3a6c","./zh-tw":"90ea","./zh-tw.js":"90ea"};function n(e){var t=r(e);return a(t)}function r(e){if(!a.o(s,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return s[e]}n.keys=function(){return Object.keys(s)},n.resolve=r,e.exports=n,n.id="4678"},"531b":function(e,t,a){"use strict";var s=a("a492"),n=a.n(s);n.a},"56d7":function(e,t,a){"use strict";a.r(t);a("e260"),a("e6cf"),a("cca6"),a("a79d");var s=a("2b0e"),n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"app"}},[a("router-view")],1)},r=[],i=a("2877"),c={},d=Object(i["a"])(c,n,r,!1,null,null,null),o=d.exports,l=a("9483");Object(l["a"])("".concat("/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});var h=a("8c4f"),u=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("h1",{staticClass:"display-1 text-center mt-5 mb-5"},[e._v("Tiermorde in Deutschland")]),a("p",[e._v(" Jeden Tag werden in Deutschland Tiere ermordet um dann bei Menschen auf dem Teller zu landen. Doch Tiere werden noch zu viel mehr Zwecken ausgenutzt und missbraucht. Hier findest du eine Übersicht, wie viele Tiere so für Menschen sterben müssen ohne eine Wahl zu haben. ")]),e.totalDeaths.length?a("div",{staticClass:"alert alert-danger",attrs:{role:"alert"}},[e._v(" Du bist seit "),a("strong",[e._v(e._s(e.computedTimeSinceStart))]),e._v(" hier und seit deiner lebendigen Ankunft hier mussten schon "),a("strong",[e._v(e._s(e.totalDeaths.length)+" Tiere")]),e._v(" ihr Leben für die Menschheit opfern. 😢 ")]):e._e(),e.ready?a("ul",{staticClass:"list-group pb-5 pt-3"},[e._m(0),e._l(e.animalData,(function(t,s){return a("div",{key:s,staticClass:"animalContainer"},[a("li",{staticClass:"list-group-item"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-5"},[a("h3",[e._v(e._s(t.names.emoji)+" "+e._s(t.names.plural))])]),a("div",{staticClass:"col-md-2 d-flex align-items-center justify-content-between justify-content-md-end"},[a("span",{staticClass:"d-block d-md-none"},[e._v("heute")]),a("span",{staticClass:"font-weight-bold text-danger"},[a("v-number",{attrs:{speed:369},model:{value:t.deaths.currentDayRounded,callback:function(a){e.$set(t.deaths,"currentDayRounded",a)},expression:"animal.deaths.currentDayRounded"}})],1)]),a("div",{staticClass:"col-md-2 d-flex align-items-center justify-content-between justify-content-md-end"},[a("span",{staticClass:"d-block d-md-none"},[e._v("pro Tag")]),a("span",{staticClass:"font-weight-bold"},[e._v(e._s(t.deaths.perDayView))])]),a("div",{staticClass:"col-md-3 d-flex align-items-center justify-content-between justify-content-md-end"},[a("span",{staticClass:"d-block d-md-none"},[e._v("dieses Jahr")]),a("span",{staticClass:"font-weight-bold text-danger"},[a("v-number",{attrs:{speed:369},model:{value:t.deaths.currentYearRounded,callback:function(a){e.$set(t.deaths,"currentYearRounded",a)},expression:"animal.deaths.currentYearRounded"}})],1)])]),a("div",{staticClass:"row"},[a("div",{class:t.children?"col-8":"col-12"},[t.deaths.list.length?a("small",[e._v("Seit du da bist "+e._s(t.deaths.list.length>1?"wurden":"wurde")+" schon "),a("span",{staticClass:"text-danger font-weight-bold"},[e._v(e._s(t.deaths.list.length)+" "+e._s(t.names.getNameByDeaths()))]),e._v(" getötet...")]):e._e()]),t.children.length?a("div",{staticClass:"col-md-4 text-right order-2 order-md-1"},[!1===t.childView?a("a",{staticClass:"btn btn-sm btn-light",attrs:{href:"javascript:"},on:{click:function(a){return a.preventDefault(),e.togglechildView(t)}}},[e._v("weitere Untergruppen")]):a("a",{staticClass:"btn btn-sm btn-light",attrs:{href:"javascript:"},on:{click:function(a){return a.preventDefault(),e.togglechildView(t)}}},[e._v("Untergruppen ausblenden")])]):e._e(),t.deaths.list.length?a("div",{staticClass:"col-12 order-1 order-md-2"},[e._v(" "+e._s(t.deaths.listView)+" ")]):e._e()])]),t.childView?a("div",e._l(t.children,(function(t,s){return a("li",{key:s,staticClass:"list-group-item children"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-5 pl-5"},[e._v("davon "+e._s(t.name))]),a("div",{staticClass:"col-md-2 d-flex align-items-center justify-content-end"},[e._v(" "+e._s(t.deaths.currentDay)+" ")]),a("div",{staticClass:"col-md-2 d-flex align-items-center justify-content-end"},[e._v(" "+e._s(t.deaths.perDayView)+" ")]),a("div",{staticClass:"col-md-3 d-flex align-items-center justify-content-end"},[e._v(" "+e._s(t.deaths.currentYear)+" ")])])])})),0):e._e()])}))],2):e._e(),e.totalDeaths.length?a("div",[a("h5",{staticClass:"display-5 text-center mt-3"},[e._v(" Tiermorde in Deutschland seit du da bist ")]),a("div",{staticClass:"text-center mb-3"},[a("span",{staticClass:"badge bg-light text-dark"},[e._v("🕰 Du bist seit "+e._s(e.computedTimeSinceStart)+" hier.")])]),a("p",{staticClass:"text-center"},[e._v(e._s(e.totalDeaths.join("")))]),a("div",{staticClass:"text-center"},e._l(e.animalData,(function(t,s){return a("div",{key:s,staticClass:"d-inline"},[t.deaths.list.length?a("span",{staticClass:"badge rounded-pill bg-dark m-1"},[e._v(e._s(t.deaths.list.length)+" "+e._s(t.names.emoji)+" "+e._s(t.names.getNameByDeaths()))]):e._e()])})),0)]):e._e(),a("h5",{staticClass:"display-5 text-center mt-5 mb-3"},[e._v("Was kann ich tun?")]),a("a",{staticClass:"btn btn-block cta",attrs:{href:"https://veganstart.de/",target:"_blank",rel:"noopener"}},[e._v(" #GoVegan ")]),a("div",{staticClass:"text-center shareLinks mt-3 mb-5"},[a("a",{staticClass:"resp-sharing-button__link",attrs:{href:"https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fvegan.to",target:"_blank",rel:"noopener","aria-label":""}},[a("div",{staticClass:"resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small"},[a("div",{staticClass:"resp-sharing-button__icon resp-sharing-button__icon--solid",attrs:{"aria-hidden":"true"}},[a("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"}},[a("path",{attrs:{d:"M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"}})])])])]),a("a",{staticClass:"resp-sharing-button__link",attrs:{href:e.computedShares.twitter.url,target:"_blank",rel:"noopener","aria-label":""}},[a("div",{staticClass:"resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small"},[a("div",{staticClass:"resp-sharing-button__icon resp-sharing-button__icon--solid",attrs:{"aria-hidden":"true"}},[a("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"}},[a("path",{attrs:{d:"M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"}})])])])]),a("a",{staticClass:"resp-sharing-button__link",attrs:{href:"mailto:?subject=#GoVegan&body="+e.computedShares.text,target:"_self",rel:"noopener","aria-label":""}},[a("div",{staticClass:"resp-sharing-button resp-sharing-button--email resp-sharing-button--small"},[a("div",{staticClass:"resp-sharing-button__icon resp-sharing-button__icon--solid",attrs:{"aria-hidden":"true"}},[a("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"}},[a("path",{attrs:{d:"M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z"}})])])])]),a("a",{staticClass:"resp-sharing-button__link",attrs:{href:"https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fvegan.to",target:"_blank",rel:"noopener","aria-label":""}},[a("div",{staticClass:"resp-sharing-button resp-sharing-button--linkedin resp-sharing-button--small"},[a("div",{staticClass:"resp-sharing-button__icon resp-sharing-button__icon--solid",attrs:{"aria-hidden":"true"}},[a("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"}},[a("path",{attrs:{d:"M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z"}})])])])]),a("a",{staticClass:"resp-sharing-button__link",attrs:{href:"whatsapp://send?text="+e.computedShares.text,target:"_blank",rel:"noopener","aria-label":""}},[a("div",{staticClass:"resp-sharing-button resp-sharing-button--whatsapp resp-sharing-button--small"},[a("div",{staticClass:"resp-sharing-button__icon resp-sharing-button__icon--solid",attrs:{"aria-hidden":"true"}},[a("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"}},[a("path",{attrs:{d:"M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z"}})])])])]),a("a",{staticClass:"resp-sharing-button__link",attrs:{href:"https://t.me/share/url?url=https%3A%2F%2Fvegan.to&text="+e.computedShares.text,target:"_blank",rel:"noopener","aria-label":""}},[a("div",{staticClass:"resp-sharing-button resp-sharing-button--telegram resp-sharing-button--small"},[a("div",{staticClass:"resp-sharing-button__icon resp-sharing-button__icon--solid",attrs:{"aria-hidden":"true"}},[a("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"}},[a("path",{attrs:{d:"M.707 8.475C.275 8.64 0 9.508 0 9.508s.284.867.718 1.03l5.09 1.897 1.986 6.38a1.102 1.102 0 0 0 1.75.527l2.96-2.41a.405.405 0 0 1 .494-.013l5.34 3.87a1.1 1.1 0 0 0 1.046.135 1.1 1.1 0 0 0 .682-.803l3.91-18.795A1.102 1.102 0 0 0 22.5.075L.706 8.475z"}})])])])])]),a("p",[e._v(" Die Zahlen sind eine Hochrechnung basierend auf den Schlachtungen in Deutschland vom Jahr 2019. ")]),e._m(1),e._m(2)])},f=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("li",{staticClass:"list-group-item font-weight-bold"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-5"},[a("span",{staticClass:"d-none d-md-block"},[e._v("Tier")]),a("span",{staticClass:"d-block d-md-none"},[e._v("Tiere")])]),a("div",{staticClass:"col-md-2 d-flex align-items-center justify-content-end"},[a("span",{staticClass:"d-none d-md-block"},[e._v("heute")])]),a("div",{staticClass:"col-md-2 d-flex align-items-center justify-content-end"},[a("span",{staticClass:"d-none d-md-block"},[e._v("pro Tag")])]),a("div",{staticClass:"col-md-3 d-flex align-items-center justify-content-end text-right"},[a("span",{staticClass:"d-none d-md-block"},[e._v("dieses Jahr")])])])])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("p",[e._v(" Quelle: "),a("a",{attrs:{href:"https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Landwirtschaft-Forstwirtschaft-Fischerei/Tiere-Tierische-Erzeugung/Tabellen/gewerbliche-schlachtung-jahr-halbjahr.html",target:"_blank",rel:"noopener"}},[e._v(" Gewerbliche Schlachtungen im 1. Halbjahr 2019 ")]),e._v(" vom Statistischen Bundesamt (Stand: 7. August 2019) ")])},function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("p",[e._v(" Aktuelles Logo von "),a("a",{attrs:{href:"https://freeicons.io/profile/722",target:"_blank",rel:"noopener"}},[e._v("Fasil @ www.freeicons.io")]),e._v(", Danke! ")])}],m=(a("99af"),a("cb29"),a("a15b"),a("d81d"),a("2909")),b=a("b8ca"),p=a.n(b),g=a("3e6a"),v=a.n(g),j=a("8f14"),w=a.n(j),y=a("c1df"),_=a.n(y),D=a("70c6"),k=a("2ef0"),C=a.n(k),x={name:"Home",components:{VNumber:D["VNumber"]},data:function(){return{started:_()(),now:_()(),animalData:p.a,totalDeaths:[],ready:!1}},computed:{computedShares:function(){var e="In nur ".concat(this.computedTimeSinceStart," in denen ich auf https://vegan.to war, sind in #Deutschland schon ").concat(this.totalDeaths.length," Tiere ermordet worden...\n\n#GoVegan\n#StopEatingAnimals\n#PostmeatGeneration\n\n🐷🐮🐔");return{text:e,twitter:{url:"https://twitter.com/intent/tweet/?text=".concat(encodeURIComponent(e),"&amp;url=").concat(encodeURIComponent("https://vegan.to"))}}},computedDeathsPerAnimal:function(){return this.animalData.map((function(e){return e}))},computedTimeSinceStart:function(){var e=this.now.diff(this.started);return w()(e,{language:"de",fallbacks:["en"],round:!0})},totalValues:function(){var e={currentYear:0};return this.animalData.map((function(t){e.currentYear+=t.deaths.currentYearRaw,e.currentDay+=t.deaths.currentDayRaw})),e.currentYear=v.a.numberFormat(e.currentYear,0,".","."),e.currentDay=v.a.numberFormat(e.currentDay,0,".","."),e}},methods:{togglechildView:function(e){this.animalData=this.animalData.map((function(t){return e.names.single===t.names.single&&(t.childView=!t.childView),t}))},loadData:function(){var e=Math.abs(_()().startOf("year").diff(this.now)/1e3),t=Math.abs(_()().startOf("day").diff(this.now)/1e3);this.animalData=this.animalData.map((function(a){return a.deaths.currentYearRaw=a.deaths.perSec*e,a.deaths.currentYearRounded=Math.round(a.deaths.currentYearRaw),a.deaths.currentYear=v.a.numberFormat(Math.round(a.deaths.currentYearRaw),0,".","."),a.deaths.currentDayRaw=a.deaths.perSec*t,a.deaths.currentDayRounded=Math.round(a.deaths.currentDayRaw),a.deaths.currentDay=v.a.numberFormat(Math.round(a.deaths.currentDayRaw),0,".","."),a.deaths.perDayView=Math.round(a.deaths.perDay),a.deaths.list=[],a.deaths.listView="","undefined"!==typeof a.children?(a.children.map((function(a){a.deaths.currentYearRaw=a.deaths.perSec*e,a.deaths.currentYear=v.a.numberFormat(Math.round(a.deaths.currentYearRaw),0,".","."),a.deaths.currentYearRounded=Math.round(a.deaths.currentYearRaw),a.deaths.currentDayRaw=a.deaths.perSec*t,a.deaths.currentDayRounded=Math.round(a.deaths.currentDayRaw),a.deaths.currentDay=v.a.numberFormat(Math.round(a.deaths.currentDayRaw),0,".","."),a.deaths.perDayView=v.a.numberFormat(a.deaths.perDay,0,".",".")})),a.children=a.children.sort((function(e,t){return t.deaths.year-e.deaths.year}))):a.children=[],a.childView=!1,a}))},updateData:function(){var e=this;this.now=_()(),this.totalDeaths=[];var t=this.now.diff(this.started)/1e3;this.animalData=this.animalData.map((function(a){var s=a.deaths.perSec*t;a.deaths.currentYear=v.a.numberFormat(Math.round(a.deaths.currentYearRaw+s),0,".","."),a.deaths.currentYearRounded=Math.round(a.deaths.currentYearRaw),a.deaths.currentDay=v.a.numberFormat(Math.round(a.deaths.currentDayRaw+s),0,".","."),a.deaths.currentDayRounded=Math.round(a.deaths.currentDayRaw+s);var n,r=Math.round(s);r>0&&(a.deaths.list=Array(r).fill(a.names.emoji),(n=e.totalDeaths).push.apply(n,Object(m["a"])(a.deaths.list)),a.deaths.listView=a.deaths.list.join(""));return"undefined"!==typeof a.children&&(a.children.map((function(e){e.deaths.currentYear=v.a.numberFormat(Math.round(e.deaths.currentYearRaw+s),0,".","."),e.deaths.currentYearRounded=Math.round(e.deaths.currentYearRaw),e.deaths.currentDay=v.a.numberFormat(Math.round(e.deaths.currentDayRaw+s),0,".","."),e.deaths.currentDayRounded=Math.round(e.deaths.currentDayRaw+s)})),a.children=a.children.sort((function(e,t){return t.deaths.year-e.deaths.year}))),a})),this.totalDeaths=C.a.shuffle(this.totalDeaths)}},mounted:function(){this.loadData(),this.ready=!0,setInterval(this.updateData,1e3)}},z=x,R=(a("531b"),Object(i["a"])(z,u,f,!1,null,"26d05e82",null)),M=R.exports;s["a"].use(h["a"]);var S=[{path:"/",name:"Home",component:M}],F=new h["a"]({routes:S,mode:"history"}),Y=F,T=a("cd06"),V=a("d1b8");a("dec9"),a("764c"),a("1a36");s["a"].use(V["a"]),s["a"].use(T["a"]),s["a"].config.productionTip=!1,new s["a"]({router:Y,render:function(e){return e(o)}}).$mount("#app")},"764c":function(e,t,a){},a492:function(e,t,a){},b8ca:function(e,t,a){a("d81d");var s=a("b90b"),n=function(){var e=[{names:{single:"Rind",plural:"Rinder",emoji:s.get("cow")},deaths:{year:3299e3},children:[{name:"Kälber",deaths:{year:313800}},{name:"Jungrinder",deaths:{year:17400}},{name:"Färsen",deaths:{year:566200}},{name:"Kühe",deaths:{year:1156e3}},{name:"Ochsen",deaths:{year:19600}},{name:"Bullen",deaths:{year:1226200}}]},{names:{single:"Schwein",plural:"Schweine",emoji:s.get("pig")},deaths:{year:54435e3}},{names:{single:"Huhn",plural:"Hühner",emoji:s.get("chicken")},deaths:{year:1573600},children:[{name:"Jungmasthühner ",deaths:{year:1025e3}},{name:"Truthühner",deaths:{year:474800}}]},{names:{single:"Schaf",plural:"Schafe",emoji:s.get("sheep")},deaths:{year:1107200},children:[{name:"Lämmer",deaths:{year:994200}},{name:"übrige Schafe",deaths:{year:113e3}}]},{names:{single:"Ziege",plural:"Ziegen",emoji:s.get("goat")},deaths:{year:19600}},{names:{single:"Pferd",plural:"Pferde",emoji:s.get("horse")},deaths:{year:4800}}];return e=e.sort((function(e,t){return t.deaths.year-e.deaths.year})),e=e.map((function(e){return e.deaths.perDay=parseFloat(e.deaths.year/365),e.deaths.perHour=parseFloat(e.deaths.perDay/24),e.deaths.perMin=parseFloat(e.deaths.perDay/1440),e.deaths.perSec=parseFloat(e.deaths.perDay/86400),e.names.getNameByDeaths=function(){return e.deaths.list.length>1?e.names.plural:e.names.single},"undefined"!==typeof e.children&&(e.children.map((function(e){e.deaths.perDay=parseFloat(e.deaths.year/365),e.deaths.perHour=parseFloat(e.deaths.perDay/24),e.deaths.perMin=parseFloat(e.deaths.perDay/1440),e.deaths.perSec=parseFloat(e.deaths.perDay/86400)})),e.children=e.children.sort((function(e,t){return t.deaths.year-e.deaths.year}))),e})),console.log(e),e};e.exports=n()},dec9:function(e,t,a){}});
//# sourceMappingURL=app.f118851d.js.map