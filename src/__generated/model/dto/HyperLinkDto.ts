import type {BaseSimpleFile} from '../embeddable/';

export type HyperLinkDto = {
    'HyperLinkController/DEFAULT_HYPER_LINK': {
        readonly id: number;
        readonly title: string;
        readonly description: string;
        readonly url: string;
        readonly color: string;
        readonly icon: BaseSimpleFile;
        readonly public: boolean;
        readonly sort: number;
    }
}
