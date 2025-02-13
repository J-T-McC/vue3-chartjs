import { Chart, Plugin } from 'chart.js';
import { ChartType, ChartData, ChartOptions } from 'chart.js/dist/types';
type UpdateMode = 'resize' | 'reset' | 'default' | 'none' | 'hide' | 'show' | 'active';
type __VLS_Props = {
    type: ChartType;
    height?: number;
    width?: number;
    data: ChartData;
    options?: ChartOptions;
    plugins?: Plugin[];
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    chartJSState: {
        chart: Chart | null;
        plugins: Plugin<keyof import("chart.js").ChartTypeRegistry, import("chart.js/dist/types/basic").AnyObject>[];
        props: {
            type: ChartType;
            height: number;
            width: number;
            data: ChartData;
            options: import("chart.js/dist/types/utils")._DeepPartialObject<import("chart.js").CoreChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ElementChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").PluginChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").DatasetChartOptions<keyof import("chart.js").ChartTypeRegistry> & import("chart.js").ScaleChartOptions<keyof import("chart.js").ChartTypeRegistry>>;
            plugins: Plugin<keyof import("chart.js").ChartTypeRegistry, import("chart.js/dist/types/basic").AnyObject>[];
        };
    };
    render: () => void;
    destroy: () => void;
    update: (mode?: UpdateMode) => void;
    resize: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    plugins: Plugin[];
    options: ChartOptions;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {
    chartRef: HTMLCanvasElement;
}, HTMLCanvasElement>;
export default _default;
//# sourceMappingURL=Vue3ChartJs.vue.d.ts.map