<script setup lang="ts">
import { computed, ref } from 'vue'
const time = ref(new Date())
// 创建一个计时器，10ms更新一次time
setInterval(() => {
    time.value = new Date()
}, 10)
const time_formatted = computed(() => time.value.toLocaleTimeString())
</script>
<template>
    <div
        v-for="(item, index) in time_formatted"
        :key="index"
        class="min-w-16 text-center text-9xl inline-block"
    >
        {{ item }}
    </div>
</template>
