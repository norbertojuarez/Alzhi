"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[6521],{6521:(y,l,r)=>{r.r(l),r.d(l,{ion_input_password_toggle:()=>n});var i=r(3649),c=r(4929),u=r(333),d=r(3992),p=r(6482);const n=class{constructor(s){(0,i.r)(this,s),this.togglePasswordVisibility=()=>{const{inputElRef:e}=this;e&&(e.type="text"===e.type?"password":"text")},this.color=void 0,this.showIcon=void 0,this.hideIcon=void 0,this.type="password"}onTypeChange(s){"text"===s||"password"===s||(0,c.p)(`ion-input-password-toggle only supports inputs of type "text" or "password". Input of type "${s}" is not compatible.`,this.el)}connectedCallback(){const{el:s}=this,e=this.inputElRef=s.closest("ion-input");e?this.type=e.type:(0,c.p)("No ancestor ion-input found for ion-input-password-toggle. This component must be slotted inside of an ion-input.",s)}disconnectedCallback(){this.inputElRef=null}render(){var s,e;const{color:a,type:P}=this,h=(0,p.b)(this),E=null!==(s=this.showIcon)&&void 0!==s?s:d.x,I=null!==(e=this.hideIcon)&&void 0!==e?e:d.y,g="text"===P;return(0,i.h)(i.f,{key:"ed1c29726ce0c91548f0e2ada61e3f8b5c813d2d",class:(0,u.c)(a,{[h]:!0})},(0,i.h)("ion-button",{key:"9698eccdaedb86cf12d20acc53660371b3af3c55",mode:h,color:a,fill:"clear",shape:"round","aria-checked":g?"true":"false","aria-label":"show password",role:"switch",type:"button",onPointerDown:w=>{w.preventDefault()},onClick:this.togglePasswordVisibility},(0,i.h)("ion-icon",{key:"1f2119c30b56c800d9af44e6499445a0ebb466cf",slot:"icon-only","aria-hidden":"true",icon:g?I:E})))}get el(){return(0,i.i)(this)}static get watchers(){return{type:["onTypeChange"]}}};n.style={ios:"",md:""}},333:(y,l,r)=>{r.d(l,{c:()=>u,g:()=>p,h:()=>c,o:()=>_});var i=r(467);const c=(o,t)=>null!==t.closest(o),u=(o,t)=>"string"==typeof o&&o.length>0?Object.assign({"ion-color":!0,[`ion-color-${o}`]:!0},t):t,p=o=>{const t={};return(o=>void 0!==o?(Array.isArray(o)?o:o.split(" ")).filter(n=>null!=n).map(n=>n.trim()).filter(n=>""!==n):[])(o).forEach(n=>t[n]=!0),t},f=/^[a-z][a-z0-9+\-.]*:/,_=function(){var o=(0,i.A)(function*(t,n,s,e){if(null!=t&&"#"!==t[0]&&!f.test(t)){const a=document.querySelector("ion-router");if(a)return n?.preventDefault(),a.push(t,s,e)}return!1});return function(n,s,e,a){return o.apply(this,arguments)}}()}}]);