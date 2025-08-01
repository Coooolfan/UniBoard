import type {ProbeMetricRange} from '../embeddable/';

export interface ProbeMetricUpdate {
    readonly name: string;
    readonly unit: string;
    readonly range: ProbeMetricRange;
}
