import type {Executor} from '../';
import type {SystemConfigDto} from '../model/dto/';
import type {SystemConfigUpdate} from '../model/static/';

/**
 * 系统配置控制器
 * 
 * 处理系统配置的获取和更新操作，包括主机地址、显示设置等系统级配置
 */
export class SystemConfigController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 获取系统配置
     * 
     * 获取当前的系统配置信息，如果配置不存在则返回默认配置
     * 
     * @return SystemConfig 系统配置对象，包含主机地址、显示设置等信息
     */
    readonly getSystemConfig: () => Promise<
        SystemConfigDto['SystemConfigController/DEFAULT_SYSTEM_CONFIG']
    > = async() => {
        let _uri = '/api/system-config';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<SystemConfigDto['SystemConfigController/DEFAULT_SYSTEM_CONFIG']>;
    }
    
    /**
     * 更新系统配置
     * 
     * 更新系统配置信息，如主机地址、个人资料显示设置、版权显示设置等
     * 需要登录验证
     * 
     * @parameter {SystemConfigControllerOptions['updateSystemConfig']} options
     * - update 系统配置更新数据
     * @return SystemConfig 更新后的系统配置对象
     */
    readonly updateSystemConfig: (options: SystemConfigControllerOptions['updateSystemConfig']) => Promise<
        SystemConfigDto['SystemConfigController/DEFAULT_SYSTEM_CONFIG']
    > = async(options) => {
        let _uri = '/api/system-config';
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<SystemConfigDto['SystemConfigController/DEFAULT_SYSTEM_CONFIG']>;
    }
}

export type SystemConfigControllerOptions = {
    'getSystemConfig': {}, 
    'updateSystemConfig': {
        /**
         * 系统配置更新数据
         */
        readonly body: SystemConfigUpdate
    }
}
