<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import Button from 'primevue/button'
import Vditor from 'vditor'
import ConfirmPopup from 'primevue/confirmpopup'
import Tree, { type TreeSelectionKeys } from 'primevue/tree'
import 'vditor/dist/index.css'
import ProgressSpinner from 'primevue/progressspinner'
import type { TreeNode } from 'primevue/treenode'
import {
    defaultNote,
    deleteNoteDetail,
    getNoteDetail,
    getNoteList,
    patchNoteDetail,
    postNoteDetail,
    type Note
} from '@/api/note'
import { useConfirm } from 'primevue/useconfirm'
import { getAccessToken } from '@/api/auth'
const confirm = useConfirm()
const editNote = ref<Note>(structuredClone(defaultNote))
const vditor = ref<Vditor>()
const vditorLoading = ref(true)
const selectedKey = ref<TreeSelectionKeys>([])
// const loadingLabel = computed(() => (editNote.value.loading ? 'Loading...' : 'Saved'))
const treeNode = ref<TreeNode[]>([
    {
        key: '-1',
        label: '默认文件夹',
        children: []
    }
])
onMounted(() => {
    refreshTree()
    vditor.value = new Vditor('vditor', {
        placeholder:
            'UniBoard 使用 Vditor 作为 MarkDown 编辑器。 \nVditor 是一款浏览器端的 Markdown 编辑器，支持所见即所得（富文本）、即时渲染（类似 Typora ）和分屏预览模式',
        input: (value: string) => {
            uploadEvent()
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
            url: '/api/note-files/',
            setHeaders: () => {
                const str = `Bearer ${getAccessToken()}`
                console.log(str)
                return {
                    Authorization: str
                }
            }
        }
    })
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        setTheme()
    })
})

async function setTheme() {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'classic'
    vditor.value?.setTheme(theme, theme, theme)
}

async function refreshTree() {
    const noteList = (await getNoteList()).results
    treeNode.value[0].children = noteList.map((note) => {
        return {
            key: note.id.toString(),
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

    editNote.value.loading = true
    editNote.value = await getNoteDetail(selectedId)
    vditor.value?.setValue(editNote.value.value)
})
async function uploadEvent() {
    let value = vditor.value?.getValue()
    // 空值不上传
    if (value === undefined || value === `\n`) return
    // 新建
    if (editNote.value.id === -1) {
        editNote.value.loading = true
        let resp = await postNoteDetail(editNote.value.title, value)
        editNote.value.loading = false
        editNote.value.id = resp.id
        editNote.value.title = resp.title
        refreshTree()
    } else {
        // 修改
        editNote.value.loading = true
        await patchNoteDetail(editNote.value.id, editNote.value.title, value)
        editNote.value.loading = false
        refreshTree()
    }
}

async function deleteHandler(index: number) {
    await deleteNoteDetail(index)
    editNote.value = structuredClone(defaultNote)
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
    await uploadEvent()
    editNote.value = structuredClone(defaultNote)
    vditor.value?.setValue('')
}
</script>
<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="min-w-[80vw] min-h-[74vh] flex items-start justify-start">
        <div class="w-80 h-4/5 flex flex-col">
            <Tree
                :value="treeNode"
                v-model:selectionKeys="selectedKey"
                selectionMode="single"
            ></Tree>
        </div>
        <div class="w-full">
            <div class="flex justify-between items-center">
                <input
                    class="font-bold outline-hidden text-xl border-b-[1px] ml-1 w-4/5 focus:border-black focus:outline-hidden"
                    v-model="editNote.title"
                />
                <div>
                    <Button
                        class="h-10 w-8"
                        :icon="
                            editNote.loading
                                ? 'pi pi-spin pi-spinner'
                                : editNote.id === -1
                                  ? 'pi pi-cloud-upload'
                                  : 'pi pi-check'
                        "
                        text
                        @click="uploadEvent()"
                    />
                    <Button
                        class="h-10 w-8"
                        v-show="editNote.id !== -1"
                        severity="danger"
                        :icon="'pi pi-trash'"
                        text
                        @click="confirmDelete($event, editNote.id)"
                    />
                    <Button :icon="'pi pi-plus'" text class="ml-auto mr-4" @click="newNote" />
                </div>
            </div>
            <div v-show="vditorLoading" class="flex flex-col justify-center items-center pt-8">
                <ProgressSpinner />
                <p class="mt-8">等待编辑器组件加载……</p>
            </div>

            <div v-show="!vditorLoading" id="vditor"></div>
        </div>
    </div>
    <Button @click="closeDialog" label="关闭" />
</template>
