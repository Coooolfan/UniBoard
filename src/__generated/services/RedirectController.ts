import type {Executor} from '../';

/**
 * 重定向控制器
 * 
 * 处理短链接的重定向功能，将短链接重定向到对应的长链接
 * 并统计访问次数，支持缓存机制提高性能
 */
export class RedirectController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 短链接重定向
     * 
     * 根据短链接码查找对应的长链接并进行重定向
     * 同时记录访问次数，支持缓存机制提高响应速度
     * 
     * @parameter {RedirectControllerOptions['redirect']} options
     * - shortUrlCode 短链接码
     * - resp HTTP响应对象，用于执行重定向
     */
    readonly redirect: (options: RedirectControllerOptions['redirect']) => Promise<
        void
    > = async(options) => {
        let _uri = '/s/';
        _uri += encodeURIComponent(options.shortUrlCode);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<void>;
    }
}

export type RedirectControllerOptions = {
    'redirect': {
        /**
         * 短链接码
         */
        readonly shortUrlCode: string
    }
}
