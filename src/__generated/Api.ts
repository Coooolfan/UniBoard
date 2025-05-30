import type {Executor} from './';
import {
    FileController, 
    FileRecordController, 
    HyperLinkController, 
    NoteController, 
    ProfileController, 
    RedirectController, 
    ShortUrlController, 
    SystemConfigController, 
    TokenController
} from './services/';

export class Api {
    
    readonly fileController: FileController
    
    readonly fileRecordController: FileRecordController
    
    readonly hyperLinkController: HyperLinkController
    
    readonly noteController: NoteController
    
    readonly profileController: ProfileController
    
    readonly redirectController: RedirectController
    
    readonly shortUrlController: ShortUrlController
    
    readonly systemConfigController: SystemConfigController
    
    readonly tokenController: TokenController
    
    constructor(executor: Executor) {
        this.fileController = new FileController(executor);
        this.fileRecordController = new FileRecordController(executor);
        this.hyperLinkController = new HyperLinkController(executor);
        this.noteController = new NoteController(executor);
        this.profileController = new ProfileController(executor);
        this.redirectController = new RedirectController(executor);
        this.shortUrlController = new ShortUrlController(executor);
        this.systemConfigController = new SystemConfigController(executor);
        this.tokenController = new TokenController(executor);
    }
}