export const FileRecordVisibility_CONSTANTS = [
    'PUBLIC', 
    'PASSWORD', 
    'PRIVATE'
] as const;
export type FileRecordVisibility = typeof FileRecordVisibility_CONSTANTS[number];
