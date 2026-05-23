import type {Executor} from '../';

export class ProbeScriptController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 获取自定义安装脚本
     * 
     * @parameter {ProbeScriptControllerOptions['getCustomInstallScript']} options
     * - probeId 探针ID
     * - key 探针密钥
     * - interval 采集间隔（秒）
     * @return 安装脚本内容
     */
    readonly getCustomInstallScript: (options: ProbeScriptControllerOptions['getCustomInstallScript']) => Promise<
        string
    > = async(options) => {
        let _uri = '/api/probe-script/installer/probe/';
        _uri += encodeURIComponent(options.probeId);
        _uri += '/key/';
        _uri += encodeURIComponent(options.key);
        _uri += '/interval/';
        _uri += encodeURIComponent(options.interval);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<string>;
    }
    
    /**
     * 获取监控脚本
     * 
     * @return 监控脚本内容
     */
    readonly getMonitorScript: () => Promise<
        string
    > = async() => {
        let _uri = '/api/probe-script/probe-monitor.sh';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<string>;
    }
}

export type ProbeScriptControllerOptions = {
    'getCustomInstallScript': {
        /**
         * 探针ID
         */
        readonly probeId: number, 
        /**
         * 探针密钥
         */
        readonly key: string, 
        /**
         * 采集间隔（秒）
         */
        readonly interval: number
    }, 
    'getMonitorScript': {}
}
