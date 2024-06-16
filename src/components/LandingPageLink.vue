<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'
import type { Link } from '@/api/sysInfo'

function reverseHoverring() {
    hoverring.value = !hoverring.value
}
const props = defineProps<{
    linkData: Link
}>()
const whiteColor = '#ffffff'
const hoverring = ref(false)
const bgGradientColorFrom = computed(() => {
    return hoverring.value ? whiteColor : props.linkData.color
})
const bgGradientColorTo = computed(() => {
    return hoverring.value ? props.linkData.color : whiteColor
})
</script>
<template>
    <a :href="linkData.url" target="_self" class="group">
        <div
            class="relative w-96 h-44 rounded-lg justify-end items-center shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-500"
            :style="{
                background: `linear-gradient(-30deg, ${bgGradientColorFrom} 0%, ${bgGradientColorTo} 50%)`,
                transition: 'background 0.5s ease' // 添加背景渐变的过渡效果
            }"

        >
            <img
                :src="linkData.icon"
                class="w-24 h-24 absolute top-10 left-10 z-40 group-hover:-left-10 group-hover:-top-10 group-hover:w-28 group-hover:h-28 transition-all duration-500"
            />
            <div class="z-50 relative">
                <span
                    class="absolute text-2xl top-8 right-6 font-bold text-shadow-s transition-all duration-500 group-hover:text-3xl group-hover:top-8 group-hover:right-44"
                >
                    {{ linkData.title }}
                </span>
                <p
                    class="absolute top-16 right-6 text-sm mt-8 text-shadow-s transition-all duration-500 group-hover:top-16 group-hover:right-20"
                >
                    {{ linkData.desc }}
                </p>
            </div>
        </div></a
    >
</template>
