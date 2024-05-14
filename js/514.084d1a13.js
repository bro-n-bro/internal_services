"use strict";(self["webpackChunkinternal_services"]=self["webpackChunkinternal_services"]||[]).push([[514],{66951:function(e,a,n){n.d(a,{A:function(){return k}});var t=n(56768);const s={class:"loader_wrap"},c=(0,t.Lk)("div",{class:"loader"},[(0,t.Lk)("span")],-1),i=[c];function l(e,a){return(0,t.uX)(),(0,t.CE)("div",s,i)}var r=n(71241);const o={},u=(0,r.A)(o,[["render",l]]);var k=u},9514:function(e,a,n){n.r(a),n.d(a,{default:function(){return Y}});n(44114);var t=n(56768),s=n(24232),c=n(90144),i=n(45299),l=n(36585),r=n(61981),o=n(66951),u=n(45130),k=n(24113),v=n(38326);const d=k+"#ic_arr_ver",_=k+"#ic_check",h={class:"logo"},p=["src"],L={class:"name"},m={class:"token"},C=(0,t.Lk)("svg",{class:"arr"},[(0,t.Lk)("use",{"xlink:href":d})],-1),w={class:"mini_modal"},f={class:"scroll"},R={class:"logo"},b=["src"],y={class:"name"},E={class:"token"},X=(0,t.Lk)("svg",{class:"icon"},[(0,t.Lk)("use",{"xlink:href":_})],-1);var g={__name:"ChooseNetwork",setup(e){const a=(0,i.o)(),n=(0,c.KR)(!1),l=(0,c.KR)(null);return(0,v.X2F)(l,(e=>n.value=!1)),(e,i)=>{const o=(0,t.g2)("router-link");return(0,t.uX)(),(0,t.CE)("div",{class:"choose_network",ref_key:"target",ref:l},[(0,t.Lk)("button",{class:"btn",onClick:i[0]||(i[0]=(0,u.D$)((e=>n.value=!n.value),["prevent"]))},[(0,t.Lk)("div",h,[(0,t.Lk)("img",{src:(0,c.R1)(r.oB)((0,c.R1)(a).networks.IBC[(0,c.R1)(a).currentNetwork].chainId),alt:""},null,8,p)]),(0,t.Lk)("div",null,[(0,t.Lk)("div",L,(0,s.v_)((0,c.R1)(a).networks.IBC[(0,c.R1)(a).currentNetwork].name),1),(0,t.Lk)("div",m,(0,s.v_)((0,c.R1)(a).networks.IBC[(0,c.R1)(a).currentNetwork].token_name),1)]),C]),(0,t.bo)((0,t.Lk)("div",w,[(0,t.Lk)("div",f,[((0,t.uX)(!0),(0,t.CE)(t.FK,null,(0,t.pI)((0,c.R1)(a).networks.IBC,((e,l)=>((0,t.uX)(),(0,t.CE)("div",{key:l},[(0,t.bF)(o,{class:(0,s.C4)(["network",{active:(0,c.R1)(a).currentNetwork==e.alias}]),to:`/ibc_route/${e.alias}`,onClick:i[1]||(i[1]=e=>n.value=!n.value)},{default:(0,t.k6)((()=>[(0,t.Lk)("div",R,[(0,t.Lk)("img",{src:(0,c.R1)(r.oB)(e.chainId),alt:""},null,8,b)]),(0,t.Lk)("div",null,[(0,t.Lk)("div",y,(0,s.v_)(e.name),1),(0,t.Lk)("div",E,(0,s.v_)(e.token_name),1)]),X])),_:2},1032,["class","to"])])))),128))])],512),[[u.aG,n.value]])],512)}}};const I=g;var N=I;const B=e=>((0,t.Qi)("data-v-01dd3a62"),e=e(),(0,t.jt)(),e),K={class:"page_head"},F={class:"page_title"},$={class:"list"},A={class:"row"},W={class:"amount"},j={class:"denom"},x={class:"path"},J=B((()=>(0,t.Lk)("div",{class:"label"},"Path: ",-1))),Q={class:"val"},D={class:"return_path"},G=B((()=>(0,t.Lk)("div",{class:"title"},"Return path",-1))),O={key:0},P={key:1,class:"row"},q=B((()=>(0,t.Lk)("div",{class:"label"},"Chain name:",-1))),z={class:"val"},H={key:0},M=B((()=>(0,t.Lk)("div",{class:"label"},"Channel status:",-1))),S={class:"val"};var T={__name:"IBCRoute",setup(e){const a=(0,i.o)(),n=(0,c.KR)(!0);function u(){a.balances.forEach((async e=>{if(e.return_path=[],e.denom_traces.path){e.return_path.push({chain_name:a.networks.IBC[a.currentNetwork].name});for(const n of e.denom_traces.path.match(/transfer\/channel-\d+/g)){let t={path:n,channel:n.split("/")[1]};await fetch(`${a.networks.IBC[a.currentNetwork].lcd_api}/ibc/core/channel/v1/channels/${t.channel}/ports/transfer`).then((e=>e.json())).then((e=>{t.connection=e.channel.connection_hops[0],t.status=e.channel.state})),await fetch(`${a.networks.IBC[a.currentNetwork].lcd_api}/ibc/core/connection/v1/connections/${t.connection}/client_state`).then((e=>e.json())).then((e=>t.chain_id=e.identified_client_state.client_state.chain_id));let s=l.Bt.find((e=>e.chain_id===t.chain_id));t.chain_name=s?s.pretty_name:"Not definitely",e.return_path.push(t)}}}))}return(0,t.KC)((async()=>{a.isKeplrConnected||await a.initApp(),await u(),n.value=!1})),(0,t.wB)((0,t.EW)((()=>a.currentNetwork)),(async()=>{n.value=!0,await a.initApp(),await u(),n.value=!1})),(e,i)=>n.value?((0,t.uX)(),(0,t.Wv)(o.A,{key:0})):((0,t.uX)(),(0,t.CE)(t.FK,{key:1},[(0,t.Lk)("div",K,[(0,t.Lk)("div",F,(0,s.v_)(e.$t("message.ibc_route_page_title")),1),(0,t.bF)(N)]),(0,t.Lk)("div",$,[((0,t.uX)(!0),(0,t.CE)(t.FK,null,(0,t.pI)((0,c.R1)(a).balances,((a,n)=>((0,t.uX)(),(0,t.CE)("div",{class:"item",key:n},[(0,t.Lk)("div",A,[(0,t.Lk)("div",W,[(0,c.R1)(r.NJ)(a.amount,a.base_denom)<.01?((0,t.uX)(),(0,t.CE)(t.FK,{key:0},[(0,t.eW)(" < 0.01 ")],64)):((0,t.uX)(),(0,t.CE)(t.FK,{key:1},[(0,t.eW)((0,s.v_)(e.$filters.toFixed((0,c.R1)(r.NJ)(a.amount,a.base_denom),2)),1)],64))]),(0,t.Lk)("div",j,(0,s.v_)((0,c.R1)(r.mO)(a.denom)),1)]),(0,t.Lk)("div",x,[J,(0,t.Lk)("div",Q,(0,s.v_)(a.denom_traces.path),1)]),(0,t.Lk)("div",D,[G,a.return_path.length?((0,t.uX)(),(0,t.CE)("div",P,[((0,t.uX)(!0),(0,t.CE)(t.FK,null,(0,t.pI)(a.return_path,((e,a)=>((0,t.uX)(),(0,t.CE)("div",{key:a},[(0,t.Lk)("div",null,[q,(0,t.Lk)("div",z,(0,s.v_)(e.chain_name),1)]),e.status?((0,t.uX)(),(0,t.CE)("div",H,[M,(0,t.Lk)("div",S,(0,s.v_)(e.status),1)])):(0,t.Q3)("",!0)])))),128))])):((0,t.uX)(),(0,t.CE)("div",O," No need, it's a native token. "))])])))),128))])],64))}},U=n(71241);const V=(0,U.A)(T,[["__scopeId","data-v-01dd3a62"]]);var Y=V}}]);
//# sourceMappingURL=514.084d1a13.js.map