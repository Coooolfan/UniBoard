<script setup lang="ts">
import { useRouter } from 'vue-router'
import ClockCard from '@/components/ClockCard.vue'
import { removeToken } from '@/api/auth'
const router = useRouter()

function signOut() {
    removeToken()
    router.push('/')
}
// TODO
// 0. 设置以浮窗的形式展示
// 1. 着陆页首屏的设置
// 2. 着陆页的第二屏的设置
</script>
<template>
    <div class="flex flex-col items-center min-h-screen bg-[#f2f2f2]">
        <ClockCard class="mt-28" />
        <div class="flex justify-between w-2/5 max-w-96 mt-10">
            <i
                class="pi text-black grid place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-pencil"
            ></i>
            <i
                class="pi text-black grid place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-link"
            ></i>
            <i
                class="pi text-black grid place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-copy"
            ></i>
            <i
                class="pi text-black grid place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-cog"
            ></i>
            <i
                class="pi text-black grid place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-sign-out"
                @click="signOut"
            ></i>
        </div>
    </div>
</template>
