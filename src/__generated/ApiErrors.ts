export type AllErrors = {
        family: 'FILE_RECORD', 
        code: 'EMPTY_PASSWORD'
    } | {
        family: 'HYPER_LINK', 
        code: 'UPDATE_SORT_FAILED'
    } | {
        family: 'HYPER_LINK', 
        code: 'FETCH_SNAPSHOT_FAILED'
    } | {
        family: 'COMMON', 
        code: 'NOT_FOUND'
    } | {
        family: 'PROFILE', 
        code: 'SYSTEM_UNINITIALIZED'
    } | {
        family: 'PROFILE', 
        code: 'SYSTEM_ALREADY_INITIALIZED'
    } | {
        family: 'PROFILE', 
        code: 'EMPTY_LOGIN_NAME'
    } | {
        family: 'PROFILE', 
        code: 'EMPTY_NAME'
    } | {
        family: 'COMMON', 
        code: 'FORBIDDEN'
    } | {
        family: 'COMMON', 
        code: 'AUTHENTICATION_FAILED'
    };
export type ApiErrors = {
    'fileController': {
    }, 
    'fileRecordController': {
        'updateFileRecordById': AllErrors & ({
                family: 'FILE_RECORD', 
                code: 'EMPTY_PASSWORD', 
                readonly [key:string]: any
            }), 
        'uploadFile': AllErrors & ({
                family: 'FILE_RECORD', 
                code: 'EMPTY_PASSWORD', 
                readonly [key:string]: any
            })
    }, 
    'hyperLinkController': {
        'updateHyperLinkSort': AllErrors & ({
                family: 'HYPER_LINK', 
                code: 'UPDATE_SORT_FAILED', 
                readonly [key:string]: any
            }), 
        'insertHyperLinkBySnapshot': AllErrors & ({
                family: 'HYPER_LINK', 
                code: 'FETCH_SNAPSHOT_FAILED', 
                readonly [key:string]: any
            })
    }, 
    'noteController': {
        'getNoteById': AllErrors & ({
                family: 'COMMON', 
                code: 'NOT_FOUND', 
                readonly [key:string]: any
            })
    }, 
    'profileController': {
        'getProfile': AllErrors & ({
                family: 'PROFILE', 
                code: 'SYSTEM_UNINITIALIZED', 
                readonly [key:string]: any
            }), 
        'createProfile': AllErrors & ({
                family: 'PROFILE', 
                code: 'SYSTEM_ALREADY_INITIALIZED', 
                readonly [key:string]: any
            } | {
                family: 'PROFILE', 
                code: 'EMPTY_LOGIN_NAME', 
                readonly [key:string]: any
            } | {
                family: 'PROFILE', 
                code: 'EMPTY_NAME', 
                readonly [key:string]: any
            }), 
        'updateProfile': AllErrors & ({
                family: 'PROFILE', 
                code: 'SYSTEM_UNINITIALIZED', 
                readonly [key:string]: any
            } | {
                family: 'PROFILE', 
                code: 'EMPTY_NAME', 
                readonly [key:string]: any
            }), 
        'updatePassword': AllErrors & ({
                family: 'PROFILE', 
                code: 'SYSTEM_UNINITIALIZED', 
                readonly [key:string]: any
            } | {
                family: 'PROFILE', 
                code: 'EMPTY_LOGIN_NAME', 
                readonly [key:string]: any
            } | {
                family: 'COMMON', 
                code: 'FORBIDDEN', 
                readonly [key:string]: any
            })
    }, 
    'redirectController': {
    }, 
    'shortUrlController': {
    }, 
    'systemConfigController': {
    }, 
    'tokenController': {
        'getToken': AllErrors & ({
                family: 'COMMON', 
                code: 'AUTHENTICATION_FAILED', 
                readonly [key:string]: any
            })
    }
};
