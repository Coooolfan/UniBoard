<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { useClipboard } from '@/composables/useClipboard'
import Button from 'primevue/button'
import DataTable, { type DataTablePageEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import { useToast } from 'primevue/usetoast'
import ConfirmPopup from 'primevue/confirmpopup'
import Dialog from 'primevue/dialog'
import RadioButton from 'primevue/radiobutton'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import { useConfirm } from 'primevue/useconfirm'
import LabelAndInput from './LabelAndInput.vue'
import { api } from '@/ApiInstance'
import type { FileRecordDto } from '@/__generated/model/dto'
import { cloneWithFallback } from '@/utils/CloneWithCallback'

const { copyToClipboard } = useClipboard()
const dialogRef: any = inject('dialogRef')
const confirm = useConfirm()
const closeDialog = () => {
    dialogRef.value.close()
}
const toast = useToast()
const defaultFileRecord: FileRecordDto['FileRecordController/DEFAULT_FILERECORD'] = {
    id: 0,
    file: { filename: '', filepath: '' },
    shareCode: '',
    description: '',
    visibility: 'PRIVATE',
    password: '',
    downloadCount: 0
}
const fileRecords = ref<Array<FileRecordDto['FileRecordController/DEFAULT_FILERECORD']>>([])
const fileRecordCount = ref(0)
const selectedFile = ref<File | null>(null)
const selectedFilename = ref('')
const selectedFileLoading = ref(false)
const dataTableIsLoading = ref(false)
const newLongUrlLoading = ref(false)
const visible = ref(false)
const page = ref(1)
const size = ref(5)
const dialogType = ref<'new' | 'edit'>('new')
const host = window.location.origin
const newFileRecord =
    ref<FileRecordDto['FileRecordController/DEFAULT_FILERECORD']>(defaultFileRecord)

onMounted(async () => {
    let resp = await api.fileRecordController.getAllFileRecords({
        pageIndex: page.value,
        pageSize: size.value
    })
    fileRecords.value = [...resp.rows]
    fileRecordCount.value = resp.totalRowCount
})
async function refreshPage(originalEvent?: DataTablePageEvent) {
    if (originalEvent?.page !== undefined) {
        page.value = originalEvent.page + 1
    }
    if (originalEvent?.rows !== undefined) {
        size.value = originalEvent.rows
    }
    dataTableIsLoading.value = true
    let resp = await api.fileRecordController.getAllFileRecords({
        pageIndex: page.value,
        pageSize: size.value
    })
    fileRecords.value = [...resp.rows]
    fileRecordCount.value = resp.totalRowCount
    dataTableIsLoading.value = false
}

function onFileChooseHandler(e: FileUploadSelectEvent) {
    const file = e.files[0]
    selectedFile.value = file
    selectedFilename.value = file.name
}

// Validate file input fields
function validateFileInput(): boolean {
    if (dialogType.value === 'new' && selectedFile.value === null) {
        toast.add({
            severity: 'error',
            summary: '未选择文件',
            detail: '请选择一个文件',
            life: 3000
        })
        return false
    }
    if (dialogType.value === 'new' && selectedFilename.value === '') {
        toast.add({ severity: 'error', summary: '空文件名', detail: '文件名不能为空', life: 3000 })
        return false
    }

    if (newFileRecord.value?.visibility === 'PASSWORD' && newFileRecord.value.password === '') {
        toast.add({
            severity: 'error',
            summary: '密码不能为空',
            detail: '文件密码不能为空',
            life: 3000
        })
        return false
    }

    return true
}

// Create payload for edit operation
function getEditPayload() {
    return {
        id: newFileRecord.value.id!,
        body: {
            file: { filename: selectedFilename.value },
            description: newFileRecord.value.description!,
            visibility: newFileRecord.value.visibility!,
            password: newFileRecord.value.password!
        }
    } as const
}

// Create payload for new file upload
function getUploadPayload() {
    return {
        body: {
            insert: {
                file: { filename: selectedFilename.value },
                description: newFileRecord.value.description!,
                visibility: newFileRecord.value.visibility!,
                password: newFileRecord.value.password!
            },
            file: selectedFile.value!
        }
    } as const
}

// Handle API error
function handleApiError(error: any) {
    let errorMessage = '操作失败，请重试'

    if (error?.family === 'FILE_RECORD' && error?.code === 'EMPTY_PASSWORD') {
        errorMessage = '文件密码不能为空'
    } else if (error?.message) {
        errorMessage = error.message
    }

    toast.add({ severity: 'error', summary: '错误', detail: errorMessage, life: 3000 })
    console.error(error)
}

// Show success message
function showSuccessMessage() {
    const isNewFile = dialogType.value === 'new'
    toast.add({
        severity: 'success',
        summary: isNewFile ? '上传成功' : '修改成功',
        detail: isNewFile ? '文件上传成功' : '文件信息修改成功',
        life: 3000
    })
}

async function submitFileRecordUpload() {
    selectedFileLoading.value = true

    if (!validateFileInput()) {
        selectedFileLoading.value = false
        return
    }

    try {
        let resp
        if (dialogType.value === 'edit') {
            resp = await api.fileRecordController.updateFileRecordById(getEditPayload())
        } else {
            resp = await api.fileRecordController.uploadFile(getUploadPayload())
        }

        if (resp) {
            showSuccessMessage()
            visible.value = false
            newFileRecord.value = cloneWithFallback(defaultFileRecord)
            refreshPage()
        }
    } catch (error: any) {
        handleApiError(error)
    } finally {
        selectedFileLoading.value = false
    }
}
async function deleteHandler(index: number) {
    try {
        await api.fileRecordController.deleteFileRecordById({ id: fileRecords.value[index].id! })
        toast.add({ severity: 'success', summary: '删除成功', detail: '相关内容已不可见，存储于磁盘上的物理文件会在每日凌晨自动清理。', life: 3000 })
        fileRecords.value.splice(index, 1)
        fileRecordCount.value -= 1
    } catch (error: any) {
        let errorMessage = '删除失败，请重试'

        if (error?.message) {
            errorMessage = error.message
        }

        toast.add({ severity: 'error', summary: '删除失败', detail: errorMessage, life: 3000 })
        console.error(error)
    }
}
function confirmDelete(event: any, index: number) {
    confirm.require({
        target: event.currentTarget,
        message: '删除此文件吗？',
        icon: 'pi pi-info-circle',
        rejectProps: { label: '取消', severity: 'secondary', outlined: true },
        acceptProps: { label: '删除', severity: 'danger' },
        accept: () => {
            deleteHandler(index)
        }
    })
}
function showNewDialog() {
    dialogType.value = 'new'
    selectedFile.value = null
    selectedFilename.value = ''
    newFileRecord.value = cloneWithFallback(defaultFileRecord)
    visible.value = true
}
function showEditDialog(index: number) {
    dialogType.value = 'edit'
    newFileRecord.value = {
        id: fileRecords.value[index].id,
        file: {
            filename: fileRecords.value[index].file?.filename!,
            filepath: fileRecords.value[index].file?.filepath!
        },
        shareCode: fileRecords.value[index].shareCode,
        description: fileRecords.value[index].description,
        visibility: fileRecords.value[index].visibility,
        password: fileRecords.value[index].password,
        downloadCount: fileRecords.value[index].downloadCount
    }
    selectedFilename.value = fileRecords.value[index].file?.filename!
    visible.value = true
}

function copyFileLink(index: number) {
    const shortUrl = host + '/f/' + fileRecords.value[index].shareCode
    copyToClipboard(shortUrl, '文件分享链接已复制到剪贴板', '文件分享链接复制失败')
}
async function downloadHandler(index: number) {
    let resp = await api.fileRecordController.createDirectLink({
        create: { id: fileRecords.value[index].id! }
    })
    let DirectLinkToken = resp.directUUID
    let DirectLink =
        host + '/file/' + DirectLinkToken + '/' + fileRecords.value[index].file?.filename
    let a = document.createElement('a')
    a.style.display = 'none'
    a.href = DirectLink
    a.download = fileRecords.value[index].file?.filename!
    a.click()
    a.remove()
}

async function copyDirctLink() {
    let resp = await api.fileRecordController.createDirectLink({
        create: { id: newFileRecord.value.id! }
    })
    let DirectLinkToken = resp.directUUID
    let DirectLink = host + '/file/' + DirectLinkToken + '/' + newFileRecord.value.file?.filename
    copyToClipboard(DirectLink, '文件下载直链已复制到剪贴板\n有效期 5 分钟', '文件下载直链复制失败')
}

const submitText = computed(() => {
    if (dialogType.value === 'edit') return '修改'
    else return '上传'
})

const translateVisibility = (visibility: string): string => {
    switch (visibility) {
        case 'PRIVATE':
            return '私有'
        case 'PUBLIC':
            return '完全公开'
        case 'PASSWORD':
            return '密码保护'
        default:
            return visibility // Fallback in case of unexpected values
    }
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
        @page="refreshPage"
        class="max-w-screen transition-all lg:p-5"
    >
        <template #header>
            <div class="flex items-center justify-between">
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
            <div class="m-2 text-center italic lg:hidden">左右滑动表头查看更多</div>
        </template>
        <template #paginatorstart>
            <Button type="button" icon="pi pi-refresh" text @click="refreshPage()" />
        </template>
        <Column field="id" header="ID"></Column>
        <Column field="file.filename" header="文件名"></Column>
        <Column field="description" header="描述">
            <template #body="{ data }">
                <div class="max-w-72 overflow-auto lg:max-w-none" :title="data.description">
                    {{ data.description }}
                </div>
            </template>
        </Column>
        <Column header="权限">
            <template #body="{ data, index }">
                <span>{{ translateVisibility(data.visibility) }}</span>
                <Button
                    v-if="data.visibility !== 'PRIVATE'"
                    type="button"
                    :icon="'pi pi-link'"
                    text
                    size="small"
                    @click="copyFileLink(index)"
                />
            </template>
        </Column>
        <Column>
            <template #header>
                <span
                    title="用户可能使用多线程下载器，无法保证数据的准确"
                    class="p-datatable-column-title"
                    data-pc-section="columntitle"
                    >统计</span
                >
            </template>
            <template #body="{ data }">
                <span>{{ data.downloadCount }}</span>
            </template>
        </Column>
        <Column>
            <template #body="{ data, index }">
                <Button
                    type="button"
                    :icon="'pi pi-download'"
                    text
                    size="small"
                    @click="downloadHandler(index)"
                />
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
    <Button @click="closeDialog" label="关闭" class="float-end m-4" />

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
            :loading="selectedFileLoading"
            v-model="selectedFilename"
        />
        <LabelAndInput
            id="file_desc"
            label="文件描述"
            :loading="selectedFileLoading"
            v-model="newFileRecord.description!"
        />
        <div class="mt-4 flex h-10 flex-wrap items-center justify-start gap-2 lg:gap-4">
            <label class="w-20 shrink-0 text-right">文件权限</label>
            <div class="flex items-center">
                <RadioButton
                    v-model="newFileRecord.visibility"
                    inputId="private"
                    name="private"
                    value="PRIVATE"
                />
                <label for="private" class="ml-1 lg:ml-2">私有</label>
            </div>
            <div class="flex items-center">
                <RadioButton
                    v-model="newFileRecord.visibility"
                    inputId="public"
                    name="public"
                    value="PUBLIC"
                />
                <label for="public" class="ml-1 lg:ml-2">完全公开</label>
            </div>
            <div class="flex items-center">
                <RadioButton
                    v-model="newFileRecord.visibility"
                    inputId="passwordProtected"
                    name="passwordProtected"
                    value="PASSWORD"
                />
                <label for="passwordProtected" class="ml-1 lg:ml-2">密码保护</label>
            </div>
        </div>
        <LabelAndInput
            v-if="newFileRecord.visibility === 'PASSWORD'"
            id="file_password"
            label="文件密码"
            :loading="selectedFileLoading"
            v-model="newFileRecord.password!"
        />
        <template #footer>
            <Button
                v-if="dialogType === 'edit'"
                label="复制临时直链"
                text
                severity="secondary"
                @click="copyDirctLink"
            />
            <Button label="取消" text severity="secondary" @click="visible = false" />
            <Button
                :label="submitText"
                severity="prime"
                @click="submitFileRecordUpload"
                :loading="selectedFileLoading"
            />
        </template>
    </Dialog>
</template>
