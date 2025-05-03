import type {Executor} from '../';
import type {NotePicture, StreamingResponseBody} from '../model/static/';

export class FileController {
    
    constructor(private executor: Executor) {}
    
    readonly downloadFileRecord: (options: FileControllerOptions['downloadFileRecord']) => Promise<
        StreamingResponseBody
    > = async(options) => {
        let _uri = '/file/';
        _uri += encodeURIComponent(options.uuid);
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.pw;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'pw='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<StreamingResponseBody>;
    }
    
    readonly downloadFileRecordWithFilename: (options: FileControllerOptions['downloadFileRecordWithFilename']) => Promise<
        StreamingResponseBody
    > = async(options) => {
        let _uri = '/file/';
        _uri += encodeURIComponent(options.uuid);
        _uri += '/';
        _uri += encodeURIComponent(options.filename);
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.pw;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'pw='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<StreamingResponseBody>;
    }
    
    readonly downloadHyperLinkPicture: (options: FileControllerOptions['downloadHyperLinkPicture']) => Promise<
        StreamingResponseBody
    > = async(options) => {
        let _uri = '/file/hyper-link/';
        _uri += encodeURIComponent(options.uuid);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<StreamingResponseBody>;
    }
    
    readonly downloadNotePicture: (options: FileControllerOptions['downloadNotePicture']) => Promise<
        StreamingResponseBody
    > = async(options) => {
        let _uri = '/file/note/';
        _uri += encodeURIComponent(options.uuid);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<StreamingResponseBody>;
    }
    
    readonly downloadProfileFile: (options: FileControllerOptions['downloadProfileFile']) => Promise<
        StreamingResponseBody
    > = async(options) => {
        let _uri = '/file/profile/';
        _uri += encodeURIComponent(options.category);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<StreamingResponseBody>;
    }
    
    readonly uploadNotePicture: (options: FileControllerOptions['uploadNotePicture']) => Promise<
        ReadonlyArray<NotePicture>
    > = async(options) => {
        let _uri = '/file/note';
        const _formData = new FormData();
        const _body = options.body;
        for (const file of _body.files) {
            _formData.append("file[]", file);
        }
        return (await this.executor({uri: _uri, method: 'POST', body: _formData})) as Promise<ReadonlyArray<NotePicture>>;
    }
}

export type FileControllerOptions = {
    'downloadFileRecordWithFilename': {
        readonly uuid: string, 
        readonly filename: string, 
        readonly pw?: string | undefined
    }, 
    'downloadFileRecord': {
        readonly uuid: string, 
        readonly pw?: string | undefined
    }, 
    'uploadNotePicture': {
        readonly body: {
            readonly files: ReadonlyArray<File>
        }
    }, 
    'downloadNotePicture': {
        readonly uuid: string
    }, 
    'downloadHyperLinkPicture': {
        readonly uuid: string
    }, 
    'downloadProfileFile': {
        readonly category: string
    }
}
