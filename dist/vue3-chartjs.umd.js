(function(a,n){typeof exports=="object"&&typeof module!="undefined"?module.exports=n(require("vue"),require("chart.js")):typeof define=="function"&&define.amd?define(["vue","chart.js"],n):(a=typeof globalThis!="undefined"?globalThis:a||self,a.Vue3ChartJs=n(a.Vue,a.Chart))})(this,function(a,n){"use strict";const f=["install","uninstall","beforeInit","resize","afterInit","start","stop","beforeUpdate","beforeLayout","beforeDataLimits","afterDataLimits","beforeBuildTicks","afterBuildTicks","afterLayout","beforeElementsUpdate","beforeDatasetsUpdate","beforeDatasetUpdate","afterDatasetUpdate","afterDatasetsUpdate","afterUpdate","beforeRender","beforeDraw","beforeDatasetsDraw","beforeDatasetDraw","afterDatasetDraw","afterDatasetsDraw","beforeTooltipDraw","afterTooltipDraw","afterDraw","afterRender","resize","reset","beforeDestroy","afterDestroy","beforeEvent","afterEvent"];function d(t,r=null){return{type:t,chartRef:r,preventDefault(){this._defaultPrevented=!0},isDefaultPrevented(){return!this._defaultPrevented},_defaultPrevented:!1}}function l(t,r){return{[r.type]:()=>(t(r.type,r),r.isDefaultPrevented())}}n.registerables!==void 0&&n.Chart.register(...n.registerables);const s=a.defineComponent({name:"Vue3ChartJs",props:{type:{type:String,required:!0},height:{type:Number,required:!1,default:null},width:{type:Number,required:!1,default:null},data:{type:Object,required:!0},options:{type:Object,default:()=>({})},plugins:{type:Array,default:()=>[]}},emits:f,setup(t,{emit:r}){const i=a.ref(null),p=f.reduce((u,g)=>{const D=d(g,i);return{...u,...l(r,D)}},{id:"Vue3ChartJsEventHookPlugin"}),e={chart:null,plugins:[p,...t.plugins],props:{...t}},h=()=>{e.chart&&(e.chart.destroy(),e.chart=null)},c=(u=750)=>{e.chart.data={...e.chart.data,...e.props.data},e.chart.options={...e.chart.options,...e.props.options},e.chart.update(u)},b=()=>e.chart&&e.chart.resize(),o=()=>e.chart?e.chart.update():e.chart=new n.Chart(i.value.getContext("2d"),{type:e.props.type,data:e.props.data,options:e.props.options,plugins:e.plugins});return a.onMounted(()=>o()),{chartJSState:e,chartRef:i,render:o,resize:b,update:c,destroy:h}},render(t){return a.h("canvas",{ref:"chartRef",height:t.height,width:t.width})}});return s.registerGlobalPlugins=t=>{n.Chart.register(...t)},s.install=(t,r={})=>{var i;t.component(s.name,s),(i=r==null?void 0:r.plugins)!=null&&i.length&&s.registerGlobalPlugins(r.plugins)},s});
