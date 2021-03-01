var e=Object.assign;import{defineComponent as t,ref as a,reactive as r,onMounted as d,h as o}from"vue";import n from"chart.js";const s=["beforeInit","afterInit","beforeUpdate","afterUpdate","beforeLayout","afterLayout","beforeDatasetsUpdate","afterDatasetsUpdate","beforeDatasetUpdate","afterDatasetUpdate","beforeRender","afterRender","beforeDraw","afterDraw","beforeDatasetsDraw","afterDatasetsDraw","beforeDatasetDraw","afterDatasetDraw","beforeEvent","afterEvent","resize","destroy"],u=e=>e.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/\s+/g,"-").toLowerCase(),p=s.map((e=>u(e))),c=t({name:"Vue3ChartJs",props:{type:{type:String,required:!0},data:{type:Object,required:!0},options:{type:Object,default:()=>({})},plugins:{type:Array,default:()=>[]}},emits:p,setup(t,{emit:o}){const p=a(null),c=s.reduce(((t,a)=>{const r={[a]:()=>o(u(a),p)};return e(e({},t),r)}),{}),f=r({chart:null,debouncedID:null,plugins:[c,...t.plugins]}),i=()=>{if(f.chart)return f.chart.update();f.chart=new n(p.value.getContext("2d"),{type:t.type,data:t.data,options:t.options,plugins:f.plugins})};return d((()=>i())),{state:f,chartRef:p,render:i,update:()=>f.chart&&f.chart.update(),destroy:()=>f.chart&&f.chart.destroy(),debouncedReload:(e,t)=>{f.debouncedID&&window.clearTimeout(f.debouncedID),f.debouncedID=window.setTimeout((()=>e()),t)}}},watch:{"data.data":{handler:function(){return this.debouncedReload((()=>{this.state.chart.data=this.data,this.update()}),500)},deep:!0}},render:()=>o("canvas",{ref:"chartRef"})});c.install=e=>{e.component(c.name,c)};export default c;
