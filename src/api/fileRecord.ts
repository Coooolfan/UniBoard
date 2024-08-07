import { axiosInstance } from './auth'

interface FileRecord {
    id: number
    file_name: string
    file: string | File
    desc: string
    permission: string
    password: string
    create_time: string
    share_code: string
    count: number
    loading: boolean
    local_create?: string
    processing: number
}

interface getFileRecordListAPI {
    count: number
    results: Array<FileRecord>
}

interface getFileRecordTokenAPI {
    file_id: string
    file_name: string
    token: string
}

const permissionMap = {
    private: '私有',
    public: '完全公开',
    password: '密码保护',
    1: '完全公开',
    2: '私有',
    3: '密码保护'
}

const defaultFileRecord: FileRecord = {
    id: -1,
    file_name: '',
    file: '',
    desc: '',
    permission: '2',
    share_code: '',
    password: '',
    loading: false,
    create_time: '',
    count: 0,
    processing: 0
}

async function getFileRecordList(page?: number, size?: number): Promise<getFileRecordListAPI> {
    if (page == undefined) page = 1
    if (size == undefined) size = 10
    const response = await axiosInstance.get<getFileRecordListAPI>('file-records/', {
        params: {
            page: page,
            size: size
        }
    })
    return response.data
}

async function postFileRecord(fileRecord: FileRecord): Promise<boolean> {
    try {
        const formData = new FormData()
        formData.append('file_name', fileRecord.file_name)
        formData.append('file', fileRecord.file)
        formData.append('desc', fileRecord.desc)
        formData.append('permission', fileRecord.permission)
        formData.append('password', fileRecord.password)
        const response = await axiosInstance.post('file-records/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            // 回调，用于更新上传进度
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total!
                )
                fileRecord.processing = percentCompleted
            }
        })
        return response.status.toString().startsWith('2')
    } catch (error) {
        console.error(`Error occurred while posting file record: ${error}`)
        throw error
    }
}

async function patchFileRecord(fileRecord: FileRecord) {
    try {
        const formData = new FormData()
        formData.append('file_name', fileRecord.file_name)
        formData.append('desc', fileRecord.desc)
        formData.append('permission', fileRecord.permission)
        formData.append('password', fileRecord.password)
        const response = await axiosInstance.patch(`/file-records/${fileRecord.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.status.toString().startsWith('2')
    } catch (error) {
        console.error(`Error occurred while patching file record: ${error}`)
        throw error
    }
}

async function deleteFileRecord(id: number): Promise<boolean> {
    let resp = await axiosInstance.delete(`/file-records/${id}`)
    return resp.status === 204
}

async function getFileRecordToken(id: number): Promise<getFileRecordTokenAPI> {
    const response = await axiosInstance.get<getFileRecordTokenAPI>(`/file-records/${id}/token/`)
    return response.data
}

export {
    getFileRecordList,
    postFileRecord,
    deleteFileRecord,
    patchFileRecord,
    getFileRecordToken,
    defaultFileRecord,
    permissionMap
}
export type { FileRecord }
