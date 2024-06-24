<script setup lang="ts">
import { useRouter } from 'vue-router'
import ClockCard from '@/components/ClockCard.vue'
const router = useRouter()

function handleClick() {
    router.push('/')
}
// TODO
// 0. 设置以浮窗的形式展示
// 1. 着陆页首屏的设置
// 2. 着陆页的第二屏的设置
</script>
<template>
    <ClockCard />
    <h1>UniBoard View</h1>
    <button @click="handleClick">to Landing View</button>
</template>
