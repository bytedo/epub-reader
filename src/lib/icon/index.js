/**
  *
  * @authors yutent (yutent.io@gmail.com)
  * @date    2021-02-05 16:32:07
  * @version v1.0.3
  * 
  */

import SVG_DICT from"./svg.js";let dict=SVG_DICT;window.EXT_SVG_DICT&&Object.assign(dict,EXT_SVG_DICT);export default class Icon extends HTMLElement{static get observedAttributes(){return["is"]}props={is:""};constructor(){super(),Object.defineProperty(this,"root",{value:this.attachShadow({mode:"open"}),writable:!0,enumerable:!1,configurable:!0}),this.root.innerHTML='<style>*{box-sizing:border-box;margin:0;padding:0}::before,::after{box-sizing:border-box}:host{display:inline-flex;width:var(--size, 32px);height:var(--size, 32px);color:inherit}:host(:not([is])){display:none}.icon{display:block;fill:currentColor}.icon.load{animation:load 1.5s linear infinite}.icon circle{stroke:currentColor;animation:circle 1.5s ease-in-out infinite}:host([size=large]){width:52px;height:52px}:host([size=medium]){width:36px;height:36px}:host([size=mini]){width:26px;height:26px}:host([red]){color:var(--color-red-1)}:host([blue]){color:var(--color-blue-1)}:host([green]){color:var(--color-green-1)}:host([orange]){color:var(--color-orange-1)}:host([grey]){color:var(--color-grey-1)}:host([dark]){color:var(--color-dark-1)}@keyframes circle{0%{stroke-dasharray:0,3812px;stroke-dashoffset:0}50%{stroke-dasharray:1906px,3812px;stroke-dashoffset:-287px}100%{stroke-dasharray:1906px,3812px;stroke-dashoffset:-2393px}}@keyframes load{to{transform:rotate(360deg)}}</style> <svg class="icon" viewBox="0 0 1024 1024"></svg> ',this.__ICO__=this.root.lastElementChild,this.drawPath()}get is(){return this.props.is}set is(t){t&&this.setAttribute("is",t)}drawPath(){var{is:t}=this.props,o=dict[t];this.__ICO__&&t&&o&&(this.__ICO__.innerHTML="loading"===t?o:`<path d="${o}" />`,this.__ICO__.classList.toggle("load","loading"===t))}attributeChangedCallback(t,o,e){if(o!==e)switch(t){case"is":this.props.is=e,e?this.drawPath():this.removeAttribute("is")}}}

if(!customElements.get('wc-icon')){
  customElements.define('wc-icon', Icon)
}
