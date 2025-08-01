import type {ProbeTargetLocation} from '../embeddable/';
import type {Dynamic_ProbeMetric} from './';

export interface Dynamic_ProbeTarget {
    readonly id?: number;
    readonly name?: string;
    readonly description?: string;
    readonly key?: string;
    readonly location?: ProbeTargetLocation;
    readonly metrics?: ReadonlyArray<Dynamic_ProbeMetric>;
}
