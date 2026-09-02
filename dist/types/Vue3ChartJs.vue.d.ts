import { Chart, Plugin, ChartType, ChartData, ChartOptions } from 'chart.js';
type UpdateMode = 'resize' | 'reset' | 'default' | 'none' | 'hide' | 'show' | 'active';
type __VLS_Props = {
    type: ChartType;
    height?: number;
    width?: number;
    data: ChartData;
    options?: ChartOptions;
    plugins?: Plugin[];
};
interface ChartJSState {
    chart: Chart | null;
    plugins: Plugin[];
    props: Readonly<{
        type: ChartType;
        height?: number;
        width?: number;
        data: ChartData;
        options: ChartOptions;
        plugins: Plugin[];
    }>;
}
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    chartJSState: ChartJSState;
    render: () => void;
    destroy: () => void;
    update: (mode?: UpdateMode) => void;
    resize: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    plugins: Plugin[];
    options: ChartOptions;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=Vue3ChartJs.vue.d.ts.map