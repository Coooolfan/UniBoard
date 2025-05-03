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

export class FileRecordController {
    
    constructor(private executor: Executor) {}
    
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
    
    readonly deleteFileRecordById: (options: FileRecordControllerOptions['deleteFileRecordById']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/file-record/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
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
     */
    readonly getFileRecordByShareCode: (options: FileRecordControllerOptions['getFileRecordByShareCode']) => Promise<
        FileRecordPublic
    > = async(options) => {
        let _uri = '/api/file-record/';
        _uri += encodeURIComponent(options.shareCode);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<FileRecordPublic>;
    }
    
    readonly updateFileRecordById: (options: FileRecordControllerOptions['updateFileRecordById']) => Promise<
        FileRecordDto['FileRecordController/DEFAULT_FILERECORD']
    > = async(options) => {
        let _uri = '/api/file-record/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<FileRecordDto['FileRecordController/DEFAULT_FILERECORD']>;
    }
    
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
        readonly pageIndex: number, 
        readonly pageSize: number
    }, 
    'updateFileRecordById': {
        readonly id: number, 
        readonly body: FileRecordUpdate
    }, 
    'getFileRecordByShareCode': {
        readonly shareCode: string
    }, 
    'deleteFileRecordById': {
        readonly id: number
    }, 
    'uploadFile': {
        readonly body: {
            readonly insert: FileRecordInsert, 
            readonly file: File
        }
    }, 
    'createDirectLink': {
        readonly create: FileRecordDirectLinkCreate
    }
}
