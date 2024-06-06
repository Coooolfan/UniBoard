<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function handleClick() {
    router.push('/uniboard')
}
</script>
<template>
    <h1>Landing View</h1>
    <button @click="handleClick">to UniBoard View</button>
</template>
