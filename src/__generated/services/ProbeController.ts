import type {Executor} from '../';
import type {ProbeTargetDto} from '../model/dto/';
import type {ProbeTargetInsert, ProbeTargetUpdate} from '../model/static/';

/**
 * 探针相关资源控制器
 * 
 * 处理探针目标的增删改查操作，包括获取所有探针目标、插入新探针目标和更新探针目标信息
 * 所有操作都需要登录验证
 */
export class ProbeController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 删除探针目标
     * 
     * 根据ID删除指定的探针目标
     * 需要登录验证
     * 
     * @parameter {ProbeControllerOptions['deleteProbeTargetById']} options
     * - id 探针目标ID
     */
    readonly deleteProbeTargetById: (options: ProbeControllerOptions['deleteProbeTargetById']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/probe-target/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    /**
     * 获取所有探针目标列表
     * 
     * 获取所有已注册的探针目标列表
     * 需要登录验证
     * 
     * @return List<ProbeTarget>
     * 探针目标列表，包含所有标量字段和指标信息
     */
    readonly getAllProbeTagets: () => Promise<
        ReadonlyArray<ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET']>
    > = async() => {
        let _uri = '/api/probe-target';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET']>>;
    }
    
    /**
     * 插入新的探针目标
     * 
     * 添加新的探针目标到系统中
     * 需要登录验证
     * 
     * @parameter {ProbeControllerOptions['insertProbeTarget']} options
     * - insert ProbeTargetInsert
     * 包含要插入的探针目标信息
     * @return ProbeTarget
     * 插入后的探针目标对象，包含所有标量字段和指标信息
     */
    readonly insertProbeTarget: (options: ProbeControllerOptions['insertProbeTarget']) => Promise<
        ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET']
    > = async(options) => {
        let _uri = '/api/probe-target';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET']>;
    }
    
    /**
     * 刷新探针目标的key
     * 
     * 根据ID刷新指定探针目标的key并返回新的key
     * 需要登录验证
     * 
     * @parameter {ProbeControllerOptions['refreshProbeTargetKey']} options
     * - id 探针目标ID
     */
    readonly refreshProbeTargetKey: (options: ProbeControllerOptions['refreshProbeTargetKey']) => Promise<
        ProbeTargetDto['ProbeController/PROBE_TARGET_WITH_KEY']
    > = async(options) => {
        let _uri = '/api/probe-target/';
        _uri += encodeURIComponent(options.id);
        _uri += '/key';
        return (await this.executor({uri: _uri, method: 'PUT'})) as Promise<ProbeTargetDto['ProbeController/PROBE_TARGET_WITH_KEY']>;
    }
    
    /**
     * 更新探针目标信息
     * 
     * 根据ID更新指定的探针目标信息
     * 需要登录验证
     * 
     * @parameter {ProbeControllerOptions['updateProbeTarget']} options
     * - id 探针目标ID
     * - update ProbeTargetUpdate
     * 包含要更新的探针目标信息
     */
    readonly updateProbeTarget: (options: ProbeControllerOptions['updateProbeTarget']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/probe-target/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<void>;
    }
}

export type ProbeControllerOptions = {
    'getAllProbeTagets': {}, 
    'insertProbeTarget': {
        /**
         * ProbeTargetInsert
         * 包含要插入的探针目标信息
         */
        readonly body: ProbeTargetInsert
    }, 
    'updateProbeTarget': {
        /**
         * 探针目标ID
         */
        readonly id: number, 
        /**
         * ProbeTargetUpdate
         * 包含要更新的探针目标信息
         */
        readonly body: ProbeTargetUpdate
    }, 
    'deleteProbeTargetById': {
        /**
         * 探针目标ID
         */
        readonly id: number
    }, 
    'refreshProbeTargetKey': {
        /**
         * 探针目标ID
         */
        readonly id: number
    }
}
