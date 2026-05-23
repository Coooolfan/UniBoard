import type {FileRecordVisibility} from '../enums/';
import type {FileRecordInsert_TargetOf_file} from './';

export interface FileRecordInsert {
    readonly file: FileRecordInsert_TargetOf_file;
    readonly visibility: FileRecordVisibility;
    readonly description: string;
    readonly password: string;
}
