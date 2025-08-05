import type {ProbeTargetLocation} from '../embeddable/';
import type {SimpleTargetMetricData} from '../static/';

export type ProbeTargetDto = {
    'ProbeController/DEFAULT_PROBE_TARGET': {
        readonly id: number;
        readonly name: string;
        readonly description: string;
        readonly location: ProbeTargetLocation;
        readonly lastReportTime: string;
        readonly lastReportData?: SimpleTargetMetricData | undefined;
    }, 
    'ProbeController/PROBE_TARGET_WITH_KEY': {
        readonly id: number;
        readonly key: string;
    }
}
