<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { defaultFileRecord } from '@/api/fileRecord'
import { defaultUserInfo } from '@/api/userInfo'
const route = useRoute()
const shareCode = route.params.fileShareCode
const passwordInput = ref('')
const fileRecord = ref(structuredClone(defaultFileRecord))
const userInfo = ref(structuredClone(defaultUserInfo))
onMounted(() => {
    getFileRecordDetail()
    getUserInfoDetail()
})
function getFileRecordDetail() {
    // 获取文件详情
    // 如果服务器返回了404，说明文件不存在
    fetch(`/api/file-records/${shareCode}`)
        .then((response) => response.json())
        .then((data) => (fileRecord.value = data))
        .catch((error) => {
            console.error(error)
            fileRecord.value.file_name = '文件不存在'
        })
}
function getUserInfoDetail() {
    fetch(`/api/user-info/1/`)
        .then((response) => response.json())
        .then((data) => (userInfo.value = data))
}

const descIsEmpty = computed(() => fileRecord.value.desc === '')

const titleString = computed(() => {
    if (fileRecord.value.file_name === '文件不存在') {
        return 'Oh! 这个链接似乎没有对应的文件'
    }
    return userInfo.value.name + ' 向您发送了一份文件' + (descIsEmpty.value ? '' : '并附言') + '：'
})

const titleStringMobile = computed(() => {
    if (fileRecord.value.file_name === '文件不存在') {
        return 'Oh! 这个链接似乎没有对应的文件'
    }
    return descIsEmpty.value ? '' : '附言:'
})

async function downloadHandler() {
    // 构建一个下载请求
    let a = document.createElement('a')
    a.style.display = 'none'
    a.href = `/file/${shareCode}/${fileRecord.value.file_name}?pw=${passwordInput.value}`
    a.download = fileRecord.value.file_name
    console.log(a.href)
    a.click()
}
</script>
<template>
    <div class="relative h-screen p-32">
        <picture>
            <img
                :src="userInfo.banner"
                class="absolute inset-0 object-cover w-full h-full filter -z-20"
                alt="background-image"
            />
        </picture>
        <div class="flex flex-col md:flex-row gap-14 items-center h-full -translate-y-6">
            <div
                class="flex flex-col w-80 p-4 h-2/3 md:h-96 drop-shadow-xl backdrop-blur-3xl bg-white/80 shadow-black justify-between rounded-xl transition-all duration-500 hover:drop-shadow-2xl hover:backdrop-blur-0"
            >
                <div class="flex flex-col items-center pt-4">
                    <i class="pi pi-file" style="font-size: 4rem" />
                    <p class="mt-4 font-bold tracking-wide">{{ fileRecord.file_name }}</p>
                </div>
                <div class="pt-4 h-96 block md:hidden">
                    <p class="text-xl">
                        {{ titleStringMobile }}
                    </p>
                    <p class="">{{ fileRecord.desc }}</p>
                </div>
                <div class="flex gap-3">
                    <InputText
                        v-if="fileRecord.permission.toString() === '3'"
                        v-model="passwordInput"
                        type="text"
                        class="w-full"
                        placeholder="Password"
                    />
                    <Button
                        severity="contrast"
                        label="下载"
                        @click="downloadHandler"
                        :class="{
                            'w-20': fileRecord.permission.toString() === '3',
                            'w-full': fileRecord.permission.toString() !== '3'
                        }"
                        :disabled="fileRecord.file_name === '文件不存在'"
                    ></Button>
                </div>
            </div>
            <div class="p-2 h-96 hidden md:block -translate-y-8">
                <p class="text-4xl font-bold tracking-wider">
                    {{ titleString }}
                </p>
                <p class="mt-8">{{ fileRecord.desc }}</p>
            </div>
        </div>
    </div>
</template>
