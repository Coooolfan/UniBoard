<script lang="ts" setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const fileId = route.params.fileId
</script>
<template>
    <p class="font-extrabold text-3xl">FileShareView</p>
    <p>{{ fileId }}</p>
</template>
