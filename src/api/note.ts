import { axiosInstance } from './auth'

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
    if (title === '') title = 'Untitled ' + new Date().getTime()
    if (value === '' || value === `\n`) value = 'Empty note ' + new Date().getTime()
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
    if (title === '') title = 'Untitled ' + new Date().getTime()
    if (value === '' || value === `\n`) value = 'Empty note ' + new Date().getTime()
    let newNote = {
        title: title,
        value: value
    }
    let resp = await axiosInstance.patch(`/note/${id}/`, newNote)
    let data = resp.data
    data.loading = false
    return data
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
    defaultNote
}
export type { Note, NoteList }
