import type {Executor} from '../';
import type {Dynamic_ProbeTarget} from '../model/dynamic/';
import type {ProbeMetricDataInsert} from '../model/static/';

/**
 * 探针指标数据控制器
 * 
 * 处理探针指标数据的上报和查询操作
 * 数据上报无需登录验证（通过key进行鉴权），数据查询需要登录验证
 */
export class ProbeMetricDataController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 查询探针指标数据
     * 
     * 根据指定的探针目标和指标，查询指定时间范围内的监控数据
     * 需要登录验证
     * 
     * @parameter {ProbeMetricDataControllerOptions['getMetricData']} options
     * - targetIds 探针目标ID列表，指定要查询的探针目标
     * - metricIds 指标ID列表，指定要查询的指标
     * - start 查询开始时间，可选参数，默认为1天前
     * - end 查询结束时间，可选参数，默认为当前时间
     * @return List<ProbeTarget> 包含指标数据的探针目标列表
     */
    readonly getMetricData: (options: ProbeMetricDataControllerOptions['getMetricData']) => Promise<
        ReadonlyArray<Dynamic_ProbeTarget>
    > = async(options) => {
        let _uri = '/api/probe-target/metric/data';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.targetIds;
        for (const _item of _value) {
            _uri += _separator
            _uri += 'targetIds='
            _uri += encodeURIComponent(_item);
            _separator = '&';
        }
        _value = options.metricIds;
        for (const _item of _value) {
            _uri += _separator
            _uri += 'metricIds='
            _uri += encodeURIComponent(_item);
            _separator = '&';
        }
        _value = options.start;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'start='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.end;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'end='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<Dynamic_ProbeTarget>>;
    }
    
    /**
     * 上报探针指标数据
     * 
     * 接收探针客户端上报的监控数据，通过探针目标的key进行身份验证
     * 无需登录验证，但需要提供正确的探针目标key
     * 
     * @parameter {ProbeMetricDataControllerOptions['insertProbeMetricData']} options
     * - data ProbeMetricDataInsert 包含目标ID、验证key和指标数据列表
     */
    readonly insertProbeMetricData: (options: ProbeMetricDataControllerOptions['insertProbeMetricData']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/probe-target/metric/data';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<void>;
    }
}

export type ProbeMetricDataControllerOptions = {
    'insertProbeMetricData': {
        /**
         * ProbeMetricDataInsert 包含目标ID、验证key和指标数据列表
         */
        readonly body: ProbeMetricDataInsert
    }, 
    'getMetricData': {
        /**
         * 探针目标ID列表，指定要查询的探针目标
         */
        readonly targetIds: ReadonlyArray<number>, 
        /**
         * 指标ID列表，指定要查询的指标
         */
        readonly metricIds: ReadonlyArray<number>, 
        /**
         * 查询开始时间，可选参数，默认为1天前
         */
        readonly start?: string | undefined, 
        /**
         * 查询结束时间，可选参数，默认为当前时间
         */
        readonly end?: string | undefined
    }
}
