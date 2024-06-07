<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getSystemInfo } from '@/api/sysInfo'
import type { SystemInfo } from '@/api/sysInfo'
import { login } from '@/api/auth'
import { ref, onMounted } from 'vue'
const router = useRouter()
const sysInfo = ref<SystemInfo | null>(null)

onMounted(async () => {
    sysInfo.value = await getSystemInfo()
})

function handleClick() {
    router.push('/uniboard')
}
</script>
<template>
    <img class="w-80" :src="sysInfo?.avater" alt="avatar" />
    <p class="text-lg">{{ sysInfo?.name }}</p>
    <p class="text-lg">{{ sysInfo?.profile }}</p>
    <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="handleClick"
    >
        to UniBoard View
    </button>
    <div class="h-4" />
    <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="login('yang', 'Yang')"
    >
        login
    </button>
</template>
