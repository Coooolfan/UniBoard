import type {FileRecordVisibility} from '../enums/';
import type {FileRecordUpdate_TargetOf_file} from './';

export interface FileRecordUpdate {
    readonly file: FileRecordUpdate_TargetOf_file;
    readonly visibility: FileRecordVisibility;
    readonly description: string;
    readonly password: string;
}
