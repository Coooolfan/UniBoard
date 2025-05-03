import type {Executor} from '../';
import type {ProfileDto} from '../model/dto/';
import type {PasswordUpdate, ProfileCreate, ProfileUpdate} from '../model/static/';

export class ProfileController {
    
    constructor(private executor: Executor) {}
    
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
    
    readonly getProfile: () => Promise<
        ProfileDto['ProfileController/PUBLIC_PROFILE']
    > = async() => {
        let _uri = '/api/profile';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ProfileDto['ProfileController/PUBLIC_PROFILE']>;
    }
    
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
        readonly update: PasswordUpdate
    }
}
