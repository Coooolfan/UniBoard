import type {Executor} from '../';
import type {ProfileDto} from '../model/dto/';
import type {PasswordUpdate, ProfileCreate, ProfileUpdate} from '../model/static/';

/**
 * 个人资料控制器
 * 
 * 处理用户个人资料的管理操作，包括获取、创建、更新个人资料和修改密码
 */
export class ProfileController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 创建个人资料
     * 
     * 初始化系统的个人资料，包括基本信息和可选的头像、横幅图片、字体文件
     * 只能在系统未初始化时调用，用于首次设置
     * 
     * @parameter {ProfileControllerOptions['createProfile']} options
     * - create 个人资料创建数据，包含姓名、登录名、密码等基本信息
     * - avatar 可选的头像文件
     * - banner 可选的横幅图片文件
     * - font 可选的字体文件
     */
    readonly createProfile: (options: ProfileControllerOptions['createProfile']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/profile';
        const _formData = new FormData();
        const _body = options.body;
        _formData.append(
            "create", 
            new Blob(
                [JSON.stringify(_body.create)], 
                {type: "application/json"}
            )
        );
        if (_body.avatar) {
            _formData.append("avatar", _body.avatar);
        }
        if (_body.banner) {
            _formData.append("banner", _body.banner);
        }
        if (_body.font) {
            _formData.append("font", _body.font);
        }
        return (await this.executor({uri: _uri, method: 'POST', body: _formData})) as Promise<void>;
    }
    
    /**
     * 获取个人资料
     * 
     * 获取系统的个人资料信息，返回公开的个人资料数据（不包含登录凭据）
     * 
     * @return Profile 个人资料对象
     */
    readonly getProfile: () => Promise<
        ProfileDto['ProfileController/PUBLIC_PROFILE']
    > = async() => {
        let _uri = '/api/profile';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ProfileDto['ProfileController/PUBLIC_PROFILE']>;
    }
    
    /**
     * 更新密码
     * 
     * 修改用户的登录密码，需要提供当前密码进行验证
     * 需要登录验证
     * 
     * @parameter {ProfileControllerOptions['updatePassword']} options
     * - update 密码更新数据，包含当前密码和新密码
     */
    readonly updatePassword: (options: ProfileControllerOptions['updatePassword']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/profile/password';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.update.oldPassword;
        _uri += _separator
        _uri += 'oldPassword='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        _value = options.update.newLoginName;
        _uri += _separator
        _uri += 'newLoginName='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        _value = options.update.newPassword;
        _uri += _separator
        _uri += 'newPassword='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'PUT'})) as Promise<void>;
    }
    
    /**
     * 更新个人资料
     * 
     * 更新现有的个人资料信息，可以修改基本信息和上传新的头像、横幅图片、字体文件
     * 需要登录验证
     * 
     * @parameter {ProfileControllerOptions['updateProfile']} options
     * - update 个人资料更新数据
     * - avatar 可选的新头像文件
     * - banner 可选的新横幅图片文件
     * - font 可选的新字体文件
     */
    readonly updateProfile: (options: ProfileControllerOptions['updateProfile']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/profile';
        const _formData = new FormData();
        const _body = options.body;
        _formData.append(
            "update", 
            new Blob(
                [JSON.stringify(_body.update)], 
                {type: "application/json"}
            )
        );
        if (_body.avatar) {
            _formData.append("avatar", _body.avatar);
        }
        if (_body.banner) {
            _formData.append("banner", _body.banner);
        }
        if (_body.font) {
            _formData.append("font", _body.font);
        }
        return (await this.executor({uri: _uri, method: 'PUT', body: _formData})) as Promise<void>;
    }
}

export type ProfileControllerOptions = {
    'getProfile': {}, 
    'createProfile': {
        readonly body: {
            readonly create: ProfileCreate, 
            readonly avatar?: File | undefined, 
            readonly banner?: File | undefined, 
            readonly font?: File | undefined
        }
    }, 
    'updateProfile': {
        readonly body: {
            readonly update: ProfileUpdate, 
            readonly avatar?: File | undefined, 
            readonly banner?: File | undefined, 
            readonly font?: File | undefined
        }
    }, 
    'updatePassword': {
        /**
         * 密码更新数据，包含当前密码和新密码
         */
        readonly update: PasswordUpdate
    }
}
