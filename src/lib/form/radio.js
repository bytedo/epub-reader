/**
  *
  * @authors yutent (yutent.io@gmail.com)
  * @date    2021-02-05 16:32:07
  * @version v1.0.3
  * 
  */

import $ from"../utils.js";import"./radio-item.js";export default class Radio extends HTMLElement{static get observedAttributes(){return["value"]}props={value:null};constructor(){super(),Object.defineProperty(this,"root",{value:this.attachShadow({mode:"open"}),writable:!0,enumerable:!1,configurable:!0}),this.root.innerHTML="<style>*{box-sizing:border-box;margin:0;padding:0}::before,::after{box-sizing:border-box}:host{display:inline-flex}</style> <slot /> "}_updateChildrenStat(){Array.from(this.children).forEach(e=>{"WC-RADIO-ITEM"===e.tagName&&e.root&&(e.value===this.props.value?e.checked=!0:e.checked=!1)})}get value(){return this.props.value}set value(e){e!==this.props.value&&(this.props.value=e,this._updateChildrenStat())}connectedCallback(){this._pickedFn=$.bind(this,"child-picked",e=>{log("radio picked: ",e.detail),this.value=e.detail,this.dispatchEvent(new CustomEvent("input"))})}disconnectedCallback(){$.unbind(this,"child-picked",this._pickedFn)}attributeChangedCallback(e,t,i){if(t!==i)switch(e){case"value":this.value=i}}}

if(!customElements.get('wc-radio')){
  customElements.define('wc-radio', Radio)
}
