<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { getShortUrlList, type ShortUrl } from '@/api/shortUrl'
const dialogRef: any = inject('dialogRef')

const closeDialog = () => {
    dialogRef.value.close()
}
const shortUrls = ref<Array<ShortUrl>>([])
const shortUrlCount = ref(0)
onMounted(async () => {
    let resp = await getShortUrlList()
    shortUrls.value = resp.results
    shortUrlCount.value = resp.count
})

const page = ref(1)
const size = ref(10)
</script>
<template>
    <p>Link Card</p>
    <DataTable
        :value="shortUrls"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
    >
        <template #paginatorstart>
            <Button type="button" icon="pi pi-refresh" text />
        </template>
        <template #paginatorend>
            <Button type="button" icon="pi pi-download" text />
        </template>
        <Column field="id" header="ID" style="width: 25%"></Column>
        <Column field="short_url" header="短链" style="width: 25%"></Column>
        <Column field="long_url" header="原始链接" style="width: 25%"></Column>
        <Column field="gmt_create" header="创建时间" style="width: 25%"></Column>
    </DataTable>
    <Button @click="closeDialog" label="Close" class="mt-4 float-end" />
</template>
