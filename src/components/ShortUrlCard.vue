<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import DataTable, { type DataTablePageEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import Input from 'primevue/inputtext'
import { deleteShortUrl, getShortUrlList, postShortUrl, type ShortUrl } from '@/api/shortUrl'
import { useToast } from 'primevue/usetoast'
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from 'primevue/useconfirm'
const dialogRef: any = inject('dialogRef')
const confirm = useConfirm()
const closeDialog = () => {
    dialogRef.value.close()
}
const toast = useToast()
const shortUrls = ref<Array<ShortUrl>>([])
const shortUrlCount = ref(0)
const dataTableIsLoading = ref(false)
const newLongUrl = ref('')
const newLongUrlLoading = ref(false)
const page = ref(1)
const size = ref(5)
const host = window.location.origin
onMounted(async () => {
    let resp = await getShortUrlList()
    shortUrls.value = resp.results
    shortUrlCount.value = resp.count
    shortUrls.value.forEach((shortUrl) => {
        shortUrl.local_create = localTime(shortUrl.gmt_create)
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
    let resp = await getShortUrlList(page.value, size.value)
    shortUrls.value = resp.results
    shortUrlCount.value = resp.count
    shortUrls.value.forEach((shortUrl) => {
        shortUrl.local_create = localTime(shortUrl.gmt_create)
    })
    dataTableIsLoading.value = false
}
function localTime(time: string) {
    return new Date(time).toLocaleString()
}
async function addShortUrl() {
    newLongUrlLoading.value = true
    if (newLongUrl.value === '') {
        toast.add({
            severity: 'error',
            summary: '添加失败',
            detail: '链接不能为空',
            life: 3000
        })
        newLongUrlLoading.value = false
        return
    }
    let resp = await postShortUrl(newLongUrl.value)
    let newShortUrl = resp.short_url
    copyShortUrl(newShortUrl)
    newLongUrlLoading.value = false
    refreshPage()
}

async function copyShortUrl(content: string) {
    const shortUrl = host + '/s/' + content + '/'
    try {
        const clipboard = window.navigator.clipboard
        if (!clipboard) throw new Error('剪切版读写仅在安全上下文（HTTPS）中可用')
        await clipboard.writeText(shortUrl)
        toast.add({
            severity: 'success',
            summary: '复制成功',
            detail: '短链已复制到剪贴板',
            life: 3000
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: '复制失败',
            detail: error,
            life: 10000
        })
    }
}

async function deleteHandler(index: number) {
    let resp = await deleteShortUrl(shortUrls.value[index].id)
    if (resp) {
        toast.add({
            severity: 'success',
            summary: '删除成功',
            detail: '短链已删除',
            life: 3000
        })
        shortUrls.value.splice(index, 1)
        shortUrlCount.value -= 1
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
        message: '删除此短链吗？',
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
</script>
<template>
    <ConfirmPopup></ConfirmPopup>
    <DataTable
        :value="shortUrls"
        stripedRows
        :loading="dataTableIsLoading"
        lazy
        paginator
        :totalRecords="shortUrlCount"
        :rows="size"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
        @page="refreshPage"
        class="transition-all p-5"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <p>共 {{ shortUrlCount }} 条记录</p>
                </div>
                <div class="flex items-center">
                    <Input v-model="newLongUrl" />
                    <Button
                        type="button"
                        icon="pi pi-plus"
                        :loading="newLongUrlLoading"
                        text
                        @click="addShortUrl"
                    />
                </div>
            </div>
        </template>
        <template #paginatorstart>
            <Button type="button" icon="pi pi-refresh" text @click="refreshPage()" />
        </template>
        <Column field="id" header="ID"></Column>
        <Column field="short_url" header="短链"></Column>
        <Column field="long_url" header="原始链接">
            <template #body="{ data }">
                <a :href="data.long_url" :title="data.long_url">
                    <div class="max-w-72 overflow-auto lg:max-w-none">
                        {{ data.long_url }}
                    </div></a
                >
            </template>
        </Column>
        <Column field="local_create" header="创建时间"></Column>
        <Column field="count" header="统计"></Column>
        <Column>
            <template #body="{ data, index }">
                <Button
                    type="button"
                    :icon="'pi pi-copy'"
                    text
                    size="small"
                    @click="copyShortUrl(data.short_url)"
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
    <Button @click="closeDialog" label="关闭" class="m-4 float-end" />
</template>
