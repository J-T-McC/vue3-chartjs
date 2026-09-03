import { Chart } from 'chart.js';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { ChartType } from 'chart.js';
import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { Plugin as Plugin_2 } from 'chart.js';
import { PublicProps } from 'vue';
import { Ref } from 'vue';
import { VNodeRef } from 'vue';

declare type __VLS_Props = {
    type: ChartType;
    height?: number;
    width?: number;
    data: ChartData;
    options?: ChartOptions;
    plugins?: Plugin_2[];
    autoUpdate?: boolean;
};

declare interface ChartJSState {
    chart: Chart | null;
    plugins: Plugin_2[];
    props: Readonly<{
        type: ChartType;
        height?: number;
        width?: number;
        data: ChartData;
        options: ChartOptions;
        plugins: Plugin_2[];
    }>;
}

declare const _default: DefineComponent<__VLS_Props, {
chartJSState: ChartJSState;
render: () => void;
destroy: () => void;
update: (mode?: UpdateMode) => void;
resize: () => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
plugins: Plugin_2[];
options: ChartOptions;
autoUpdate: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
chartRef: HTMLCanvasElement;
}, HTMLCanvasElement>;
export default _default;

/** Payload passed to every emitted chart.js event. */
export declare interface EventObject {
    type: string;
    chartRef?: Ref<VNodeRef | null>;
    preventDefault: () => void;
    isDefaultPrevented: () => boolean;
    _defaultPrevented: boolean;
}

/** Transition mode accepted by the exposed update() method. */
export declare type UpdateMode = 'resize' | 'reset' | 'default' | 'none' | 'hide' | 'show' | 'active';

export { }
