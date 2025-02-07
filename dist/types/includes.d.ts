import { Ref, VNodeRef } from 'vue';
declare const chartJsEventNames: string[];
interface EventObject {
    type: string;
    chartRef?: Ref<VNodeRef | null>;
    preventDefault: () => void;
    isDefaultPrevented: () => boolean;
    _defaultPrevented: boolean;
}
declare function generateEventObject(type: string, chartRef?: Ref<VNodeRef | null>): EventObject;
declare function generateChartJsEventListener(emit: (event: string, ...args: any[]) => void, event: EventObject): {
    [x: string]: () => boolean;
};
export { chartJsEventNames, generateEventObject, generateChartJsEventListener, };
//# sourceMappingURL=includes.d.ts.map