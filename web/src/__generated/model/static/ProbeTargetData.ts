import type {SimpleTargetMetricData} from './';

export interface ProbeTargetData {
    readonly key: string;
    readonly timestamp: string;
    readonly data: SimpleTargetMetricData;
}
