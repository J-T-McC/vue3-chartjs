import { AnyObject } from 'chart.js/dist/types/basic';
import { Chart } from 'chart.js';
import { ChartData } from 'chart.js/dist/types';
import { ChartOptions } from 'chart.js/dist/types';
import { ChartType } from 'chart.js/dist/types';
import { ChartTypeRegistry } from 'chart.js';
import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { CoreChartOptions } from 'chart.js';
import { DatasetChartOptions } from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { DefineComponent } from 'vue';
import { ElementChartOptions } from 'chart.js';
import { Plugin as Plugin_2 } from 'chart.js';
import { PluginChartOptions } from 'chart.js';
import { PublicProps } from 'vue';
import { ScaleChartOptions } from 'chart.js';

declare type __VLS_Props = {
    type: ChartType;
    height?: number;
    width?: number;
    data: ChartData;
    options?: ChartOptions;
    plugins?: Plugin_2[];
};

declare const _default: DefineComponent<__VLS_Props, {
chartJSState: {
chart: Chart | null;
plugins: Plugin_2<keyof ChartTypeRegistry, AnyObject>[];
props: {
type: ChartType;
height: number;
width: number;
data: ChartData;
options: _DeepPartialObject<CoreChartOptions<keyof ChartTypeRegistry> & ElementChartOptions<keyof ChartTypeRegistry> & PluginChartOptions<keyof ChartTypeRegistry> & DatasetChartOptions<keyof ChartTypeRegistry> & ScaleChartOptions<keyof ChartTypeRegistry>>;
plugins: Plugin_2<keyof ChartTypeRegistry, AnyObject>[];
};
};
render: () => void;
destroy: () => void;
update: (mode?: UpdateMode) => void;
resize: () => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
plugins: Plugin_2[];
options: ChartOptions;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
chartRef: HTMLCanvasElement;
}, HTMLCanvasElement>;
export default _default;

declare type UpdateMode = 'resize' | 'reset' | 'default' | 'none' | 'hide' | 'show' | 'active';

export { }
