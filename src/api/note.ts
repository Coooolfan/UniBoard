import { BeautyLocalTime } from '@/assets/utils/BeautyDate'
import { axiosInstance, refreshAccessToken } from './auth'

interface Note {
    title: string
    value: string
    insert_time: string
    update_time: string
    id: number
    loading: boolean
}

const defaultNote: Note = {
    title: '',
    value: '',
    insert_time: '',
    update_time: '',
    id: -1,
    loading: false
}

interface NoteList {
    results: Array<{
        title: string
        insert_time: string
        update_time: string
        id: number
    }>
    count: number
}

async function getNoteList(): Promise<NoteList> {
    let resp = await axiosInstance.get('/note/')
    return resp.data
}

async function getNoteDetail(id: number): Promise<Note> {
    let resp = await axiosInstance.get(`/note/${id}/`)
    return resp.data
}

async function addNote(note: Note): Promise<Note> {
    let resp = await axiosInstance.post('/note/', note)
    return resp.data
}

async function postNoteDetail(title: string, value: string): Promise<Note> {
    if (title === '') title = 'Untitled ' + BeautyLocalTime()
    if (value === '' || value === `\n`) value = 'Empty note ' + BeautyLocalTime()
    let newNote = {
        title: title,
        value: value
    }
    let resp = await axiosInstance.post('/note/', newNote)
    let data = resp.data
    data.loading = false
    return data
}

async function patchNoteDetail(id: number, title: string, value: string): Promise<Note> {
    if (title === '') title = 'Untitled ' + BeautyLocalTime()
    if (value === '' || value === `\n`) value = 'Empty note ' + BeautyLocalTime()
    let newNote = {
        title: title,
        value: value
    }
    let resp = await axiosInstance.patch(`/note/${id}/`, newNote)
    let data = resp.data
    data.loading = false
    return data
}

async function postNoteFileDetail(file: File[]): Promise<string> {
    try {
        const formData = new FormData()
        // formData = FormData.append("file[]", File)
        for (let i = 0; i < file.length; i++) {
            formData.append('file[]', file[i])
        }
        await refreshAccessToken()
        const resp = await axiosInstance.post('note-files/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return resp.data
    } catch (error) {
        console.error(`Error occurred while uploading file: ${error}`)
        return `Error occurred while uploading file: ${error}`
    }
}

async function deleteNoteDetail(id: number): Promise<boolean> {
    let resp = await axiosInstance.delete(`/note/${id}`)
    return resp.status === 204
}

export {
    getNoteList,
    getNoteDetail,
    addNote,
    patchNoteDetail,
    deleteNoteDetail,
    postNoteDetail,
    postNoteFileDetail,
    defaultNote
}
export type { Note, NoteList }
