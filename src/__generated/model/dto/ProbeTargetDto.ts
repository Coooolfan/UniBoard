import type {ProbeMetricRange, ProbeTargetLocation} from '../embeddable/';

export type ProbeTargetDto = {
    'ProbeController/DEFAULT_PROBE_TARGET': {
        readonly id: number;
        readonly name: string;
        readonly description: string;
        readonly key: string;
        readonly location: ProbeTargetLocation;
        readonly metrics: ReadonlyArray<{
            readonly id: number;
            readonly name: string;
            readonly unit: string;
            readonly range: ProbeMetricRange;
        }>;
    }
}
