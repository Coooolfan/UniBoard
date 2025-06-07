<script setup lang="ts">
import { inject, onMounted, ref, watch, computed } from 'vue'
import Button from 'primevue/button'
import Vditor from 'vditor'
import ConfirmPopup from 'primevue/confirmpopup'
import Tree, { type TreeSelectionKeys } from 'primevue/tree'
import 'vditor/dist/index.css'
import ProgressSpinner from 'primevue/progressspinner'
import type { TreeNode } from 'primevue/treenode'
import { useConfirm } from 'primevue/useconfirm'
import { api } from '@/ApiInstance'
import type { NoteDto } from '@/__generated/model/dto'
import { BeautyLocalTime } from '@/utils/BeautyDate'
const confirm = useConfirm()
const editNote = ref<NoteDto['NoteController/DEFAULT_NOTE']>({
    id: -1,
    title: '',
    content: ''
})
const editNoteLoading = ref(false)
const vditor = ref<Vditor>()
const vditorLoading = ref(true)
const selectedKey = ref<TreeSelectionKeys>([])
const treeNode = ref<TreeNode[]>([
    {
        key: '-1',
        label: '默认文件夹',
        children: []
    }
])

// 使用计算属性处理按钮图标逻辑
const uploadButtonIcon = computed(() => {
    if (editNoteLoading.value) {
        return 'pi pi-spin pi-spinner'
    } else if (editNote.value.id === -1) {
        return 'pi pi-cloud-upload'
    } else {
        return 'pi pi-check'
    }
})

onMounted(() => {
    refreshTree()
    vditor.value = new Vditor('vditor', {
        placeholder:
            'UniBoard 使用 Vditor 作为 MarkDown 编辑器。 \nVditor 是一款浏览器端的 Markdown 编辑器，支持所见即所得（富文本）、即时渲染（类似 Typora ）和分屏预览模式',
        input: (value: string) => {
            uploadEvent(value)
        },
        counter: {
            enable: true
        },
        cache: {
            enable: false
        },
        after: () => {
            vditorLoading.value = false
            setTheme()
        },
        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'classic',
        minHeight: 500,
        cdn: '',
        upload: {
            url: '/file/note',
            format: (files: File[], responseText: string) => {
                let resp = JSON.parse(responseText) as {
                    originalFilename: string
                    url: string
                }[]
                let targetResp = {
                    msg: '',
                    code: 0,
                    data: {
                        errFiles: [],
                        succMap: {} as Record<string, string>
                    }
                }
                for (const notePicture of resp) {
                    targetResp.data.succMap[notePicture.originalFilename] = notePicture.url
                }
                return JSON.stringify(targetResp)
            }
        },
        preview: {
            theme: {
                current: 'dark',
                path:""
            }
        }
    })
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        setTheme()
    })
})

async function setTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        vditor.value?.setTheme('dark', 'dark', 'dark', '/dist/css/content-theme')
    } else {
        vditor.value?.setTheme('classic', 'light', 'light', '/dist/css/content-theme')
    }
}

async function refreshTree() {
    const noteList = await api.noteController.getAllNotes()
    treeNode.value[0].children = noteList.map((note) => {
        return {
            key: note.id?.toString() ?? '',
            label: note.title
        }
    })
}

const dialogRef: any = inject('dialogRef')

const closeDialog = () => {
    dialogRef.value.close()
}

watch(selectedKey, async (newVal) => {
    let selectedId = -1
    for (const key in newVal)
        if (newVal.hasOwnProperty(key) && newVal[key] === true) {
            selectedId = parseInt(key)
            break
        }
    if (selectedId === -1) return

    editNoteLoading.value = true
    editNote.value = await api.noteController.getNoteById({
        id: selectedId
    })
    vditor.value?.setValue(editNote.value?.content ?? '')
    editNoteLoading.value = false
})
async function uploadEvent(value?: string) {
    if (value === undefined || value === null) {
        value = vditor.value?.getValue() ?? ''
    }
    // 空值不上传
    if (value === undefined || value.trim().length === 0) return

    let noteTitle = editNote.value.title
    if (noteTitle.trim().length === 0) {
        noteTitle = '未命名 ' + BeautyLocalTime()
    }
    // 新建
    if (editNote.value?.id === -1) {
        editNoteLoading.value = true
        const resp = await api.noteController.insertNote({
            body: {
                content: value,
                title: noteTitle
            }
        })
        editNoteLoading.value = false
        editNote.value = {
            ...editNote.value,
            id: resp.id,
            title: resp.title
        }
        refreshTree()
    } else if (editNote.value) {
        // 修改
        editNoteLoading.value = true
        await api.noteController.updateNoteById({
            id: editNote.value.id,
            body: {
                content: value,
                title: noteTitle
            }
        })
        editNote.value = {
            ...editNote.value,
            content: value,
            title: noteTitle
        }
        editNoteLoading.value = false
        refreshTree()
    }
}

async function deleteHandler(index: number) {
    await api.noteController.deleteNoteById({
        id: index
    })
    editNote.value = {
        id: -1,
        title: '',
        content: ''
    }
    vditor.value?.setValue('')
    refreshTree()
}

function confirmDelete(event: any, index: number) {
    confirm.require({
        target: event.currentTarget,
        message: '删除此文章吗？\n操作不可逆！',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: '取消',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: '删除',
            severity: 'danger'
        },
        accept: async () => {
            deleteHandler(index)
        }
    })
}
async function newNote() {
    await uploadEvent('')
    editNote.value = {
        id: -1,
        title: '',
        content: ''
    }
    vditor.value?.setValue('')
}
</script>
<template>
    <ConfirmPopup></ConfirmPopup>
    <div
        class="flex min-h-[74vh] items-start justify-start transition-all duration-300"
    >
        <div class="flex h-4/5 w-80 flex-col">
            <Tree
                :value="treeNode"
                v-model:selectionKeys="selectedKey"
                selectionMode="single"
            ></Tree>
        </div>
        <div class="w-full">
            <div class="flex items-center justify-between">
                <input
                    class="ml-1 w-4/5 border-b-[1px] text-xl font-bold outline-hidden focus:border-black focus:outline-hidden"
                    v-model="editNote.title"
                />
                <div>
                    <Button class="h-10 w-8" :icon="uploadButtonIcon" text @click="uploadEvent()" />
                    <Button
                        class="h-10 w-8"
                        v-show="editNote.id !== -1"
                        severity="danger"
                        :icon="'pi pi-trash'"
                        text
                        @click="confirmDelete($event, editNote.id)"
                    />
                    <Button :icon="'pi pi-plus'" text class="mr-4 ml-auto" @click="newNote" />
                </div>
            </div>
            <div v-show="vditorLoading" class="flex flex-col items-center justify-center pt-8">
                <ProgressSpinner />
                <p class="mt-8">等待编辑器组件加载……</p>
            </div>
            <div v-show="!vditorLoading" id="vditor"></div>
        </div>
    </div>
    <Button @click="closeDialog" label="关闭" />
</template>
