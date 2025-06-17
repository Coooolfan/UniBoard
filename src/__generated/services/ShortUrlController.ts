import type {Executor} from '../';
import type {ShortUrlDto} from '../model/dto/';
import type {Page, ShortUrlInsert} from '../model/static/';

/**
 * 短链接控制器
 * 
 * 处理短链接的管理操作，包括创建、查询和删除短链接
 * 所有操作都需要登录验证
 */
export class ShortUrlController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 根据ID删除短链接
     * 
     * 删除指定ID的短链接记录
     * 需要登录验证
     * 
     * @parameter {ShortUrlControllerOptions['deleteShortUrl']} options
     * - id 要删除的短链接ID
     */
    readonly deleteShortUrl: (options: ShortUrlControllerOptions['deleteShortUrl']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/short-url/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    /**
     * 获取短链接列表（分页）
     * 
     * 获取所有短链接的分页列表，按ID升序排列
     * 需要登录验证
     * 
     * @parameter {ShortUrlControllerOptions['getShortUrl']} options
     * - pageIndex 页面索引（从0开始）
     * - pageSize 每页大小
     * @return Page<ShortUrl> 分页的短链接列表
     */
    readonly getShortUrl: (options: ShortUrlControllerOptions['getShortUrl']) => Promise<
        Page<ShortUrlDto['ShortUrlController/DEFAULT_SHORT_URL']>
    > = async(options) => {
        let _uri = '/api/short-url';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.pageIndex;
        _uri += _separator
        _uri += 'pageIndex='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        _value = options.pageSize;
        _uri += _separator
        _uri += 'pageSize='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<ShortUrlDto['ShortUrlController/DEFAULT_SHORT_URL']>>;
    }
    
    /**
     * 创建新的短链接
     * 
     * 根据长链接URL创建对应的短链接，系统会自动生成短链接码
     * 需要登录验证
     * 
     * @parameter {ShortUrlControllerOptions['insertShortUrl']} options
     * - insert 短链接创建数据，包含长链接URL等信息
     * @return ShortUrl 创建的短链接对象
     */
    readonly insertShortUrl: (options: ShortUrlControllerOptions['insertShortUrl']) => Promise<
        ShortUrlDto['ShortUrlController/DEFAULT_SHORT_URL']
    > = async(options) => {
        let _uri = '/api/short-url';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ShortUrlDto['ShortUrlController/DEFAULT_SHORT_URL']>;
    }
}

export type ShortUrlControllerOptions = {
    'getShortUrl': {
        /**
         * 页面索引（从0开始）
         */
        readonly pageIndex: number, 
        /**
         * 每页大小
         */
        readonly pageSize: number
    }, 
    'insertShortUrl': {
        /**
         * 短链接创建数据，包含长链接URL等信息
         */
        readonly body: ShortUrlInsert
    }, 
    'deleteShortUrl': {
        /**
         * 要删除的短链接ID
         */
        readonly id: number
    }
}
