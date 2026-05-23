import type {Executor} from '../';
import type {ProbeTargetData} from '../model/static/';

export class ProbeDataController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 接收探针数据
     * 
     * 接收来自探针的监控数据，并存储到系统中
     * 
     * @parameter {ProbeDataControllerOptions['postProbeData']} options
     * - id 探针目标ID
     * - data 探针数据，包含时间戳和具体的监控指标
     */
    readonly postProbeData: (options: ProbeDataControllerOptions['postProbeData']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/probe-target/';
        _uri += encodeURIComponent(options.id);
        _uri += '/data';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<void>;
    }
}

export type ProbeDataControllerOptions = {
    'postProbeData': {
        /**
         * 探针目标ID
         */
        readonly id: number, 
        /**
         * 探针数据，包含时间戳和具体的监控指标
         */
        readonly body: ProbeTargetData
    }
}
