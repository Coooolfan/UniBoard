import type {Executor} from '../';
import type {ProfileLogin} from '../model/static/';

/**
 * 令牌控制器
 * 
 * 处理用户身份验证相关操作，包括获取令牌（登录）、删除令牌（登出）和刷新令牌
 */
export class TokenController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 删除令牌（登出）
     * 
     * 使当前用户登出系统
     */
    readonly deleteToken: () => Promise<
        void
    > = async() => {
        let _uri = '/api/token';
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    /**
     * 获取令牌（登录）
     * 
     * @parameter {TokenControllerOptions['getToken']} options
     * - login 用户登录信息
     */
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
    
    /**
     * 刷新令牌
     * 
     * 为当前登录用户刷新身份验证令牌
     * 需要用户已经登录
     */
    readonly refreshToken: () => Promise<
        void
    > = async() => {
        let _uri = '/api/token';
        return (await this.executor({uri: _uri, method: 'POST'})) as Promise<void>;
    }
}

export type TokenControllerOptions = {
    'getToken': {
        /**
         * 用户登录信息
         */
        readonly login: ProfileLogin
    }, 
    'deleteToken': {}, 
    'refreshToken': {}
}
