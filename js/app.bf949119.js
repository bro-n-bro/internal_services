(function(){var e={99877:function(e,t,n){"use strict";var o=n(45130),i=n(93367),r=n(56768),a=n(24232),s=n(90144),c=n(24113),l=n(84481),u=n(81387),d=n(38326),f=n(61981);const _={class:"processing_loader_wrap"},p=(0,r.Fv)('<div class="loader-wheel" data-v-3b42a9a6><span class="loader-wheel__spoke" data-v-3b42a9a6></span><span class="loader-wheel__spoke" data-v-3b42a9a6></span><span class="loader-wheel__spoke" data-v-3b42a9a6></span><span class="loader-wheel__spoke" data-v-3b42a9a6></span><span class="loader-wheel__spoke" data-v-3b42a9a6></span><span class="loader-wheel__spoke" data-v-3b42a9a6></span><span class="loader-wheel__spoke" data-v-3b42a9a6></span><span class="loader-wheel__spoke" data-v-3b42a9a6></span><span class="loader-wheel__spoke" data-v-3b42a9a6></span><span class="loader-wheel__spoke" data-v-3b42a9a6></span><span class="loader-wheel__spoke" data-v-3b42a9a6></span><span class="loader-wheel__spoke" data-v-3b42a9a6></span></div>',1),m=[p];function b(e,t){return(0,r.uX)(),(0,r.CE)("div",_,m)}var h=n(71241);const g={},v=(0,h.A)(g,[["render",b],["__scopeId","data-v-3b42a9a6"]]);var k=v;const w=c+"#ic_notification_success",x=c+"#ic_notification_error",y=c+"#ic_link_arrow",C={class:"notification"},S={key:0,class:"icon green"},N=(0,r.Lk)("svg",null,[(0,r.Lk)("use",{"xlink:href":w})],-1),O=[N],E={key:1,class:"icon red"},T=(0,r.Lk)("svg",null,[(0,r.Lk)("use",{"xlink:href":x})],-1),A=[T],L={key:2,class:"icon"},B={key:3},I={class:"chain"},M={class:"tx_type"},j={class:"title"},K=["innerHTML"],P={key:5,class:"explorer"},F=["href"],W=(0,r.Lk)("svg",null,[(0,r.Lk)("use",{"xlink:href":y})],-1);var X={__name:"App",setup(e){const t=(0,l.o)(),n=(0,r.WQ)("i18n"),o=(0,u.lq)(),i=(0,d.K7Q)(),c=(0,r.EW)((()=>o.meta.layout||"default-layout"));return(0,r.KC)((()=>{i.value=n.global.t("message.page_title"),window.addEventListener("keplr_keystorechange",(()=>{window.location.reload()}))})),(0,r.wB)((0,r.EW)((()=>t.currentNetwork)),(async()=>{await(0,f.g$)(t.networks[t.currentNetwork].chainId)})),(e,n)=>{const o=(0,r.g2)("notifications");return(0,r.uX)(),(0,r.CE)(r.FK,null,[((0,r.uX)(),(0,r.Wv)((0,r.$y)(c.value))),(0,r.bF)(o,{width:"280px",group:"default"},{body:(0,r.k6)((n=>[(0,r.Lk)("div",C,["success"==n.item.type?((0,r.uX)(),(0,r.CE)("div",S,O)):(0,r.Q3)("",!0),"error"==n.item.type?((0,r.uX)(),(0,r.CE)("div",E,A)):(0,r.Q3)("",!0),n.item.type?(0,r.Q3)("",!0):((0,r.uX)(),(0,r.CE)("div",L,[(0,r.bF)(k)])),n.item.data.chain&&n.item.data.tx_type?((0,r.uX)(),(0,r.CE)("div",B,[(0,r.Lk)("div",I,(0,a.v_)(n.item.data.chain),1),(0,r.Lk)("div",M,(0,a.v_)(n.item.data.tx_type),1)])):(0,r.Q3)("",!0),(0,r.Lk)("div",j,(0,a.v_)(n.item.title),1),n.item.text?((0,r.uX)(),(0,r.CE)("div",{key:4,class:"text",innerHTML:n.item.text},null,8,K)):(0,r.Q3)("",!0),n.item.data.tx_hash?((0,r.uX)(),(0,r.CE)("div",P,[(0,r.Lk)("a",{href:`https://www.mintscan.io/${(0,s.R1)(t).networks[(0,s.R1)(t).currentNetwork].mintscanPrefix}/txs/${n.item.data.tx_hash}`,target:"_blank",rel:"noopener nofollow"},[(0,r.Lk)("span",null,(0,a.v_)(e.$t("message.notification_explorer_link")),1),W],8,F)])):(0,r.Q3)("",!0)])])),_:1})],64)}}};const $=X;var U=$;const q={class:"actions"},Q={class:"list"};function D(e,t){const n=(0,r.g2)("router-link");return(0,r.uX)(),(0,r.CE)("section",q,[(0,r.Lk)("div",Q,[(0,r.bF)(n,{to:"/multisend/cosmoshub",class:"item"},{default:(0,r.k6)((()=>[(0,r.eW)("Multisend")])),_:1}),(0,r.bF)(n,{to:"/ibs",class:"item"},{default:(0,r.k6)((()=>[(0,r.eW)("IBS")])),_:1}),(0,r.bF)(n,{to:"/ibc_route/cosmoshub",class:"item"},{default:(0,r.k6)((()=>[(0,r.eW)("IBC route")])),_:1})])])}const R={},Y=(0,h.A)(R,[["render",D],["__scopeId","data-v-2d4b8a49"]]);var H=Y;const V={class:"main"},G={class:"cont"},J={class:"grid row"},z={class:"col"},Z={class:"col_main"};var ee={__name:"Default",setup(e){return(e,t)=>{const n=(0,r.g2)("RouterView");return(0,r.uX)(),(0,r.CE)("div",V,[(0,r.Lk)("div",G,[(0,r.Lk)("div",J,[(0,r.Lk)("section",z,[(0,r.bF)(H)]),(0,r.Lk)("section",Z,[(0,r.bF)(n)])])])])}}};const te=(0,h.A)(ee,[["__scopeId","data-v-4715e2b0"]]);var ne=te;const oe=[{path:"/",name:"MainPage",component:()=>n.e(798).then(n.bind(n,25798)),meta:{layout:ne}},{path:"/multisend/:network",name:"Multisend",component:()=>n.e(768).then(n.bind(n,99768)),meta:{layout:ne}},{path:"/ibs",name:"IBS",component:()=>n.e(547).then(n.bind(n,6547)),meta:{layout:ne}},{path:"/ibc_route/:network",name:"IBCRoute",component:()=>n.e(198).then(n.bind(n,12198)),meta:{layout:ne}}],ie=(0,u.aE)({history:(0,u.LA)(),routes:oe});ie.beforeResolve((async(e,t,n)=>{let o=(0,l.o)();e.params.network&&(o.currentNetwork=e.params.network),n()}));var re=ie,ae=n(85384),se={en:{message:{page_title:"Bro services",networks_title:"Select network",multisend_page_title:"Multisend in {network}",multisend_form_to_address_label:"Address of the recipient",multisend_form_amount_label:"Amount",multisend_form_from_label:"From",ibs_page_title:"Inter Blockchain Services",ibs_modal_title:"Logs :",ibs_modal_processing:"Processing...",ibc_route_page_title:"IBC route",btn_send:"Send",btn_max:"Max",btn_add:"Add",btn_confirm:"Confrim",btn_clear:"Clear packets",btn_update:"Update client",btn_execute:"Execute",btn_close:"Close",btn_import_csv:"Import CSV",btn_clear_all:"Clear all",notification_progress_title:"Transaction is in progress",notification_successful_title:"Transaction successful",notification_failed_title:"Transaction failed",notification_explorer_link:"Explorer",notification_failed_validate_title:"Validate failed",notification_failed_validate_desc:"All fields are required",notification_multisend_process:"Multisend processing...",notification_multisend_success_title:"Multisend successful",notification_multisend_action:"Multisend",notification_importCSV_title:"Some error",notification_importCSV_desc:"The imported file contains errors.",notification_tx_error_2:"tx parse error",notification_tx_error_3:"invalid sequence",notification_tx_error_4:"unauthorized",notification_tx_error_5:"insufficient funds",notification_tx_error_6:"unknown request",notification_tx_error_7:"invalid address",notification_tx_error_8:"invalid pubkey",notification_tx_error_9:"unknown address",notification_tx_error_10:"invalid coins",notification_tx_error_11:"Broadcasting transaction failed: out of gas try again and increase gas amount",notification_tx_error_12:"memo too large",notification_tx_error_13:"insufficient fee",notification_tx_error_14:"maximum number of signatures exceeded",notification_tx_error_15:"no signatures supplied",notification_tx_error_16:"failed to marshal JSON bytes",notification_tx_error_17:"failed to unmarshal JSON bytes",notification_tx_error_18:"invalid request",notification_tx_error_19:"tx already in mempool",notification_tx_error_20:"mempool is full",notification_tx_error_21:"tx too large",notification_tx_error_22:"key not found",notification_tx_error_23:"invalid account password",notification_tx_error_24:"tx intended signer does not match the given signer",notification_tx_error_25:"invalid gas adjustment",notification_tx_error_26:"invalid height",notification_tx_error_27:"invalid version",notification_tx_error_28:"invalid chain-id",notification_tx_error_29:"invalid type",notification_tx_error_30:"tx timeout height",notification_tx_error_31:"unknown extension options",notification_tx_error_32:"incorrect account sequence",notification_tx_error_33:"failed packing protobuf message to Any",notification_tx_error_34:"failed unpacking protobuf message from Any",notification_tx_error_35:"internal logic error",notification_tx_error_36:"conflict",notification_tx_error_37:"feature not supported",notification_tx_error_38:"not found",notification_tx_error_39:"Internal IO error",notification_tx_error_40:"error in app.toml",notification_tx_error_41:"invalid gas limit",notification_tx_error_rejected:"The transaction has been rejected"}}};const ce=(0,ae.hU)({locale:"en",fallbackLocale:"en",messages:se});var le=ce,ue=n(50595),de=n(67278);const fe=(0,ue.A)(),_e=(0,o.Ef)(U),pe=(0,i.Ey)();_e.use(pe),_e.use(re),_e.use(le),_e.use(de.Ay),_e.provide("i18n",le),_e.provide("emitter",fe),_e.config.globalProperties.$filters={toFixed(e,t){let n;return n=0!=e?e.toFixed(t):e,n}},_e.mount("#app")},84481:function(e,t,n){"use strict";n.d(t,{o:function(){return h}});var o=n(93367),i=n(61981),r=n(26776),a=n(36585);const s={name:"Cosmos Hub",lcd_api:"https://lcd.cosmoshub-4.bronbro.io",rpc_api:"https://rpc.cosmoshub-4.bronbro.io",denom:"uatom",token_name:"ATOM",chainId:"cosmoshub-4",prefix:"cosmos",mintscanPrefix:"cosmos",alias:"cosmoshub",exponent:6};var c=s;const l={name:"Osmosis",lcd_api:"https://lcd.osmosis-1.bronbro.io",rpc_api:"https://rpc.osmosis-1.bronbro.io",denom:"uosmo",token_name:"OSMO",chainId:"osmosis-1",prefix:"osmo",mintscanPrefix:"osmosis",alias:"osmosis",exponent:6};var u=l;const d={name:"Bostrom",lcd_api:"https://lcd.bostrom.bronbro.io",rpc_api:"https://rpc.bostrom.bronbro.io",denom:"boot",token_name:"BOOT",chainId:"bostrom",prefix:"bostrom",alias:"bostrom",exponent:0};var f=d;const _={pretty_name:"Space pussy",chain_id:"space-pussy",bech32_prefix:"pussy",images:[{png:"/space_pussy_logo.png"}]};var p=_,m=n(94348);const b={multisend:{cosmoshub:c,osmosis:u,bostrom:f},ibs:{space_pussy:p},IBC:{cosmoshub:c,osmosis:u,bostrom:f}},h=(0,o.nY)("global",{state:()=>({currentNetwork:"cosmoshub",Keplr:{},stargateClient:{},isKeplrConnected:!1,prices:[],balances:[],networks:b,socket:{},formatableTokens:[{tokenName:"BOOT",formatTokenName:"MBOOT",exponent:6},{tokenName:"HYDROGEN",formatTokenName:"MHYDROGEN",exponent:6},{tokenName:"TOCYB",formatTokenName:"MTOCYB",exponent:6}]}),actions:{async getCurrenciesPrice(){try{await fetch("https://rpc.bronbro.io/price_feed_api/tokens/").then((e=>e.json())).then((e=>this.prices=e))}catch(e){m.error(e)}},async GetIBSCommands(){let e=[];try{await fetch("https://rly.bronbro.io").then((e=>e.json())).then((t=>e=t.available_commands))}catch(t){m.error(t)}return e},async initApp(){window.keplr&&(await(0,i.g$)(this.networks.multisend[this.currentNetwork].chainId),this.stargateClient=await r.SigningStargateClient.connectWithSigner(this.networks.multisend[this.currentNetwork].rpc_api,this.Keplr.offlineSinger),await this.getCurrenciesPrice(),await this.getBalances())},async getBalances(){this.balances=await this.stargateClient.getAllBalances(this.Keplr.account.address);for(const t of this.balances){if(t.denom_traces=await(0,i.E0)(t.denom),t.denom_traces.ingnoreTraces)try{let e=a.mY.find((({chain_name:e})=>e===this.networks.multisend[this.currentNetwork].alias)),n=e.assets.find((({base:e})=>e===t.denom));t.base_denom=t.denom_traces.base_denom,t.symbol=n.symbol;let o=this.formatableTokens.find((e=>e.tokenName==n.symbol.toUpperCase()));t.exponent=o?o.exponent:n.denom_units.find((e=>e.denom==t.denom_traces.base_denom)).exponent}catch(e){m.error(e)}else a.mY.forEach((e=>{let n=e.assets.find((e=>e.base===t.denom_traces.base_denom));if(n){t.base_denom=n.base,t.symbol=n.symbol;let e=this.formatableTokens.find((e=>e.tokenName==n.base.toUpperCase()));t.exponent=e?e.exponent:n.denom_units[1]?.exponent||0}}));t.price=(0,i.AN)(t.symbol);let n=this.formatableTokens.find((e=>e.tokenName==t.symbol));t.cost=n?t.amount*t.price:(0,i.NJ)(t.amount,t.base_denom)*t.price}this.balances=this.balances.filter((e=>e.hasOwnProperty("exponent"))),this.balances.sort(((e,t)=>e.cost>t.cost?-1:e.cost<t.cost?1:0))},initWebSockets(){this.socket=new WebSocket("wss://rly.bronbro.io/ws")}}})},61981:function(e,t,n){"use strict";n.d(t,{AN:function(){return p},E0:function(){return c},NJ:function(){return u},g$:function(){return d},mO:function(){return l},nw:function(){return f},oB:function(){return _}});var o=n(84481),i=n(26776),r=(n(89354),n(80457)),a=n(36585),s=n(94348);const c=async e=>{let t=(0,o.o)(),n={path:null,base_denom:e},i=e.split("/");if("ibc"==i[0])try{await fetch(`${t.networks.multisend[t.currentNetwork].lcd_api}/ibc/apps/transfer/v1/denom_traces/${i[1]}`).then((e=>e.json())).then((e=>n=e.denom_trace))}catch(r){s.error(r)}else"factory"==i[0]&&(n.ingnoreTraces=!0,n.base_denom=i[i.length-1]);return n},l=e=>{if(e){let t=(0,o.o)(),n="",i=t.balances.find((t=>t.denom==e)).symbol;return t.formatableTokens.find((e=>e.tokenName==i.toUpperCase()))&&(n=t.formatableTokens.find((e=>e.tokenName==i.toUpperCase())).formatTokenName),n.length?n:i}},u=(e,t)=>{let n=(0,o.o)(),i=e/Math.pow(10,n.balances.find((e=>e.base_denom==t)).exponent);return i},d=async e=>{let t=(0,o.o)();window.keplr.defaultOptions={sign:{preferNoSetFee:!0}},await window.keplr.enable(e),t.Keplr.offlineSinger=await window.getOfflineSignerAuto(e),Object.assign(t.Keplr.offlineSinger,{signAmino:t.Keplr.offlineSinger.signAmino??t.Keplr.offlineSinger.sign});let n=await t.Keplr.offlineSinger.getAccounts();t.Keplr.account=n[0],t.Keplr.key=await window.keplr.getKey(e),t.isKeplrConnected=!0},f=async(e,t)=>{let n=(0,o.o)(),a=n.networks.multisend[t].rpc_api,s=await window.keplr.getChainInfosWithoutEndpoints(),c=s.find((e=>e.chainId===n.networks.multisend[t].chainId)),l=c.feeCurrencies[0],u=new i.GasPrice(r.Decimal.fromUserInput(l.gasPriceStep?.average.toString()||"0",3),l?.coinMinimalDenom),d=await i.SigningStargateClient.connectWithSigner(a,n.Keplr.offlineSinger,{gasPrice:u}),f="bro.multisend",_=await d.signAndBroadcast(n.Keplr.account.address,e,"auto",f);return _},_=e=>{let t=(0,o.o)(),n=null;return n="space-pussy"===e?t.networks.ibs.space_pussy.images:a.Bt.find((t=>t.chain_id===e)).images,n[n.length-1].svg?n[n.length-1].svg:n[n.length-1].png},p=e=>{let t=(0,o.o)(),n=0;if(e){let o=t.prices.find((t=>t.symbol==e.toUpperCase()));o&&(n=o.price)}return n}},24113:function(e,t,n){"use strict";e.exports=n.p+"img/sprite.7842d41d.svg"},78982:function(){},47790:function(){},73776:function(){},21638:function(){},92668:function(){},77965:function(){},66089:function(){},79368:function(){},77667:function(){},76447:function(){},64688:function(){},51069:function(){},63779:function(){},77199:function(){}},t={};function n(o){var i=t[o];if(void 0!==i)return i.exports;var r=t[o]={id:o,loaded:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.loaded=!0,r.exports}n.m=e,function(){var e=[];n.O=function(t,o,i,r){if(!o){var a=1/0;for(u=0;u<e.length;u++){o=e[u][0],i=e[u][1],r=e[u][2];for(var s=!0,c=0;c<o.length;c++)(!1&r||a>=r)&&Object.keys(n.O).every((function(e){return n.O[e](o[c])}))?o.splice(c--,1):(s=!1,r<a&&(a=r));if(s){e.splice(u--,1);var l=i();void 0!==l&&(t=l)}}return t}r=r||0;for(var u=e.length;u>0&&e[u-1][2]>r;u--)e[u]=e[u-1];e[u]=[o,i,r]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}}(),function(){n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce((function(t,o){return n.f[o](e,t),t}),[]))}}(),function(){n.u=function(e){return"js/"+e+"."+{198:"9084051f",547:"17c8d4b6",768:"3fb231a1",798:"7c40fc9c"}[e]+".js"}}(),function(){n.miniCssF=function(e){return"css/"+e+"."+{198:"acec452b",547:"670aaa25",768:"14c0e9bb"}[e]+".css"}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="internal_services:";n.l=function(o,i,r,a){if(e[o])e[o].push(i);else{var s,c;if(void 0!==r)for(var l=document.getElementsByTagName("script"),u=0;u<l.length;u++){var d=l[u];if(d.getAttribute("src")==o||d.getAttribute("data-webpack")==t+r){s=d;break}}s||(c=!0,s=document.createElement("script"),s.charset="utf-8",s.timeout=120,n.nc&&s.setAttribute("nonce",n.nc),s.setAttribute("data-webpack",t+r),s.src=o),e[o]=[i];var f=function(t,n){s.onerror=s.onload=null,clearTimeout(_);var i=e[o];if(delete e[o],s.parentNode&&s.parentNode.removeChild(s),i&&i.forEach((function(e){return e(n)})),t)return t(n)},_=setTimeout(f.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=f.bind(null,s.onerror),s.onload=f.bind(null,s.onload),c&&document.head.appendChild(s)}}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){n.p="/"}(),function(){if("undefined"!==typeof document){var e=function(e,t,o,i,r){var a=document.createElement("link");a.rel="stylesheet",a.type="text/css",n.nc&&(a.nonce=n.nc);var s=function(n){if(a.onerror=a.onload=null,"load"===n.type)i();else{var o=n&&n.type,s=n&&n.target&&n.target.href||t,c=new Error("Loading CSS chunk "+e+" failed.\n("+o+": "+s+")");c.name="ChunkLoadError",c.code="CSS_CHUNK_LOAD_FAILED",c.type=o,c.request=s,a.parentNode&&a.parentNode.removeChild(a),r(c)}};return a.onerror=a.onload=s,a.href=t,o?o.parentNode.insertBefore(a,o.nextSibling):document.head.appendChild(a),a},t=function(e,t){for(var n=document.getElementsByTagName("link"),o=0;o<n.length;o++){var i=n[o],r=i.getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(r===e||r===t))return i}var a=document.getElementsByTagName("style");for(o=0;o<a.length;o++){i=a[o],r=i.getAttribute("data-href");if(r===e||r===t)return i}},o=function(o){return new Promise((function(i,r){var a=n.miniCssF(o),s=n.p+a;if(t(a,s))return i();e(o,s,null,i,r)}))},i={524:0};n.f.miniCss=function(e,t){var n={198:1,547:1,768:1};i[e]?t.push(i[e]):0!==i[e]&&n[e]&&t.push(i[e]=o(e).then((function(){i[e]=0}),(function(t){throw delete i[e],t})))}}}(),function(){var e={524:0};n.f.j=function(t,o){var i=n.o(e,t)?e[t]:void 0;if(0!==i)if(i)o.push(i[2]);else{var r=new Promise((function(n,o){i=e[t]=[n,o]}));o.push(i[2]=r);var a=n.p+n.u(t),s=new Error,c=function(o){if(n.o(e,t)&&(i=e[t],0!==i&&(e[t]=void 0),i)){var r=o&&("load"===o.type?"missing":o.type),a=o&&o.target&&o.target.src;s.message="Loading chunk "+t+" failed.\n("+r+": "+a+")",s.name="ChunkLoadError",s.type=r,s.request=a,i[1](s)}};n.l(a,c,"chunk-"+t,t)}},n.O.j=function(t){return 0===e[t]};var t=function(t,o){var i,r,a=o[0],s=o[1],c=o[2],l=0;if(a.some((function(t){return 0!==e[t]}))){for(i in s)n.o(s,i)&&(n.m[i]=s[i]);if(c)var u=c(n)}for(t&&t(o);l<a.length;l++)r=a[l],n.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return n.O(u)},o=self["webpackChunkinternal_services"]=self["webpackChunkinternal_services"]||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var o=n.O(void 0,[504],(function(){return n(99877)}));o=n.O(o)})();
//# sourceMappingURL=app.bf949119.js.map