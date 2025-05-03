import type {Executor} from '../';
import type {NoteDto} from '../model/dto/';
import type {NoteInsert, NoteUpdate} from '../model/static/';

export class NoteController {
    
    constructor(private executor: Executor) {}
    
    readonly deleteNoteById: (options: NoteControllerOptions['deleteNoteById']) => Promise<
        void
    > = async(options) => {
        let _uri = '/api/note/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    readonly getAllNotes: () => Promise<
        ReadonlyArray<NoteDto['NoteController/DEFAULT_NOTE']>
    > = async() => {
        let _uri = '/api/note';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<NoteDto['NoteController/DEFAULT_NOTE']>>;
    }
    
    readonly getNoteById: (options: NoteControllerOptions['getNoteById']) => Promise<
        NoteDto['NoteController/DEFAULT_NOTE']
    > = async(options) => {
        let _uri = '/api/note/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<NoteDto['NoteController/DEFAULT_NOTE']>;
    }
    
    readonly insertNote: (options: NoteControllerOptions['insertNote']) => Promise<
        NoteDto['NoteController/DEFAULT_NOTE']
    > = async(options) => {
        let _uri = '/api/note';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<NoteDto['NoteController/DEFAULT_NOTE']>;
    }
    
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
        readonly id: number
    }, 
    'insertNote': {
        readonly body: NoteInsert
    }, 
    'deleteNoteById': {
        readonly id: number
    }, 
    'updateNoteById': {
        readonly id: number, 
        readonly body: NoteUpdate
    }
}
