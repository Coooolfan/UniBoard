import type {Executor} from '../';
import type {ShortUrlDto} from '../model/dto/';
import type {Page, ShortUrlInsert} from '../model/static/';

export class ShortUrlController {
    
    constructor(private executor: Executor) {}
    
    readonly deleteShortUrl: (options: ShortUrlControllerOptions['deleteShortUrl']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/short-url/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
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
    
    readonly insertShortUrl: (options: ShortUrlControllerOptions['insertShortUrl']) => Promise<
        ShortUrlDto['ShortUrlController/DEFAULT_SHORT_URL']
    > = async(options) => {
        let _uri = '/api/short-url';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ShortUrlDto['ShortUrlController/DEFAULT_SHORT_URL']>;
    }
}

export type ShortUrlControllerOptions = {
    'getShortUrl': {
        readonly pageIndex: number, 
        readonly pageSize: number
    }, 
    'insertShortUrl': {
        readonly body: ShortUrlInsert
    }, 
    'deleteShortUrl': {
        readonly id: number
    }
}
