import type {Executor} from '../';
import type {SystemConfigDto} from '../model/dto/';
import type {SystemConfigUpdate} from '../model/static/';

export class SystemConfigController {
    
    constructor(private executor: Executor) {}
    
    readonly getSystemConfig: () => Promise<
        SystemConfigDto['SystemConfigController/DEFAULT_SYSTEM_CONFIG']
    > = async() => {
        let _uri = '/api/system-config';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<SystemConfigDto['SystemConfigController/DEFAULT_SYSTEM_CONFIG']>;
    }
    
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
        readonly body: SystemConfigUpdate
    }
}
