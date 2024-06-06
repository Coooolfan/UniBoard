<script setup lang="ts">
import { useRouter } from 'vue-router' 
const router = useRouter()

function handleClick() {
    router.push('/')
}
</script>
<template>
    <h1>UniBoard View</h1>
    <button @click="handleClick">to Landing View</button>
</template>
