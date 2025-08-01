import type {ProbeMetricRange} from '../embeddable/';

export interface ProbeMetricInsert {
    readonly name: string;
    readonly unit: string;
    readonly range: ProbeMetricRange;
}
