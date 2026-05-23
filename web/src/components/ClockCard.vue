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
            class="w-8 text-center text-5xl text-slate-900 select-none md:w-12 lg:w-20 lg:text-9xl dark:text-slate-100"
        >
            {{ item }}
        </div>
    </div>
</template>
