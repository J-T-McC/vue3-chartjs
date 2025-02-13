import { Ref, VNodeRef, EmitFn } from 'vue';
declare const chartJsEventNames: string[];
interface EventObject {
    type: string;
    chartRef?: Ref<VNodeRef | null>;
    preventDefault: () => void;
    isDefaultPrevented: () => boolean;
    _defaultPrevented: boolean;
}
declare function generateEventObject(type: string, chartRef?: Ref<VNodeRef | null>): EventObject;
declare function generateChartJsEventListener(emit: EmitFn, event: EventObject): {
    [x: string]: () => boolean;
};
export { chartJsEventNames, generateEventObject, generateChartJsEventListener, };
//# sourceMappingURL=includes.d.ts.map