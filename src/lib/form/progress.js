/**
  *
  * @authors yutent (yutent.io@gmail.com)
  * @date    2021-02-05 16:32:07
  * @version v1.0.3
  * 
  */

export default class Progress extends HTMLElement{static get observedAttributes(){return["value","max"]}props={value:0,max:1};constructor(){super(),Object.defineProperty(this,"root",{value:this.attachShadow({mode:"open"}),writable:!0,enumerable:!1,configurable:!0}),this.root.innerHTML="<style>*{box-sizing:border-box;margin:0;padding:0}::before,::after{box-sizing:border-box}:host{display:flex;align-items:center}:host label{flex:1;height:var(--size, 10px);border-radius:9px;background:var(--color-plain-2)}:host label span{display:block;width:0;height:100%;border-radius:9px;background:var(--color-teal-1)}:host([size=large]) label{height:18px}:host([size=medium]) label{height:14px}:host([size=mini]) label{height:6px}:host([type=danger]) label span{background:var(--color-red-1)}:host([type=info]) label span{background:var(--color-blue-1)}:host([type=success]) label span{background:var(--color-green-1)}:host([type=warning]) label span{background:var(--color-orange-1)}:host([type=inverse]) label span{background:var(--color-dark-1)}:host([color=purple]) label span{background:var(--color-purple-1)}</style> <label><span></span></label> ",this.__THUMB__=this.root.children[1].lastElementChild}get value(){return this.props.value}set value(e){this.props.value=+e,this.calculate()}calculate(){var{max:e,value:a}=this.props;this.__THUMB__.style.width=100*a/e+"%"}connectedCallback(){this.calculate()}attributeChangedCallback(e,a,l){if(a!==l)switch(e){case"max":var r=+l;(r!=r||r<1)&&(r=1),this.props.max=r,this.calculate();break;case"value":var t=+l;t==t&&(this.props.value=t,this.calculate())}}}

if(!customElements.get('wc-progress')){
  customElements.define('wc-progress', Progress)
}
