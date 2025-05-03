import type {Executor} from '../';

export class RedirectController {
    
    constructor(private executor: Executor) {}
    
    readonly redirect: (options: RedirectControllerOptions['redirect']) => Promise<
        void
    > = async(options) => {
        let _uri = '/s/';
        _uri += encodeURIComponent(options.shortUrlCode);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<void>;
    }
}

export type RedirectControllerOptions = {
    'redirect': {
        readonly shortUrlCode: string
    }
}
