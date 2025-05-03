import type {ProfileContacts} from './';

export interface ProfileUpdate {
    readonly name: string;
    readonly slogan: string;
    readonly description: string;
    readonly contacts: ProfileContacts;
}
