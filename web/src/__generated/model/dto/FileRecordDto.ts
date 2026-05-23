import type {BaseSimpleFile} from '../embeddable/';
import type {FileRecordVisibility} from '../enums/';

export type FileRecordDto = {
    'FileRecordController/DEFAULT_FILERECORD': {
        readonly id: number;
        readonly file: BaseSimpleFile;
        readonly shareCode: string;
        readonly description: string;
        readonly visibility: FileRecordVisibility;
        readonly password: string;
        readonly downloadCount: number;
    }
}
