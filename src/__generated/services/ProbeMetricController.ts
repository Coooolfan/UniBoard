import type {Executor} from '../';
import type {Dynamic_ProbeMetric} from '../model/dynamic/';
import type {ProbeMetricInsert, ProbeMetricUpdate} from '../model/static/';

/**
 * 探针指标控制器
 * 
 * 处理探针目标下的指标管理操作，包括添加、更新和删除指标
 * 所有操作都需要登录验证
 */
export class ProbeMetricController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 删除指定的探针指标
     * 
     * 删除指定探针目标下的特定指标，删除后该指标的所有历史数据也将被清理
     * 需要登录验证
     * 
     * @parameter {ProbeMetricControllerOptions['deleteProbeMetric']} options
     * - targetId 探针目标ID
     * - metricId 指标ID
     */
    readonly deleteProbeMetric: (options: ProbeMetricControllerOptions['deleteProbeMetric']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/probe-target/';
        _uri += encodeURIComponent(options.targetId);
        _uri += '/metric/';
        _uri += encodeURIComponent(options.metricId);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    /**
     * 为指定探针目标添加新指标
     * 
     * 为指定的探针目标添加一个新的监控指标，用于定义需要采集的数据类型
     * 需要登录验证
     * 
     * @parameter {ProbeMetricControllerOptions['insertProbeMetric']} options
     * - targetId 探针目标ID
     * - insert ProbeMetricInsert 包含指标信息的DTO对象
     * @return ProbeMetric 创建后的指标对象，包含所有标量字段
     */
    readonly insertProbeMetric: (options: ProbeMetricControllerOptions['insertProbeMetric']) => Promise<
        Dynamic_ProbeMetric
    > = async(options) => {
        let _uri = '/api/probe-target/';
        _uri += encodeURIComponent(options.targetId);
        _uri += '/metric';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<Dynamic_ProbeMetric>;
    }
    
    /**
     * 更新指定的探针指标
     * 
     * 更新指定探针目标下的特定指标的配置信息，如指标名称、单位、范围等
     * 需要登录验证
     * 
     * @parameter {ProbeMetricControllerOptions['updateProbeMetric']} options
     * - targetId 探针目标ID
     * - metricId 指标ID
     * - insert ProbeMetricUpdate 包含要更新的指标信息
     * @return ProbeMetric 更新后的指标对象，包含所有标量字段
     */
    readonly updateProbeMetric: (options: ProbeMetricControllerOptions['updateProbeMetric']) => Promise<
        Dynamic_ProbeMetric
    > = async(options) => {
        let _uri = '/api/probe-target/';
        _uri += encodeURIComponent(options.targetId);
        _uri += '/metric/';
        _uri += encodeURIComponent(options.metricId);
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<Dynamic_ProbeMetric>;
    }
}

export type ProbeMetricControllerOptions = {
    'insertProbeMetric': {
        /**
         * 探针目标ID
         */
        readonly targetId: number, 
        /**
         * ProbeMetricInsert 包含指标信息的DTO对象
         */
        readonly body: ProbeMetricInsert
    }, 
    'updateProbeMetric': {
        /**
         * 探针目标ID
         */
        readonly targetId: number, 
        /**
         * 指标ID
         */
        readonly metricId: number, 
        /**
         * ProbeMetricUpdate 包含要更新的指标信息
         */
        readonly body: ProbeMetricUpdate
    }, 
    'deleteProbeMetric': {
        /**
         * 探针目标ID
         */
        readonly targetId: number, 
        /**
         * 指标ID
         */
        readonly metricId: number
    }
}
