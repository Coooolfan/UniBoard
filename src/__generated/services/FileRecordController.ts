import type {Executor} from '../';
import type {FileRecordDto} from '../model/dto/';
import type {
    FileRecordDirectLinkCreate, 
    FileRecordDirectLinkResp, 
    FileRecordInsert, 
    FileRecordPublic, 
    FileRecordUpdate, 
    Page
} from '../model/static/';

/**
 * 文件记录控制器
 * 
 * 处理文件记录的管理操作，包括文件上传、下载、分享、更新和删除等功能
 */
export class FileRecordController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 创建文件直链
     * 
     * 为指定的文件记录创建直接下载链接，用于快速访问文件
     * 需要登录验证
     * 
     * @parameter {FileRecordControllerOptions['createDirectLink']} options
     * - create 直链创建请求数据
     * @return FileRecordDirectLinkResp 包含直链信息的响应
     */
    readonly createDirectLink: (options: FileRecordControllerOptions['createDirectLink']) => Promise<
        FileRecordDirectLinkResp
    > = async(options) => {
        let _uri = '/api/file-record/direct-link';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.create.id;
        _uri += _separator
        _uri += 'id='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'POST'})) as Promise<FileRecordDirectLinkResp>;
    }
    
    /**
     * 根据ID删除文件记录
     * 
     * 删除指定的文件记录及其关联的文件
     * 需要登录验证
     * 
     * @parameter {FileRecordControllerOptions['deleteFileRecordById']} options
     * - id 要删除的文件记录ID
     */
    readonly deleteFileRecordById: (options: FileRecordControllerOptions['deleteFileRecordById']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/file-record/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    /**
     * 获取所有文件记录（分页）
     * 
     * 获取当前用户上传的文件记录列表，支持分页查询
     * 需要登录验证
     * 
     * @parameter {FileRecordControllerOptions['getAllFileRecords']} options
     * - pageIndex 页面索引（从0开始）
     * - pageSize 每页大小
     * @return Page<FileRecord> 分页的文件记录列表
     */
    readonly getAllFileRecords: (options: FileRecordControllerOptions['getAllFileRecords']) => Promise<
        Page<FileRecordDto['FileRecordController/DEFAULT_FILERECORD']>
    > = async(options) => {
        let _uri = '/api/file-record';
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
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<FileRecordDto['FileRecordController/DEFAULT_FILERECORD']>>;
    }
    
    /**
     * 根据分享码获取文件记录
     * 
     * 公共接口，用于文件分享页的内容获取，无需登录验证
     * 返回文件的公开信息，不包含敏感数据
     * 
     * @parameter {FileRecordControllerOptions['getFileRecordByShareCode']} options
     * - shareCode 文件分享码
     * @return FileRecordPublic 文件记录的公开信息
     */
    readonly getFileRecordByShareCode: (options: FileRecordControllerOptions['getFileRecordByShareCode']) => Promise<
        FileRecordPublic
    > = async(options) => {
        let _uri = '/api/file-record/';
        _uri += encodeURIComponent(options.shareCode);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<FileRecordPublic>;
    }
    
    /**
     * 根据ID更新文件记录
     * 
     * 更新指定文件记录的信息，如描述、可见性、密码等
     * 需要登录验证
     * 
     * @parameter {FileRecordControllerOptions['updateFileRecordById']} options
     * - id 文件记录ID
     * - update 文件记录更新数据
     * @return FileRecord 更新后的文件记录
     */
    readonly updateFileRecordById: (options: FileRecordControllerOptions['updateFileRecordById']) => Promise<
        FileRecordDto['FileRecordController/DEFAULT_FILERECORD']
    > = async(options) => {
        let _uri = '/api/file-record/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<FileRecordDto['FileRecordController/DEFAULT_FILERECORD']>;
    }
    
    /**
     * 上传文件
     * 
     * 上传新文件并创建文件记录，支持设置描述、可见性和密码保护
     * 需要登录验证
     * 
     * @parameter {FileRecordControllerOptions['uploadFile']} options
     * - insert 文件记录创建数据
     * - file 要上传的文件
     * @return FileRecord 创建的文件记录
     */
    readonly uploadFile: (options: FileRecordControllerOptions['uploadFile']) => Promise<
        FileRecordDto['FileRecordController/DEFAULT_FILERECORD']
    > = async(options) => {
        let _uri = '/api/file-record/files';
        const _formData = new FormData();
        const _body = options.body;
        _formData.append(
            "insert", 
            new Blob(
                [JSON.stringify(_body.insert)], 
                {type: "application/json"}
            )
        );
        _formData.append("file", _body.file);
        return (await this.executor({uri: _uri, method: 'POST', body: _formData})) as Promise<FileRecordDto['FileRecordController/DEFAULT_FILERECORD']>;
    }
}

export type FileRecordControllerOptions = {
    'getAllFileRecords': {
        /**
         * 页面索引（从0开始）
         */
        readonly pageIndex: number, 
        /**
         * 每页大小
         */
        readonly pageSize: number
    }, 
    'updateFileRecordById': {
        /**
         * 文件记录ID
         */
        readonly id: number, 
        /**
         * 文件记录更新数据
         */
        readonly body: FileRecordUpdate
    }, 
    'getFileRecordByShareCode': {
        /**
         * 文件分享码
         */
        readonly shareCode: string
    }, 
    'deleteFileRecordById': {
        /**
         * 要删除的文件记录ID
         */
        readonly id: number
    }, 
    'uploadFile': {
        readonly body: {
            readonly insert: FileRecordInsert, 
            readonly file: File
        }
    }, 
    'createDirectLink': {
        /**
         * 直链创建请求数据
         */
        readonly create: FileRecordDirectLinkCreate
    }
}
