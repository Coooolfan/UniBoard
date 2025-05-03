import type {BaseSimpleFile} from '../embeddable/';
import type {FileRecordVisibility} from '../enums/';

export interface FileRecordPublic {
    readonly file: BaseSimpleFile;
    readonly shareCode: string;
    readonly description: string;
    readonly visibility: FileRecordVisibility;
}
