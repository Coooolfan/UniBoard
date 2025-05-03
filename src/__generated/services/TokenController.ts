import type {Executor} from '../';
import type {ProfileLogin} from '../model/static/';

export class TokenController {
    
    constructor(private executor: Executor) {}
    
    readonly deleteToken: () => Promise<
        void
    > = async() => {
        let _uri = '/api/token';
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    readonly getToken: (options: TokenControllerOptions['getToken']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/token';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.login.loginName;
        _uri += _separator
        _uri += 'loginName='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        _value = options.login.loginPassword;
        _uri += _separator
        _uri += 'loginPassword='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<void>;
    }
}

export type TokenControllerOptions = {
    'getToken': {
        readonly login: ProfileLogin
    }, 
    'deleteToken': {}
}
