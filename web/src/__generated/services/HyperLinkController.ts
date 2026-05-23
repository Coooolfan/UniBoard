import type {Executor} from '../';
import type {HyperLinkDto} from '../model/dto/';
import type {
    HyperLinkInsert, 
    HyperLinkInsertBySnapShot, 
    HyperLinkOrderUpdate, 
    HyperLinkUpdate
} from '../model/static/';

/**
 * 超链接控制器
 * 
 * 处理超链接的管理操作，包括创建、查询、更新和删除超链接，支持为超链接添加图片
 */
export class HyperLinkController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 根据ID删除超链接
     * 
     * 删除指定的超链接及其关联的图片文件
     * 需要登录验证
     * 
     * @parameter {HyperLinkControllerOptions['deleteHyperLinkById']} options
     * - id 要删除的超链接ID
     */
    readonly deleteHyperLinkById: (options: HyperLinkControllerOptions['deleteHyperLinkById']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/hyper-link/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    /**
     * 获取所有超链接
     * 
     * 获取系统中所有的超链接列表，用于展示在首页或超链接管理页面
     * 
     * 未登陆状态下只返回公开的超链接
     * 
     * @return List<HyperLink> 超链接列表
     */
    readonly getAllHyperLinks: () => Promise<
        ReadonlyArray<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>
    > = async() => {
        let _uri = '/api/hyper-link';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>>;
    }
    
    /**
     * 仅使用URL创建新的超链接
     * 
     * 根据提供的URL获取超链接的快照信息，包括标题、描述、缩略图
     * 此方法不需要上传图片文件，直接从URL获取快照
     * 需要登录验证
     * 
     * @parameter {HyperLinkControllerOptions['insertHyperLinkBySnapshot']} options
     * - insert 要获取快照的超链接URL
     * @return HyperLink 创建的超链接对象
     */
    readonly insertHyperLinkBySnapshot: (options: HyperLinkControllerOptions['insertHyperLinkBySnapshot']) => Promise<
        HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']
    > = async(options) => {
        let _uri = '/api/hyper-link/snapshot';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>;
    }
    
    /**
     * 创建新的超链接
     * 
     * 添加新的超链接到系统中，需要提供链接信息和关联的图片文件
     * 需要登录验证
     * 
     * @parameter {HyperLinkControllerOptions['insertHyperlink']} options
     * - insert 超链接创建数据，包含标题、URL、描述等信息
     * - file 超链接关联的图片文件（必需）
     * @return HyperLink 创建的超链接对象
     */
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
    
    /**
     * 根据ID更新超链接
     * 
     * 更新指定的超链接信息，可以修改标题、URL、描述等，也可以更新关联的图片
     * 需要登录验证
     * 
     * @parameter {HyperLinkControllerOptions['updateHyperLinkById']} options
     * - id 要更新的超链接ID
     * - update 超链接更新数据
     * - file 可选的新图片文件，如果不提供则保持原有图片
     * @return HyperLink 更新后的超链接对象
     */
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
    
    readonly updateHyperLinkSort: (options: HyperLinkControllerOptions['updateHyperLinkSort']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/hyper-link/sort';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<void>;
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
        /**
         * 要更新的超链接ID
         */
        readonly id: number, 
        readonly body: {
            readonly update: HyperLinkUpdate, 
            readonly file?: File | undefined
        }
    }, 
    'updateHyperLinkSort': {
        readonly body: ReadonlyArray<HyperLinkOrderUpdate>
    }, 
    'deleteHyperLinkById': {
        /**
         * 要删除的超链接ID
         */
        readonly id: number
    }, 
    'insertHyperLinkBySnapshot': {
        /**
         * 要获取快照的超链接URL
         */
        readonly body: HyperLinkInsertBySnapShot
    }
}
