"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[4357],{4357:(M,p,s)=>{s.r(p),s.d(p,{ResetpassPageModule:()=>C});var u=s(177),l=s(4341),n=s(5150),a=s(4964),d=s(467),t=s(4438),m=s(4605);const h=[{path:"",component:(()=>{class e{constructor(i,o,r){this.userService=i,this.router=o,this.toastController=r,this.email=""}ngOnInit(){}onReset(){var i=this;return(0,d.A)(function*(){try{yield i.userService.resetPassword(i.email),yield(yield i.toastController.create({message:"Se ha enviado un correo electr\xf3nico con instrucciones para restablecer tu contrase\xf1a",duration:3e3,position:"bottom",color:"success"})).present(),i.router.navigate(["/login"])}catch(o){console.error(o.code,o.message),yield(yield i.toastController.create({message:"Ingrese un correo electr\xf3nico registrado v\xe1lido",duration:3e3,position:"bottom",color:"light"})).present()}})()}static#t=this.\u0275fac=function(o){return new(o||e)(t.rXU(m.D),t.rXU(a.Ix),t.rXU(n.K_))};static#n=this.\u0275cmp=t.VBU({type:e,selectors:[["app-resetpass"]],decls:20,vars:1,consts:[["name","aperture-outline","slot","start"],["routerLink","/login","name","chevron-back-outline","slot","end",1,"back"],[1,"formulario"],[1,"ion-justify-content-center"],["type","email","placeholder","Correo",1,"form-control",3,"ngModelChange","ngModel"],["name","mail-outline","slot","end"],[1,"buttons",3,"click"]],template:function(o,r){1&o&&(t.j41(0,"ion-header")(1,"ion-toolbar"),t.nrm(2,"ion-icon",0),t.j41(3,"ion-title"),t.EFF(4,"Alzhi"),t.k0s(),t.nrm(5,"ion-icon",1),t.k0s()(),t.j41(6,"ion-content")(7,"div",2)(8,"ion-row",3)(9,"ion-text"),t.EFF(10,"Restaurar contrase\xf1a"),t.k0s()(),t.j41(11,"ion-item")(12,"ion-input",4),t.mxI("ngModelChange",function(c){return t.DH7(r.email,c)||(r.email=c),c}),t.k0s(),t.nrm(13,"ion-icon",5),t.k0s(),t.j41(14,"ion-row",3)(15,"p"),t.EFF(16,"Ingresa tu mail"),t.k0s()(),t.j41(17,"ion-row",3)(18,"ion-button",6),t.bIt("click",function(){return r.onReset()}),t.EFF(19,"Enviar"),t.k0s()()()()),2&o&&(t.R7$(12),t.R50("ngModel",r.email))},dependencies:[l.BC,l.vS,n.Jm,n.W9,n.eU,n.iq,n.$w,n.uz,n.ln,n.IO,n.BC,n.ai,n.Gw,n.N7,a.Wk],styles:["*[_ngcontent-%COMP%]{font-size:20px}ion-content[_ngcontent-%COMP%]{--background: none;background-image:url(fondo.fecaf9393e3e620e.png);background-position:center center;background-repeat:no-repeat;background-size:cover}ion-title[_ngcontent-%COMP%]{font-size:22px;padding:0;margin:5px}ion-text[_ngcontent-%COMP%]{font-size:24px;margin-bottom:30px}ion-item[_ngcontent-%COMP%], ion-input[_ngcontent-%COMP%]{align-items:last baseline;padding:10px}ion-icon[_ngcontent-%COMP%]{font-size:30px;color:#000100}.formulario[_ngcontent-%COMP%]{padding-top:40px;padding-left:15px;padding-right:15px}.buttons[_ngcontent-%COMP%]{--background: #F2D8B3;--border-radius: 20px;font-size:16px;width:100%;height:50px;margin-top:15px}.buttons[_ngcontent-%COMP%]:hover, .buttons[_ngcontent-%COMP%]:active{--background: #E0B193}a[_ngcontent-%COMP%]{color:#000100;text-decoration:none}p[_ngcontent-%COMP%]{font-size:18px;margin-top:0;margin-bottom:25px}.back[_ngcontent-%COMP%]{padding-right:15px;font-size:35px}.back[_ngcontent-%COMP%]:hover, .back[_ngcontent-%COMP%]:active{color:var(--ion-color-primary)}"]})}return e})()}];let f=(()=>{class e{static#t=this.\u0275fac=function(o){return new(o||e)};static#n=this.\u0275mod=t.$C({type:e});static#e=this.\u0275inj=t.G2t({imports:[a.iI.forChild(h),a.iI]})}return e})(),C=(()=>{class e{static#t=this.\u0275fac=function(o){return new(o||e)};static#n=this.\u0275mod=t.$C({type:e});static#e=this.\u0275inj=t.G2t({imports:[u.MD,l.YN,n.bv,f]})}return e})()}}]);