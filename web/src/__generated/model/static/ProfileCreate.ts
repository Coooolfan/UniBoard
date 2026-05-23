import type {ProfileContacts} from './';

export interface ProfileCreate {
    readonly name: string;
    readonly slogan: string;
    readonly description: string;
    readonly contacts: ProfileContacts;
    readonly loginName: string;
    readonly loginPassword: string;
}
