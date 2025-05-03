import type {Executor} from '../';
import type {HyperLinkDto} from '../model/dto/';
import type {HyperLinkInsert, HyperLinkUpdate} from '../model/static/';

export class HyperLinkController {
    
    constructor(private executor: Executor) {}
    
    readonly deleteHyperLinkById: (options: HyperLinkControllerOptions['deleteHyperLinkById']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/hyper-link/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    readonly getAllHyperLinks: () => Promise<
        ReadonlyArray<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>
    > = async() => {
        let _uri = '/api/hyper-link';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>>;
    }
    
    readonly insertHyperlink: (options: HyperLinkControllerOptions['insertHyperlink']) => Promise<
        HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']
    > = async(options) => {
        let _uri = '/api/hyper-link/';
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
        return (await this.executor({uri: _uri, method: 'POST', body: _formData})) as Promise<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>;
    }
    
    readonly updateHyperLinkById: (options: HyperLinkControllerOptions['updateHyperLinkById']) => Promise<
        HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']
    > = async(options) => {
        let _uri = '/api/hyper-link/';
        _uri += encodeURIComponent(options.id);
        const _formData = new FormData();
        const _body = options.body;
        _formData.append(
            "update", 
            new Blob(
                [JSON.stringify(_body.update)], 
                {type: "application/json"}
            )
        );
        if (_body.file) {
            _formData.append("file", _body.file);
        }
        return (await this.executor({uri: _uri, method: 'PUT', body: _formData})) as Promise<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>;
    }
}

export type HyperLinkControllerOptions = {
    'getAllHyperLinks': {}, 
    'insertHyperlink': {
        readonly body: {
            readonly insert: HyperLinkInsert, 
            readonly file: File
        }
    }, 
    'updateHyperLinkById': {
        readonly id: number, 
        readonly body: {
            readonly update: HyperLinkUpdate, 
            readonly file?: File | undefined
        }
    }, 
    'deleteHyperLinkById': {
        readonly id: number
    }
}
