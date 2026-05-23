<script setup lang="ts">
import { inject, onMounted, ref, watch, computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Password from 'primevue/password'
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
import { useToast } from 'primevue/usetoast'
const confirm = useConfirm()
const toast = useToast()
const editNote = ref<NoteDto['NoteController/DEFAULT_NOTE']>({
    id: -1,
    title: '',
    content: ''
})
const notePasswordInput = ref('')
const editNoteLoading = ref(false)
const passwordDialogVisible = ref(false)
const vditor = ref<Vditor>()
const vditorLoading = ref(true)
const selectedKey = ref<TreeSelectionKeys>([])
const treeNode = ref<TreeNode[]>([])

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

const notePlainTextLink = computed(() => {
    const password = notePasswordInput.value.trim()
    if (editNote.value.id === -1 || password.length === 0) return ''

    return `${window.location.origin}/api/note/${editNote.value.id}?pw=${encodeURIComponent(password)}`
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
                path: ""
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
    treeNode.value = noteList.map((note) => {
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
    notePasswordInput.value = ''
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

function getPasswordPayload(): string | undefined {
    const password = notePasswordInput.value.trim()
    if (password.length > 0 && password.length <= 8) {
        toast.add({ severity: 'error', summary: '密码太短', detail: '笔记分享密码长度必须大于 8。', life: 3000 })
        return undefined
    }
    if (password.length > 8) return password

    return ''
}

async function savePasswordConfig() {
    if (editNote.value.id === -1) return

    const password = getPasswordPayload()
    if (password === undefined) return

    editNoteLoading.value = true
    await api.noteController.updateNoteById({
        id: editNote.value.id,
        body: {
            password
        }
    })
    editNoteLoading.value = false
    passwordDialogVisible.value = false
    notePasswordInput.value = ''

    toast.add({
        severity: 'success',
        summary: password.length === 0 ? '已设为私有' : '分享密码已更新',
        life: 3000
    })
}

async function copyPlainTextLink() {
    if (notePlainTextLink.value.length === 0) return

    await navigator.clipboard.writeText(notePlainTextLink.value)
    toast.add({ severity: 'success', summary: '已复制', detail: '笔记纯文本直链已复制到剪贴板。', life: 3000 })
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
    notePasswordInput.value = ''
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
    notePasswordInput.value = ''
    vditor.value?.setValue('')
}
</script>
<template>
    <ConfirmPopup></ConfirmPopup>
    <Dialog v-model:visible="passwordDialogVisible" modal header="分享密码" :style="{ width: '28rem' }">
        <div class="flex flex-col gap-4">
            <p class="text-sm leading-6 text-neutral-500">
                设置长度大于 8 的密码后，匿名用户可通过 <span class="font-mono">/api/note/{{ editNote.id }}?pw=...</span> 获取纯文本内容。
            </p>
            <Password
                v-model="notePasswordInput"
                :feedback="false"
                placeholder="留空保存为私有"
                toggleMask
                fluid />
            <div v-if="notePlainTextLink" class="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-800">
                <p class="mb-2 text-xs text-neutral-500">纯文本直链</p>
                <div class="flex items-center gap-2">
                    <span class="min-w-0 flex-1 truncate font-mono text-sm">{{ notePlainTextLink }}</span>
                    <Button class="shrink-0" icon="pi pi-copy" text @click="copyPlainTextLink" />
                </div>
            </div>
            <p class="text-xs text-neutral-400">
                留空保存会清空分享密码，并将笔记设为私有。
            </p>
        </div>
        <template #footer>
            <Button label="取消" text severity="secondary" @click="passwordDialogVisible = false" />
            <Button label="保存" :loading="editNoteLoading" @click="savePasswordConfig" />
        </template>
    </Dialog>
    <div class="flex min-h-[74vh] items-start justify-start transition-all duration-300">
        <div class="flex h-4/5 w-80 flex-col">
            <p v-show="treeNode.length === 0">试着在笔记内容随便输入些什么</p>
            <Tree v-show="treeNode.length > 0" :value="treeNode" v-model:selectionKeys="selectedKey" selectionMode="single" :pt="{ nodeToggleButton: 'hidden!' }" />
        </div>
        <div class="w-full">
            <div class="flex items-center justify-between">
                <input
                    class="ml-1 w-4/5 border-b-[1px] text-xl font-bold outline-hidden focus:border-black focus:outline-hidden"
                    v-model="editNote.title" />
                <div>
                    <Button class="h-10 w-8" :icon="uploadButtonIcon" text @click="uploadEvent()" />
                    <Button class="h-10 w-8" v-show="editNote.id !== -1" :icon="'pi pi-lock'" text @click="passwordDialogVisible = true" />
                    <Button class="h-10 w-8" v-show="editNote.id !== -1" severity="danger" :icon="'pi pi-trash'" text
                        @click="confirmDelete($event, editNote.id)" />
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
