<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { useClipboard } from '@/composables/useClipboard'
import Button from 'primevue/button'
import DataTable, { type DataTablePageEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import Input from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from 'primevue/useconfirm'
import { api } from '@/ApiInstance'
import type { ShortUrlDto } from '@/__generated/model/dto'
const dialogRef: any = inject('dialogRef')
const confirm = useConfirm()
const closeDialog = () => {
    dialogRef.value.close()
}
const toast = useToast()
const shortUrls = ref<Array<ShortUrlDto['ShortUrlController/DEFAULT_SHORT_URL']>>([])
const shortUrlCount = ref(0)
const dataTableIsLoading = ref(false)
const newLongUrl = ref('')
const newLongUrlLoading = ref(false)
const page = ref(1)
const size = ref(5)
const host = window.location.origin
onMounted(async () => {
    let resp = await api.shortUrlController.getShortUrl({
        pageIndex: page.value,
        pageSize: size.value
    })
    shortUrls.value = [...resp.rows]
    shortUrlCount.value = resp.totalRowCount
})
async function refreshPage(originalEvent?: DataTablePageEvent) {
    if (originalEvent?.page !== undefined) {
        page.value = originalEvent.page + 1
    }
    if (originalEvent?.rows !== undefined) {
        size.value = originalEvent.rows
    }
    dataTableIsLoading.value = true
    let resp = await api.shortUrlController.getShortUrl({
        pageIndex: page.value,
        pageSize: size.value
    })
    shortUrls.value = [...resp.rows]
    shortUrlCount.value = resp.totalRowCount
    dataTableIsLoading.value = false
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
    let resp = await api.shortUrlController.insertShortUrl({
        body: {
            longUrl: newLongUrl.value
        }
    })
    let newShortUrl = resp.shortUrl
    copyShortUrl(newShortUrl!)
    newLongUrlLoading.value = false
    refreshPage()
}

const { copyToClipboard } = useClipboard()

function copyShortUrl(content: string) {
    const shortUrl = host + '/s/' + content
    copyToClipboard(shortUrl, '短链已复制到剪贴板', '短链复制失败')
}

async function deleteHandler(index: number) {
    const shortUrlId = shortUrls.value[index].id
    if (shortUrlId === undefined) return
    await api.shortUrlController.deleteShortUrl({
        id: shortUrlId
    })

    shortUrls.value.splice(index, 1)
    shortUrlCount.value -= 1
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
        @page="refreshPage"
        class="max-w-screen transition-all lg:p-5"
    >
        <template #header>
            <div class="flex items-center justify-between">
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
            <div class="m-2 text-center italic lg:hidden">左右滑动表头查看更多</div>
        </template>
        <template #paginatorstart>
            <Button type="button" icon="pi pi-refresh" text @click="refreshPage()" />
        </template>
        <Column field="id" header="ID"></Column>
        <Column field="shortUrl" header="短链"></Column>
        <Column field="longUrl" header="原始链接">
            <template #body="{ data }">
                <a :href="data.longUrl" :title="data.longUrl">
                    <div class="max-w-72 overflow-auto">
                        {{ data.longUrl }}
                    </div>
                </a>
            </template>
        </Column>
        <Column>
            <template #header>
                <span
                    title="数据统计延后约1秒"
                    class="p-datatable-column-title"
                    data-pc-section="columntitle"
                    >统计</span
                >
            </template>
            <template #body="{ data }">
                <span>{{ data.visitCount }}</span>
            </template>
        </Column>
        <Column>
            <template #body="{ data, index }">
                <Button
                    type="button"
                    :icon="'pi pi-copy'"
                    text
                    size="small"
                    @click="copyShortUrl(data.shortUrl)"
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
</template>
