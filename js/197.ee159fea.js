"use strict";(self["webpackChunkinternal_services"]=self["webpackChunkinternal_services"]||[]).push([[197],{66951:function(e,a,s){s.d(a,{A:function(){return d}});var n=s(56768);const l={class:"loader_wrap"},t=(0,n.Lk)("div",{class:"loader"},[(0,n.Lk)("span")],-1),c=[t];function u(e,a){return(0,n.uX)(),(0,n.CE)("div",l,c)}var i=s(71241);const o={},r=(0,i.A)(o,[["render",u]]);var d=r},2416:function(e,a,s){s.r(a),s.d(a,{default:function(){return ue}});s(44114);var n=s(56768),l=s(24232),t=s(45130),c=s.p+"img/ibs_title_sep.4b249ece.svg",u=s(24113),i=s(90144),o=s(50762),r=s(36585),d=s(66951),v=s(38326),m=s(61981);const k=u+"#ic_arr_ver",p=u+"#ic_check",_={class:"logo"},C=["src"],L={class:"name"},f=(0,n.Lk)("svg",{class:"arr"},[(0,n.Lk)("use",{"xlink:href":k})],-1),b={class:"mini_modal"},h={class:"scroll"},g=["onClick"],y={class:"logo"},E=["src"],X={class:"name"},K=(0,n.Lk)("svg",{class:"icon"},[(0,n.Lk)("use",{"xlink:href":p})],-1);var w={__name:"ChooseNetwork",props:["commands"],setup(e){const a=e,s=(0,o.o)(),c=(0,n.WQ)("emitter"),u=(0,i.KR)([]),d=(0,i.KR)({}),k=(0,i.KR)(!1),p=(0,i.KR)(null);function w(e){d.value=u.value[e],k.value=!1,c.emit("updateCurrentNetwork",{chainId:u.value[e].chain_id})}return(0,n.KC)((()=>{a.commands.forEach((e=>{let a=e.split("/"),n=[a[0],a[1]],l=null;n.forEach((e=>{l="space-pussy"===e?s.networks.ibs.space_pussy:r.Bt.find((a=>a.chain_id===e)),u.value.find((e=>e.chain_id===l.chain_id))||u.value.push(l)}))})),w(0)})),(0,v.X2F)(p,(e=>k.value=!1)),(e,a)=>((0,n.uX)(),(0,n.CE)("div",{class:"choose_network",ref_key:"target",ref:p},[(0,n.Lk)("button",{class:"btn",onClick:a[0]||(a[0]=(0,t.D$)((e=>k.value=!k.value),["prevent"]))},[(0,n.Lk)("div",_,[(0,n.Lk)("img",{src:(0,i.R1)(m.oB)(d.value.chain_id),alt:""},null,8,C)]),(0,n.Lk)("div",null,[(0,n.Lk)("div",L,(0,l.v_)(d.value.pretty_name),1)]),f]),(0,n.bo)((0,n.Lk)("div",b,[(0,n.Lk)("div",h,[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(u.value,((e,a)=>((0,n.uX)(),(0,n.CE)("div",{key:a},[(0,n.Lk)("button",{class:(0,l.C4)(["network",{active:d.value.chain_id==e.chain_id}]),onClick:(0,t.D$)((e=>w(a)),["prevent"])},[(0,n.Lk)("div",y,[(0,n.Lk)("img",{src:(0,i.R1)(m.oB)(e.chain_id),alt:"",loading:"lazy"},null,8,E)]),(0,n.Lk)("div",null,[(0,n.Lk)("div",X,(0,l.v_)(e.pretty_name),1)]),K],10,g)])))),128))])],512),[[t.aG,k.value]])],512))}};const I=w;var R=I;const $=e=>((0,n.Qi)("data-v-e7db6448"),e=e(),(0,n.jt)(),e),N={class:"modal",id:"manage_modal"},B={class:"modal_content"},F={class:"data"},Q={class:"modal_title"},x={key:0,class:"list"},A={key:1,class:"processing"},S=$((()=>(0,n.Lk)("div",{class:"overlay"},null,-1)));var D={__name:"AnswersModal",setup(e){const a=(0,o.o)(),s=(0,n.WQ)("emitter"),c=(0,i.KR)(!0),u=(0,i.KR)([]);return(0,n.KC)((async()=>{u.value=[],a.socket.onmessage=e=>{u.value.push(JSON.parse(e.data)),"FINISHED"===JSON.parse(e.data)&&(c.value=!1)}})),(e,a)=>((0,n.uX)(),(0,n.CE)("section",N,[(0,n.Lk)("div",B,[(0,n.Lk)("div",F,[(0,n.Lk)("div",Q,(0,l.v_)(e.$t("message.ibs_modal_title")),1),u.value.length?((0,n.uX)(),(0,n.CE)("pre",x,[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(u.value,((e,a)=>((0,n.uX)(),(0,n.CE)("div",{key:a},(0,l.v_)(e),1)))),128))])):(0,n.Q3)("",!0),c.value?((0,n.uX)(),(0,n.CE)("div",A,(0,l.v_)(e.$t("message.ibs_modal_processing")),1)):((0,n.uX)(),(0,n.CE)("button",{key:2,class:"btn",onClick:a[0]||(a[0]=(0,t.D$)((e=>(0,i.R1)(s).emit("closeIBSAnswersModal")),["self"]))},(0,l.v_)(e.$t("message.btn_close")),1))])]),S]))}},W=s(71241);const M=(0,W.A)(D,[["__scopeId","data-v-e7db6448"]]);var j=M,G=s(94348);const J=e=>((0,n.Qi)("data-v-6bb464f2"),e=e(),(0,n.jt)(),e),O=u+"#ic_trash",U=u+"#ic_update",V={class:"page_head"},z={class:"data"},H={class:"row"},q={class:"title"},P=J((()=>(0,n.Lk)("img",{src:c,alt:"",class:"sep"},null,-1))),T={class:"commands"},Y=["onClick"],Z=["onUpdate:modelValue","value","name"],ee={key:0},ae=J((()=>(0,n.Lk)("svg",{class:"icon"},[(0,n.Lk)("use",{"xlink:href":O})],-1))),se={key:1},ne=J((()=>(0,n.Lk)("svg",{class:"icon"},[(0,n.Lk)("use",{"xlink:href":U})],-1))),le=["disabled","onClick"];var te={__name:"IBS",setup(e){const a=(0,o.o)(),s=(0,n.WQ)("emitter"),c=(0,i.KR)(!0),u=(0,i.KR)([]),v=(0,i.KR)(!1),m=(0,i.KR)([]);function k(e){let s=u.value.filter((a=>a.includes(e)));s.forEach((e=>{let s=e.split("/"),n=s[0]+"<=>"+s[1],l=m.value.find((e=>e.title===n));if(void 0==l){let l={},t={};l="space-pussy"===s[0]?a.networks.ibs.space_pussy:r.Bt.find((e=>e.chain_id===s[0])),t="space-pussy"===s[1]?a.networks.ibs.space_pussy:r.Bt.find((e=>e.chain_id===s[1])),G.log(l),G.log(t),m.value.push({title:n,from:l.bech32_prefix,to:t.bech32_prefix,fromName:l.pretty_name,toName:t.pretty_name,currentCommand:"",commands:[{name:s[2],command:e}]})}else l.commands.push({name:s[2],command:e});G.log(m.value)}))}function p(e,a){m.value[e].currentCommand=a}function _(e){v.value=!0,a.socket.send(m.value[e].currentCommand)}return(0,n.KC)((async()=>{u.value=await a.GetIBSCommands(),a.initWebSockets(),c.value=!1})),s.on("updateCurrentNetwork",(({chainId:e})=>{c.value=!0,m.value=[],k(e),c.value=!1})),s.on("closeIBSAnswersModal",(()=>{v.value=!1})),(e,a)=>((0,n.uX)(),(0,n.CE)(n.FK,null,[c.value?((0,n.uX)(),(0,n.Wv)(d.A,{key:0})):((0,n.uX)(),(0,n.CE)(n.FK,{key:1},[(0,n.Lk)("div",V,[(0,n.bF)(R,{commands:u.value},null,8,["commands"])]),(0,n.Lk)("div",z,[(0,n.Lk)("div",H,[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(m.value,((a,s)=>((0,n.uX)(),(0,n.CE)("div",{class:"section",key:s},[(0,n.Lk)("div",q,[(0,n.Lk)("span",null,(0,l.v_)(a.fromName),1),P,(0,n.Lk)("span",null,(0,l.v_)(a.toName),1)]),(0,n.Lk)("div",T,[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(a.commands,((c,u)=>((0,n.uX)(),(0,n.CE)("label",{key:u,onClick:(0,t.D$)((e=>p(s,c.command)),["prevent"])},[(0,n.bo)((0,n.Lk)("input",{type:"radio","onUpdate:modelValue":e=>a.currentCommand=e,value:c.command,name:`relayer${s}`},null,8,Z),[[t.XL,a.currentCommand]]),"clear"===c.name?((0,n.uX)(),(0,n.CE)("div",ee,[ae,(0,n.Lk)("span",null,(0,l.v_)(e.$t("message.btn_clear")),1)])):(0,n.Q3)("",!0),"update"===c.name?((0,n.uX)(),(0,n.CE)("div",se,[ne,(0,n.Lk)("span",null,(0,l.v_)(e.$t("message.btn_update")),1)])):(0,n.Q3)("",!0)],8,Y)))),128))]),(0,n.Lk)("button",{class:"execute_btn",disabled:!a.currentCommand.length,onClick:(0,t.D$)((e=>_(s)),["prevent"])},(0,l.v_)(e.$t("message.btn_execute")),9,le)])))),128))])])],64)),v.value?((0,n.uX)(),(0,n.Wv)(j,{key:2})):(0,n.Q3)("",!0)],64))}};const ce=(0,W.A)(te,[["__scopeId","data-v-6bb464f2"]]);var ue=ce}}]);
//# sourceMappingURL=197.ee159fea.js.map