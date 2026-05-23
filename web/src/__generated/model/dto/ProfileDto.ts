import type {BaseSimpleFile} from '../embeddable/';
import type {ProfileContacts} from '../static/';

export type ProfileDto = {
    'ProfileController/PUBLIC_PROFILE': {
        readonly id: number;
        readonly name: string;
        readonly description: string;
        readonly slogan: string;
        readonly contacts: ProfileContacts;
        readonly customFont?: BaseSimpleFile | undefined;
        readonly avatar: BaseSimpleFile;
        readonly banner: BaseSimpleFile;
    }
}
