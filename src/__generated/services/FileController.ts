import type {Executor} from '../';
import type {NotePicture, StreamingResponseBody} from '../model/static/';

/**
 * 文件控制器
 * 
 * 处理文件的上传、下载和访问操作，包括文件记录下载、笔记图片、超链接图片和个人资料文件
 */
export class FileController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 通过UUID下载文件记录
     * 
     * @parameter {FileControllerOptions['downloadFileRecord']} options
     * - uuid 文件的唯一标识符
     * - pw 可选的密码参数，用于访问受密码保护的文件
     * - resp HTTP响应对象
     * @return StreamingResponseBody 文件流响应体
     */
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
    
    /**
     * 通过UUID和文件名下载文件记录
     * 
     * @parameter {FileControllerOptions['downloadFileRecordWithFilename']} options
     * - uuid 文件的唯一标识符
     * - filename 文件名（用于下载时的文件名显示）
     * - pw 可选的密码参数，用于访问受密码保护的文件
     * - resp HTTP响应对象
     * @return StreamingResponseBody 文件流响应体
     */
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
    
    /**
     * 下载超链接图片
     * 
     * 获取与超链接关联的图片文件，通常用于显示链接的预览图或图标
     * 
     * @parameter {FileControllerOptions['downloadHyperLinkPicture']} options
     * - uuid 超链接图片的唯一标识符
     * - response HTTP响应对象
     * @return StreamingResponseBody 图片文件流响应体
     */
    readonly downloadHyperLinkPicture: (options: FileControllerOptions['downloadHyperLinkPicture']) => Promise<
        StreamingResponseBody
    > = async(options) => {
        let _uri = '/file/hyper-link/';
        _uri += encodeURIComponent(options.uuid);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<StreamingResponseBody>;
    }
    
    /**
     * 下载笔记图片
     * 
     * 根据UUID获取笔记中的图片文件
     * 需要登录验证
     * 
     * @parameter {FileControllerOptions['downloadNotePicture']} options
     * - uuid 图片的唯一标识符
     * - response HTTP响应对象
     * @return StreamingResponseBody 图片文件流响应体
     */
    readonly downloadNotePicture: (options: FileControllerOptions['downloadNotePicture']) => Promise<
        StreamingResponseBody
    > = async(options) => {
        let _uri = '/file/note/';
        _uri += encodeURIComponent(options.uuid);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<StreamingResponseBody>;
    }
    
    /**
     * 下载个人资料文件
     * 
     * 根据类别获取个人资料相关的文件，如头像、横幅图片或字体文件
     * 
     * @parameter {FileControllerOptions['downloadProfileFile']} options
     * - category 文件类别（如：avatar、banner、font等）
     * - response HTTP响应对象
     * @return StreamingResponseBody 文件流响应体
     */
    readonly downloadProfileFile: (options: FileControllerOptions['downloadProfileFile']) => Promise<
        StreamingResponseBody
    > = async(options) => {
        let _uri = '/file/profile/';
        _uri += encodeURIComponent(options.category);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<StreamingResponseBody>;
    }
    
    /**
     * 上传笔记图片
     * 
     * 支持批量上传多个图片文件，用于笔记中的图片内容
     * 需要登录验证
     * 
     * @parameter {FileControllerOptions['uploadNotePicture']} options
     * - files 要上传的图片文件数组
     * @return List<NotePicture> 上传成功的图片信息列表
     */
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
        /**
         * 文件的唯一标识符
         */
        readonly uuid: string, 
        /**
         * 文件名（用于下载时的文件名显示）
         */
        readonly filename: string, 
        /**
         * 可选的密码参数，用于访问受密码保护的文件
         */
        readonly pw?: string | undefined
    }, 
    'downloadFileRecord': {
        /**
         * 文件的唯一标识符
         */
        readonly uuid: string, 
        /**
         * 可选的密码参数，用于访问受密码保护的文件
         */
        readonly pw?: string | undefined
    }, 
    'uploadNotePicture': {
        readonly body: {
            readonly files: ReadonlyArray<File>
        }
    }, 
    'downloadNotePicture': {
        /**
         * 图片的唯一标识符
         */
        readonly uuid: string
    }, 
    'downloadHyperLinkPicture': {
        /**
         * 超链接图片的唯一标识符
         */
        readonly uuid: string
    }, 
    'downloadProfileFile': {
        /**
         * 文件类别（如：avatar、banner、font等）
         */
        readonly category: string
    }
}
