<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import Button from 'primevue/button'
import Vditor from 'vditor'
import ConfirmPopup from 'primevue/confirmpopup'
import Tree, { type TreeSelectionKeys } from 'primevue/tree'
import 'vditor/dist/index.css'
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
const confirm = useConfirm()
const editNote = ref<Note>(structuredClone(defaultNote))
const vditor = ref<Vditor>()
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
        height: '68vh'
    })
})

async function refreshTree() {
    const noteList = await (await getNoteList()).results
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
    <div class="w-[80vw] h-[75vh] flex items-start justify-start">
        <div class="w-80 h-4/5 flex flex-col">
            <Button :icon="'pi pi-plus'" text class="ml-auto mr-4" @click="newNote" />
            <Tree
                :value="treeNode"
                v-model:selectionKeys="selectedKey"
                selectionMode="single"
            ></Tree>
        </div>
        <div class="w-full">
            <div class="flex justify-between items-center">
                <input
                    class="font-bold outline-none text-xl border-b-[1px] ml-1 w-80 transition-all focus:border-black focus:outline-none"
                    v-model="editNote.title"
                />
                <div>
                    <Button
                        :icon="editNote.id === -1 ? 'pi pi-cloud-upload' : 'pi pi-check'"
                        :loading="editNote.loading"
                        text
                        @click="uploadEvent()"
                    />
                    <Button
                        v-show="editNote.id !== -1"
                        severity="danger"
                        :icon="'pi pi-trash'"
                        text
                        @click="confirmDelete($event, editNote.id)"
                    />
                </div>
            </div>
            <div id="vditor"></div>
        </div>
    </div>
    <Button @click="closeDialog" label="Close" />
</template>
