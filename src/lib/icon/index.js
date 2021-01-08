/**
  *
  * @authors yutent (yutent.io@gmail.com)
  * @date    2020-12-23 15:31:02
  * @version v1.0.0
  * 
  */

import SVG_DICT from"./svg.js";let dict=SVG_DICT;window.EXT_SVG_DICT&&Object.assign(dict,EXT_SVG_DICT);export default class Icon extends HTMLElement{static get observedAttributes(){return["is"]}props={is:""};constructor(){super(),Object.defineProperty(this,"root",{value:this.attachShadow({mode:"open"}),writable:!0,enumerable:!1,configurable:!0}),this.root.innerHTML="<style>*{box-sizing:border-box;margin:0;padding:0}::before,::after{box-sizing:border-box}:host{--color-teal-1: #4db6ac;--color-teal-2: #26a69a;--color-teal-3: #009688;--color-green-1: #81c784;--color-green-2: #66bb6a;--color-green-3: #4caf50;--color-purple-1: #9575cd;--color-purple-2: #9575cd;--color-purple-3: #673ab7;--color-blue-1: #64b5f6;--color-blue-2: #42a5f5;--color-blue-3: #2196f3;--color-red-1: #ff5061;--color-red-2: #eb3b48;--color-red-3: #ce3742;--color-orange-1: #ffb618;--color-orange-2: #f39c12;--color-orange-3: #e67e22;--color-plain-1: #f2f5fc;--color-plain-2: #e8ebf4;--color-plain-3: #dae1e9;--color-grey-1: #bdbdbd;--color-grey-2: #9e9e9e;--color-grey-3: #757575;--color-dark-1: #62778d;--color-dark-2: #526273;--color-dark-3: #425064}:host{display:inline-block;color:inherit}:host(:not([is])){display:none}.icon{display:block;width:var(--size, 32px);height:var(--size, 32px);margin:var(--pad, auto);fill:currentColor}.icon.load{animation:load 1.5s linear infinite}.icon circle{stroke:currentColor;animation:circle 1.5s ease-in-out infinite}:host([size='large']) .icon{width:42px;height:42px}:host([size='medium']) .icon{width:38px;height:38px}:host([size='mini']) .icon{width:20px;height:20px}:host([color='red']){color:var(--color-red-1)}:host([color='blue']){color:var(--color-blue-1)}:host([color='green']){color:var(--color-green-1)}:host([color='teal']){color:var(--color-teal-1)}:host([color='orange']){color:var(--color-orange-1)}:host([color='dark']){color:var(--color-dark-1)}:host([color='purple']){color:var(--color-purple-1)}:host([color='grey']){color:var(--color-grey-1)}@keyframes circle{0%{stroke-dasharray:0, 3812px;stroke-dashoffset:0}50%{stroke-dasharray:1906px, 3812px;stroke-dashoffset:-287px}100%{stroke-dasharray:1906px, 3812px;stroke-dashoffset:-2393px}}@keyframes load{to{transform:rotate(360deg)}}</style> <svg class=\"icon\" viewBox=\"0 0 1024 1024\"></svg> ",this.__ICO__=this.root.lastElementChild,this.drawPath()}get is(){return this.props.is}set is(o){o&&this.setAttribute("is",o)}drawPath(){var{is:o}=this.props,r=dict[o];this.__ICO__&&o&&r&&(this.__ICO__.innerHTML="loading"===o?r:`<path d="${r}" />`,this.__ICO__.classList.toggle("load","loading"===o))}attributeChangedCallback(o,r,e){if(null!==e&&r!==e)switch(o){case"is":this.props.is=e,e?this.drawPath():this.removeAttribute("is")}}}

if(!customElements.get('wc-icon')){
  customElements.define('wc-icon', Icon)
}
