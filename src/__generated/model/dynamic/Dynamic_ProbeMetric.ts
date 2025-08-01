import type {ProbeMetricRange} from '../embeddable/';
import type {Dynamic_ProbeMetricData, Dynamic_ProbeTarget} from './';

export interface Dynamic_ProbeMetric {
    readonly id?: number;
    readonly name?: string;
    readonly unit?: string;
    readonly range?: ProbeMetricRange;
    readonly probeTarget?: Dynamic_ProbeTarget;
    readonly datas?: ReadonlyArray<Dynamic_ProbeMetricData>;
}
