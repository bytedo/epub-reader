/**
  *
  * @authors yutent (yutent.io@gmail.com)
  * @date    2020-12-23 15:31:02
  * @version v1.0.0
  * 
  */

import"../scroll/index.js";import"../layer/index.js";import $ from"../utils.js";export default class Code extends HTMLElement{static get observedAttributes(){return["dark","lang"]}props={dark:"",lang:""};constructor(){super(),Object.defineProperty(this,"root",{value:this.attachShadow({mode:"open"}),writable:!0,enumerable:!1,configurable:!0}),this.root.innerHTML='<style>*{box-sizing:border-box;margin:0;padding:0}::before,::after{box-sizing:border-box}:host{--color-teal-1: #4db6ac;--color-teal-2: #26a69a;--color-teal-3: #009688;--color-green-1: #81c784;--color-green-2: #66bb6a;--color-green-3: #4caf50;--color-purple-1: #9575cd;--color-purple-2: #9575cd;--color-purple-3: #673ab7;--color-blue-1: #64b5f6;--color-blue-2: #42a5f5;--color-blue-3: #2196f3;--color-red-1: #ff5061;--color-red-2: #eb3b48;--color-red-3: #ce3742;--color-orange-1: #ffb618;--color-orange-2: #f39c12;--color-orange-3: #e67e22;--color-plain-1: #f2f5fc;--color-plain-2: #e8ebf4;--color-plain-3: #dae1e9;--color-grey-1: #bdbdbd;--color-grey-2: #9e9e9e;--color-grey-3: #757575;--color-dark-1: #62778d;--color-dark-2: #526273;--color-dark-3: #425064}:host{display:flex}.code-box{display:flex;flex-direction:column;position:relative;width:100%;max-height:610px;margin:10px 0;border:1px solid var(--color-plain-2);border-radius:2px}.code-box .title{display:flex;justify-content:space-between;align-items:center;width:100%;height:24px;padding:0 12px;line-height:1;font-size:12px;background:var(--color-plain-2);user-select:none}.code-box .title i{display:inline-block;width:10px;height:10px;margin-right:6px;border-radius:50%;background:var(--color-red-1)}.code-box .title i:nth-child(2){background:var(--color-orange-1)}.code-box .title i:nth-child(3){background:var(--color-green-1)}.code-box .title .act{--size: 16px;margin:0 2px;color:var(--color-grey-2);cursor:pointer}.code-box .title .act:hover{color:var(--color-grey-3)}.code-box .title .act.run{display:none}.code-box .code{flex:1;padding:5px 0;line-height:18px;font-family:Menlo, Monaco, Consolas, \'Courier New\', monospace;font-size:13px;background:linear-gradient(to right, var(--color-plain-1) 40px, #fff 40px);color:var(--color-dark-1);cursor:text;counter-reset:code}.code-box .code p{display:flex;position:relative;min-height:18px;padding:0 8px 0 45px;white-space:pre-wrap;word-wrap:break-word}.code-box .code p::before{position:absolute;left:0;width:40px;height:100%;padding-right:5px;text-align:right;color:var(--color-grey-1);content:counter(code);counter-increment:code}:host([exec]) .title .run{display:inline-block}:host([dark]) .code-box{border-color:var(--color-dark-2)}:host([dark]) .code-box .title{background:var(--color-dark-2)}:host([dark]) .code-box .code{background:linear-gradient(to right, #596b7f 40px, var(--color-dark-1) 40px);color:var(--color-plain-3)}:host([dark]) .code-box .code p::before{color:var(--color-grey-3)}</style> <div class="code-box"> <header class="title"> <span><i></i><i></i><i></i></span> <span></span> <span> <wc-icon title="运行" class="act run" is="live"></wc-icon> <wc-icon title="复制" class="act cp" is="doc"></wc-icon> </span> </header> <wc-scroll axis="y" class="code"></wc-scroll> </div> ';var e=this.root.children[1],o=e.children[0];this.__CODE__=e.children[1],this.__LANG__=o.children[1],this.__RUN__=o.children[2].firstElementChild,this.__CP__=o.children[2].lastElementChild}get value(){return this.props.content}set value(e){this.props.content=e.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">"),e=(e=e.replace(/</g,"&lt;").replace(/>/g,"&gt;").split("\n")).map(e=>`<p>${e}</p>`).join(""),this.__CODE__.innerHTML=e}connectedCallback(){var e=this.innerHTML||this.textContent;this.value=e.replace(/^[\r\n]|\s{2,}$/g,""),this.textContent="",this._cpFN=$.bind(this.__CP__,"click",e=>{try{navigator.clipboard.writeText(this.value),layer.toast("复制到粘贴板成功","success")}catch(e){layer.toast("复制到粘贴板失败","error")}}),this._runFN=$.bind(this.__RUN__,"click",e=>{this.dispatchEvent(new CustomEvent("run",{detail:this.value}))})}unmounted(){$.unbind(this.__CP__,"click",this._cpFN),$.unbind(this.__RUN__,"click",this._runFN)}attributeChangedCallback(e,o,r){if(null!==r&&o!==r)switch(e){case"lang":this.props.lang=r.toLowerCase(),this.__LANG__.textContent=this.props.lang;break;case"value":this.value=r,this.removeAttribute("value")}}}

if(!customElements.get('wc-code')){
  customElements.define('wc-code', Code)
}
