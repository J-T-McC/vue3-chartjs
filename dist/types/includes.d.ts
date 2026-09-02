import { Ref, VNodeRef, EmitFn } from 'vue';
declare const chartJsEventNames: string[];
/** Transition mode accepted by the exposed update() method. */
type UpdateMode = 'resize' | 'reset' | 'default' | 'none' | 'hide' | 'show' | 'active';
/** Payload passed to every emitted chart.js event. */
interface EventObject {
    type: string;
    chartRef?: Ref<VNodeRef | null>;
    preventDefault: () => void;
    isDefaultPrevented: () => boolean;
    _defaultPrevented: boolean;
}
declare function generateEventObject(type: string, chartRef?: Ref<VNodeRef | null>): EventObject;
declare function generateChartJsEventListener(emit: EmitFn, event: EventObject): {
    [event.type]: () => boolean;
};
export { chartJsEventNames, generateEventObject, generateChartJsEventListener, };
export type { EventObject, UpdateMode, };
//# sourceMappingURL=includes.d.ts.map