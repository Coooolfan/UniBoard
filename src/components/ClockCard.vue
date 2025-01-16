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
    <div class="flex">
        <div
            v-for="(item, index) in time_formatted"
            :key="index"
            class="min-w-6 text-5xl text-center select-none lg:min-w-16 lg:text-9xl"
        >
            {{ item }}
        </div>
    </div>
</template>
