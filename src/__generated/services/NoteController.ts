import type {Executor} from '../';
import type {NoteDto} from '../model/dto/';
import type {NoteInsert, NoteUpdate} from '../model/static/';

/**
 * 笔记控制器
 * 
 * 处理笔记的增删改查操作，包括创建、查询、更新和删除笔记
 * 所有操作都需要登录验证
 */
export class NoteController {
    
    constructor(private executor: Executor) {}
    
    /**
     * 根据ID删除笔记
     * 
     * 删除指定ID的笔记
     * 需要登录验证
     * 
     * @parameter {NoteControllerOptions['deleteNoteById']} options
     * - id 要删除的笔记ID
     */
    readonly deleteNoteById: (options: NoteControllerOptions['deleteNoteById']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/note/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    /**
     * 获取所有笔记
     * 
     * 获取当前用户的所有笔记列表，按ID升序排列
     * 需要登录验证
     * 
     * @return List<Note> 笔记列表
     */
    readonly getAllNotes: () => Promise<
        ReadonlyArray<NoteDto['NoteController/DEFAULT_NOTE']>
    > = async() => {
        let _uri = '/api/note';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<NoteDto['NoteController/DEFAULT_NOTE']>>;
    }
    
    /**
     * 根据ID获取笔记
     * 
     * 获取指定ID的笔记详细信息
     * 需要登录验证
     * 
     * @parameter {NoteControllerOptions['getNoteById']} options
     * - id 笔记ID
     * @return Note 笔记对象
     */
    readonly getNoteById: (options: NoteControllerOptions['getNoteById']) => Promise<
        NoteDto['NoteController/DEFAULT_NOTE']
    > = async(options) => {
        let _uri = '/api/note/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<NoteDto['NoteController/DEFAULT_NOTE']>;
    }
    
    /**
     * 创建新笔记
     * 
     * 添加新的笔记到系统中
     * 需要登录验证
     * 
     * @parameter {NoteControllerOptions['insertNote']} options
     * - insert 笔记创建数据，包含标题、内容等信息
     * @return Note 创建的笔记对象
     */
    readonly insertNote: (options: NoteControllerOptions['insertNote']) => Promise<
        NoteDto['NoteController/DEFAULT_NOTE']
    > = async(options) => {
        let _uri = '/api/note';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<NoteDto['NoteController/DEFAULT_NOTE']>;
    }
    
    /**
     * 根据ID更新笔记
     * 
     * 更新指定ID的笔记信息，如标题、内容等
     * 需要登录验证
     * 
     * @parameter {NoteControllerOptions['updateNoteById']} options
     * - id 要更新的笔记ID
     * - update 笔记更新数据
     */
    readonly updateNoteById: (options: NoteControllerOptions['updateNoteById']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/note/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<void>;
    }
}

export type NoteControllerOptions = {
    'getAllNotes': {}, 
    'getNoteById': {
        /**
         * 笔记ID
         */
        readonly id: number
    }, 
    'insertNote': {
        /**
         * 笔记创建数据，包含标题、内容等信息
         */
        readonly body: NoteInsert
    }, 
    'deleteNoteById': {
        /**
         * 要删除的笔记ID
         */
        readonly id: number
    }, 
    'updateNoteById': {
        /**
         * 要更新的笔记ID
         */
        readonly id: number, 
        /**
         * 笔记更新数据
         */
        readonly body: NoteUpdate
    }
}
