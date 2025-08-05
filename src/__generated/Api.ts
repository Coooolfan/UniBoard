import type {Executor} from './';
import {
    FileController, 
    FileRecordController, 
    HyperLinkController, 
    NoteController, 
    ProbeController, 
    ProbeDataController, 
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
    
    readonly probeController: ProbeController
    
    readonly probeDataController: ProbeDataController
    
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
        this.probeController = new ProbeController(executor);
        this.probeDataController = new ProbeDataController(executor);
        this.profileController = new ProfileController(executor);
        this.redirectController = new RedirectController(executor);
        this.shortUrlController = new ShortUrlController(executor);
        this.systemConfigController = new SystemConfigController(executor);
        this.tokenController = new TokenController(executor);
    }
}