<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import Skeleton from 'primevue/skeleton'
import { useToast } from 'primevue/usetoast'
import {
    defaultHyperLinkCache,
    deleteHyperLink,
    fetchNewHyperLink,
    getHyperLinkCache,
    gethyperLinkCacheList,
    saveAndUpdateHyperLink,
    type HyperLinkCache
} from '@/api/hyperLink'
import HyperLinkCard from '@/components/HyperLinkCard.vue'
import LabelAndInput from '@/components/LabelAndInput.vue'
import ColorPicker from 'primevue/colorpicker'
const toast = useToast()
const hyperLinkCacheList = ref<Array<HyperLinkCache>>([])
onMounted(async () => {
    hyperLinkCacheList.value = await gethyperLinkCacheList()
    hyperLinkCacheList.value.forEach((item) => {
        item.uploading = false
    })
})

async function removeHyperLink(index: number) {
    // 如果是新建的超链接，直接删除
    if (!hyperLinkCacheList.value[index].saved) {
        hyperLinkCacheList.value.splice(index, 1)
        return
    }
    let res = await deleteHyperLink(hyperLinkCacheList.value[index].id)
    if (res) {
        toast.add({
            severity: 'success',
            summary: '删除成功',
            detail: '超链接信息删除成功',
            life: 3000
        })
    } else {
        toast.add({
            severity: 'error',
            summary: '删除失败',
            detail: '超链接信息删除失败',
            life: 3000
        })
    }
    hyperLinkCacheList.value = await gethyperLinkCacheList()
}

async function saveHyperLinkConfig(index: number) {
    if (!hyperLinkCacheList.value[index]) {
        return
    }
    hyperLinkCacheList.value[index].uploading = true
    let res = await saveAndUpdateHyperLink(hyperLinkCacheList.value[index])
    if (res) {
        toast.add({
            severity: 'success',
            summary: '保存成功',
            detail: '超链接信息更新成功',
            life: 3000
        })
    } else {
        toast.add({
            severity: 'error',
            summary: '保存失败',
            detail: '超链接信息更新失败',
            life: 3000
        })
    }
    hyperLinkCacheList.value[index].uploading = false
    if (!hyperLinkCacheList.value[index].saved) {
        hyperLinkCacheList.value = await gethyperLinkCacheList()
    }
}

function handleFileRead(file: File, index: number) {
    const reader = new FileReader()
    reader.onload = (e) => {
        if (!e.target?.result) return
        hyperLinkCacheList.value[index].icon = e.target.result as string
    }
    reader.readAsDataURL(file)
}
function onFileChooseHandler(e: FileUploadSelectEvent, index: number) {
    if (!e.files[0]) return
    handleFileRead(e.files[0], index)
}
function appendNewHyperLinkCache() {
    hyperLinkCacheList.value.push(structuredClone(defaultHyperLinkCache))
}
let attempt = 0
let maxAttempts = 8
async function refreshFromServer(index: number) {
    if (!hyperLinkCacheList.value[index].url) return
    toast.add({
        severity: 'info',
        summary: '正在获取',
        detail: '正在从服务器获取超链接信息……',
        life: 8000
    })
    hyperLinkCacheList.value[index].uploading = true
    let fetch_resp = await fetchNewHyperLink(hyperLinkCacheList.value[index].url)
    if (!fetch_resp.id) {
        toast.add({
            severity: 'error',
            summary: '请求失败',
            detail: '无法从服务器获取超链接信息',
            life: 3000
        })
        return
    } else {
        hyperLinkCacheList.value[index].cacheId = fetch_resp.id
    }
    // 间隔1s循环检查是否获取到数据

    let timer = setInterval(async () => {
        attempt++
        if (attempt < maxAttempts) {
            let resp = await getHyperLinkCache(hyperLinkCacheList.value[index].cacheId as number)
            console.log(resp)
            if (resp.finished) {
                toast.add({
                    severity: 'success',
                    summary: '获取成功',
                    detail: '超链接信息获取成功',
                    life: 3000
                })
                clearInterval(timer)
                hyperLinkCacheList.value[index].uploading = false
                hyperLinkCacheList.value[index].title = resp.title
                hyperLinkCacheList.value[index].desc = resp.desc
                hyperLinkCacheList.value[index].icon = resp.icon
                hyperLinkCacheList.value[index].color = resp.color
            }
        } else {
            clearInterval(timer)
            console.log('超过最大重试次数')
            hyperLinkCacheList.value[index].uploading = false
            toast.add({
                severity: 'error',
                summary: '获取失败',
                detail: '超链接信息获取失败',
                life: 3000
            })
            // 可以在这里添加处理超过最大重试次数的逻辑
            attempt = 0
            maxAttempts = 8
        }
    }, 1000)
}
</script>
<template>
    <div
        v-for="(item, index) of hyperLinkCacheList"
        :key="index"
        class="flex flex-col justify-around pb-4 items-center max-w-screen border-b-[1px] lg:flex-row lg:ml-4 lg:mr-4"
    >
        <div class="lg:w-1/3">
            <LabelAndInput
                id="title"
                label="标题"
                v-model="item.title"
                :loading="item.uploading"
                :disabled="item.uploading"
            />
            <LabelAndInput
                id="desc"
                label="描述"
                v-model="item.desc"
                :loading="item.uploading"
                :disabled="item.uploading"
            />
            <LabelAndInput
                id="url"
                label="目标链接"
                v-model="item.url"
                :loading="item.uploading"
                :disabled="item.uploading"
            />
            <div class="flex items-center space-x-2 mt-4">
                <label for="name" class="shrink-0 w-20 text-right">主题色</label>
                <div class="grow flex items-center">
                    <ColorPicker
                        v-if="hyperLinkCacheList"
                        id="color"
                        v-model="item.color"
                        v-tooltip.right="'建议使用淡色系'"
                        type="text"
                        :disabled="item.uploading"
                    />
                    <Skeleton v-else height="2.5rem" />
                </div>
            </div>
            <div class="flex items-center mt-4 justify-end lg:space-x-2">
                <FileUpload
                    mode="basic"
                    accept="image/*"
                    chooseLabel="选择图标"
                    :auto="true"
                    class="h-10"
                    :disabled="item.uploading"
                    @select="(e) => onFileChooseHandler(e, index)"
                />
                <Button
                    class="ml-1 lg:ml-4"
                    icon="pi pi-refresh"
                    aria-label="Save"
                    v-tooltip.bottom="'从URL自动获取'"
                    @click="refreshFromServer(index)"
                />
                <Button
                    v-if="hyperLinkCacheList"
                    severity="danger"
                    class="ml-1 float-end h-10 transition-all lg:ml-4"
                    label="删除"
                    @click="removeHyperLink(index)"
                    :loading="item.uploading"
                />
                <Button
                    v-if="hyperLinkCacheList"
                    class="ml-1 float-end h-10 transition-all lg:ml-4"
                    label="保存"
                    :disabled="item.uploading"
                    @click="saveHyperLinkConfig(index)"
                    :loading="item.uploading"
                />
            </div>
        </div>
        <HyperLinkCard :linkData="item" class="scale-90 w-full mt-4 lg:mt-0"></HyperLinkCard>
    </div>

    <div class="flex justify-end mt-4">
        <Button label="新增超链接" @click="appendNewHyperLinkCache" />
    </div>
</template>
