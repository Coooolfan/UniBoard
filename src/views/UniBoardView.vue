<script setup lang="ts">
import { useRouter } from 'vue-router'
import ClockCard from '@/components/ClockCard.vue'
const router = useRouter()

function handleClick() {
    router.push('/')
}
</script>
<template>
    <ClockCard />
    <h1>UniBoard View</h1>
    <button @click="handleClick">to Landing View</button>
</template>
