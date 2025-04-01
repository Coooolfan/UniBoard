<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { api } from '@/ApiInstance'
import type { Dynamic_FileRecord } from '@/__generated/model/dynamic'
import type { ProfileDto } from '@/__generated/model/dto'

const route = useRoute()
let shareCode = route.params.fileShareCode
const passwordInput = ref('')
const isFileExist = ref(true)
const fileRecord = ref<Dynamic_FileRecord | null>(null)
const userInfo = ref<ProfileDto['ProfileController/PUBLIC_PROFILE'] | null>(null)
onMounted(async () => {
    getFileRecordDetail()
    getUserInfoDetail()
})
async function getFileRecordDetail() {
    // 获取文件详情
    // 如果服务器返回了404，说明文件不存在
    if (typeof shareCode !== 'string') {
        shareCode = shareCode.join('')
    }
    try {
        const resp = await api.fileRecordController.getFileRecordById({
            shareCode: shareCode
        })
        fileRecord.value = resp
    } catch (error: any) {
        isFileExist.value = false
    }
}
async function getUserInfoDetail() {
    const resp = await api.profileController.getProfile()
    userInfo.value = resp
}

const descIsEmpty = computed(() => fileRecord.value?.description === '')

const titleString = computed(() => {
    if (!isFileExist.value) {
        return 'Oh! 这个链接似乎没有对应的文件'
    }
    return userInfo.value?.name + ' 向您发送了一份文件' + (descIsEmpty.value ? '' : '并附言') + '：'
})

const titleStringMobile = computed(() => {
    if (!isFileExist.value) {
        return 'Oh! 这个链接似乎没有对应的文件'
    }
    return descIsEmpty.value ? '' : '附言:'
})

const downloadUrl = computed(() => {
    return `/file/${shareCode}/${fileRecord.value?.file?.filename}?pw=${passwordInput.value}`
})

async function downloadHandler() {
    // 构建一个下载请求
    let a = document.createElement('a')
    a.style.display = 'none'
    a.href = downloadUrl.value
    a.download = fileRecord.value?.file?.filename!
    console.log(a.href)
    a.click()
}

const bannerUrl = computed(() => {
    return '/' + userInfo.value?.banner.filepath
})
</script>
<template>
    <div class="relative h-screen p-32">
        <picture>
            <img
                :src="bannerUrl"
                class="absolute inset-0 object-cover w-full h-full filter -z-20 dark:brightness-70"
                alt="background-image"
            />
        </picture>
        <div class="flex flex-col md:flex-row gap-14 items-center h-full -translate-y-6">
            <div
                class="flex flex-col w-80 p-4 h-2/3 md:h-96 drop-shadow-xl backdrop-blur-3xl bg-white/80 dark:bg-black/80 shadow-black justify-between rounded-xl transition-all duration-500 hover:drop-shadow-2xl hover:backdrop-blur-0"
            >
                <div class="flex flex-col items-center pt-4">
                    <i class="pi pi-file" style="font-size: 4rem" />
                    <p class="mt-4 font-bold tracking-wide">{{ fileRecord?.file?.filename }}</p>
                </div>
                <div class="pt-4 h-96 block md:hidden">
                    <p
                        class="text-xl dark:text-white text-black text-shadow-white dark:text-shadow-gray"
                    >
                        {{ titleStringMobile }}
                    </p>
                    <p class="dark:text-gray-200 text-gray-700">
                        {{ fileRecord?.description }}
                    </p>
                </div>
                <div class="flex gap-3">
                    <InputText
                        v-if="fileRecord?.visibility === 'PASSWORD'"
                        v-model="passwordInput"
                        type="text"
                        class="w-full"
                        placeholder="Password"
                    />
                    <Button
                        severity="contrast"
                        @click="downloadHandler"
                        :class="{
                            'w-20': fileRecord?.visibility === 'PASSWORD',
                            'w-full': fileRecord?.visibility !== 'PASSWORD'
                        }"
                        :disabled="!isFileExist"
                    >
                        <!-- 使用单独的a标签以允许在浏览器右键复制下载链接 -->
                        <a v-if="!isFileExist" class="pointer-events-none">文件不存在</a>
                        <a v-else :href="downloadUrl">下载</a>
                    </Button>
                </div>
            </div>
            <div class="p-2 h-96 hidden md:block -translate-y-8">
                <p
                    class="text-4xl font-bold tracking-wider dark:text-white text-black text-shadow-white dark:text-shadow-gray"
                >
                    {{ titleString }}
                </p>
                <p class="mt-8 dark:text-gray-200 text-gray-700">
                    {{ fileRecord?.description }}
                </p>
            </div>
        </div>
    </div>
</template>
