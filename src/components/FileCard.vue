<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import DataTable, { type DataTablePageEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import { useToast } from 'primevue/usetoast'
import ConfirmPopup from 'primevue/confirmpopup'
import Dialog from 'primevue/dialog'
import RadioButton from 'primevue/radiobutton'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import { useConfirm } from 'primevue/useconfirm'
import {
    defaultFileRecord,
    getFileRecordList,
    postFileRecord,
    permissionMap,
    type FileRecord,
    deleteFileRecord,
    patchFileRecord
} from '@/api/fileRecord'
import LabelAndInput from './LabelAndInput.vue'
const dialogRef: any = inject('dialogRef')
const confirm = useConfirm()
const closeDialog = () => {
    dialogRef.value.close()
}
const toast = useToast()
const fileRecords = ref<Array<FileRecord>>([])
const fileRecordCount = ref(0)
const dataTableIsLoading = ref(false)
const newLongUrlLoading = ref(false)
const visible = ref(false)
const page = ref(1)
const size = ref(5)
const dialogType = ref<'new' | 'edit'>('new')
const newFileRecord = ref<FileRecord>(structuredClone(defaultFileRecord))
onMounted(async () => {
    let resp = await getFileRecordList()
    fileRecords.value = resp.results
    fileRecordCount.value = resp.count
    fileRecords.value.forEach((fileRecord) => {
        fileRecord.local_create = localTime(fileRecord.create_time)
    })
})
async function refreshPage(originalEvent?: DataTablePageEvent) {
    if (originalEvent?.page !== undefined) {
        page.value = originalEvent.page + 1
    }
    if (originalEvent?.rows !== undefined) {
        size.value = originalEvent.rows
    }
    dataTableIsLoading.value = true
    let resp = await getFileRecordList(page.value, size.value)
    fileRecords.value = resp.results
    fileRecordCount.value = resp.count
    fileRecords.value.forEach((fileRecord) => {
        fileRecord.local_create = localTime(fileRecord.create_time)
    })
    dataTableIsLoading.value = false
}
function localTime(time: string) {
    return new Date(time).toLocaleString()
}
function onFileChooseHandler(e: FileUploadSelectEvent) {
    newFileRecord.value.file = e.files[0]
    newFileRecord.value.file_name = e.files[0].name
}

async function newFileRecordUpload() {
    newFileRecord.value.loading = true
    if (newFileRecord.value.desc === '') {
        toast.add({
            severity: 'error',
            summary: '描述不能为空',
            detail: '文件描述不能为空',
            life: 3000
        })
        newFileRecord.value.loading = false
        return
    }
    if (newFileRecord.value.permission === '3' && newFileRecord.value.password === '') {
        toast.add({
            severity: 'error',
            summary: '密码不能为空',
            detail: '文件密码不能为空',
            life: 3000
        })
        newFileRecord.value.loading = false
        return
    }
    let resp
    if (dialogType.value === 'edit') {
        resp = await patchFileRecord(newFileRecord.value)
    } else {
        resp = await postFileRecord(newFileRecord.value)
    }
    if (resp) {
        if (dialogType.value === 'new')
            toast.add({
                severity: 'success',
                summary: '上传成功',
                detail: '文件上传成功',
                life: 3000
            })
        else
            toast.add({
                severity: 'success',
                summary: '修改成功',
                detail: '文件信息修改成功',
                life: 3000
            })
        visible.value = false
        newFileRecord.value = structuredClone(defaultFileRecord)
        refreshPage()
    } else {
        toast.add({ severity: 'error', summary: '错误', detail: '文件上传失败', life: 3000 })
    }
    newFileRecord.value.loading = false
}
async function deleteHandler(index: number) {
    let resp = await deleteFileRecord(fileRecords.value[index].id)
    if (resp) {
        toast.add({
            severity: 'success',
            summary: '删除成功',
            detail: '短链已删除',
            life: 3000
        })
        fileRecords.value.splice(index, 1)
        fileRecordCount.value -= 1
    } else {
        toast.add({
            severity: 'error',
            summary: '删除失败',
            detail: '请重试',
            life: 3000
        })
    }
}
function confirmDelete(event: any, index: number) {
    confirm.require({
        target: event.currentTarget,
        message: '删除此文件吗？',
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
        accept: () => {
            deleteHandler(index)
        }
    })
}
function showNewDialog() {
    dialogType.value = 'new'
    newFileRecord.value = structuredClone(defaultFileRecord)
    visible.value = true
}
function showEditDialog(index: number) {
    dialogType.value = 'edit'
    newFileRecord.value.id = fileRecords.value[index].id
    newFileRecord.value.desc = fileRecords.value[index].desc
    newFileRecord.value.file_name = fileRecords.value[index].file_name
    newFileRecord.value.permission = fileRecords.value[index].permission.toString()
    newFileRecord.value.password = fileRecords.value[index].password
    visible.value = true
}
</script>
<template>
    <ConfirmPopup></ConfirmPopup>
    <DataTable
        :value="fileRecords"
        stripedRows
        :loading="dataTableIsLoading"
        lazy
        paginator
        :totalRecords="fileRecordCount"
        :rows="size"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
        @page="refreshPage"
        class="transition-all p-5"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <p>共 {{ fileRecordCount }} 条记录</p>
                </div>
                <Button
                    type="button"
                    icon="pi pi-plus"
                    :loading="newLongUrlLoading"
                    text
                    @click="showNewDialog"
                />
            </div>
        </template>
        <template #paginatorstart>
            <Button type="button" icon="pi pi-refresh" text @click="refreshPage" />
        </template>
        <Column field="id" header="ID"></Column>
        <Column field="file_name" header="文件名"></Column>
        <Column field="desc" header="描述"></Column>
        <Column header="权限">
            <template #body="{ data, index }">
                <span>{{ permissionMap[data.permission as keyof typeof permissionMap] }}</span>
            </template>
        </Column>
        <Column field="local_create" header="上传时间"></Column>
        <Column>
            <template #body="{ data, index }">
                <Button
                    type="button"
                    :icon="'pi pi-pencil'"
                    text
                    size="small"
                    @click="showEditDialog(index)"
                />
                <Button
                    type="button"
                    :icon="'pi pi-trash'"
                    text
                    severity="danger"
                    size="small"
                    @click="confirmDelete($event, index)"
                />
            </template>
        </Column>
    </DataTable>
    <Button @click="closeDialog" label="Close" class="m-4 float-end" />

    <Dialog v-model:visible="visible" modal :closeOnEscape="false" :style="{ width: '40rem' }">
        <template #header>
            <div class="inline-flex items-center justify-center gap-2">
                <span class="font-bold whitespace-nowrap" v-if="dialogType === 'new'"
                    >上传新文件</span
                >
                <span class="font-bold whitespace-nowrap" v-else>编辑文件</span>
            </div>
        </template>
        <FileUpload
            v-if="dialogType === 'new'"
            mode="basic"
            chooseLabel="选择文件"
            @select="onFileChooseHandler"
            class="h-10"
        />
        <LabelAndInput
            id="file_name"
            label="文件名"
            :loading="newFileRecord.loading"
            v-model="newFileRecord.file_name"
        />
        <LabelAndInput
            id="file_desc"
            label="文件描述"
            :loading="newFileRecord.loading"
            v-model="newFileRecord.desc"
        />
        <div class="flex flex-wrap gap-4 mt-4 justify-start h-10 items-center">
            <label class="flex-shrink-0 w-20 text-right">文件权限</label>
            <div class="flex items-center">
                <RadioButton
                    v-model="newFileRecord.permission"
                    inputId="private"
                    name="private"
                    value="2"
                />
                <label for="private" class="ml-2">私有</label>
            </div>
            <div class="flex items-center">
                <RadioButton
                    v-model="newFileRecord.permission"
                    inputId="public"
                    name="public"
                    value="1"
                />
                <label for="public" class="ml-2">完全公开</label>
            </div>
            <div class="flex items-center">
                <RadioButton
                    v-model="newFileRecord.permission"
                    inputId="passwordProtected"
                    name="passwordProtected"
                    value="3"
                />
                <label for="passwordProtected" class="ml-2">密码保护</label>
            </div>
        </div>
        <LabelAndInput
            v-if="newFileRecord.permission === '3'"
            id="file_desc"
            label="文件密码"
            :loading="newFileRecord.loading"
            v-model="newFileRecord.password"
        />
        <template #footer>
            <Button label="取消" text severity="secondary" @click="visible = false" />
            <Button
                label="保存"
                severity="prime"
                @click="newFileRecordUpload"
                :loading="newFileRecord.loading"
            />
        </template>
    </Dialog>
</template>
