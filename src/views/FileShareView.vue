<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Card, { type CardPassThroughOptions } from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { defaultFileRecord } from '@/api/fileRecord'
import { defaultUserInfo } from '@/api/userInfo'
const route = useRoute()
const pt: CardPassThroughOptions = {
    body: {
        class: 'h-full justify-between bg-[#f2f2f2] rounded-xl hover:bg-[#f9f9f9] transition-all duration-500'
    }
}
const fileId = route.params.fileId
const passwordInput = ref('')
const fileRecord = ref(structuredClone(defaultFileRecord))
const userInfo = ref(structuredClone(defaultUserInfo))
onMounted(() => {
    getFileRecordDetail()
    getUserInfoDetail()
})
function getFileRecordDetail() {
    fetch(`/api/file-records/${fileId}`)
        .then((response) => response.json())
        .then((data) => (fileRecord.value = data))
}
function getUserInfoDetail() {
    fetch(`/api/user-info/1/`)
        .then((response) => response.json())
        .then((data) => (userInfo.value = data))
}

const descIsEmpty = computed(() => fileRecord.value.desc === '')
</script>
<template>
    <div class="relative h-screen pt-28 pl-20 pr-20">
        <picture>
            <img
                :src="userInfo.banner"
                class="absolute inset-0 object-cover w-full h-full filter -z-20"
                alt="background-image"
            />
        </picture>
        <div class="flex gap-14">
            <Card
                class="w-80 h-96 drop-shadow-xl shadow-black transition-all duration-500 hover:drop-shadow-2xl"
                :pt="pt"
            >
                <template #content>
                    <div class="flex flex-col items-center pt-4">
                        <i class="pi pi-file" style="font-size: 4rem" />
                        <p class="mt-4 font-bold tracking-wide">{{ fileRecord.file_name }}</p>
                    </div>
                </template>
                <template #footer>
                    <div class="flex gap-4">
                        <InputText
                            v-if="fileRecord.permission.toString() === '3'"
                            v-model="passwordInput"
                            type="text"
                            placeholder="Password"
                        />
                        <Button severity="contrast" label="下载" class="w-full"></Button>
                    </div>
                </template>
            </Card>
            <div class="p-2">
                <p class="text-3xl font-bold tracking-wider" v-if="descIsEmpty">
                    {{ userInfo.name + ' 向您发送了一份文件：' }}
                </p>
                <p class="text-3xl font-bold tracking-wider" v-else>
                    {{ userInfo.name + ' 向您发送了一份文件并附言：' }}
                </p>
                <p class="mt-8">{{ fileRecord.desc }}</p>
            </div>
        </div>
    </div>
</template>
