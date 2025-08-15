import type {Executor} from '../';
import type {ProbeTargetData} from '../model/static/';

export class ProbeDataController {
    
    constructor(private executor: Executor) {}
    
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
        readonly id: number, 
        readonly body: ProbeTargetData
    }
}
