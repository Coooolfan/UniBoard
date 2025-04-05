<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import type { HyperLinkDto } from '@/__generated/model/dto'
const { hyperLink } = defineProps({
    hyperLink: {
        type: Object as PropType<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>,
        required: true
    },
    allowRedirect: {
        type: Boolean,
        default: true
    }
})

const hoverring = ref(false)

function reverseHoverring() {
    hoverring.value = !hoverring.value
}

const bgGradientFrom = computed(() => {
    if (hyperLink.color?.startsWith('#')) return hyperLink.color
    return `#${hyperLink.color}`
})

const bgGradientTo = '#ffffff'
</script>

<template>
    <a
        :href="allowRedirect ? hyperLink.url : '#'"
        target="_self"
        class="group relative block h-44 max-w-96 min-w-80 cursor-pointer drop-shadow-lg transition-all duration-700 ease-in-out group-hover:drop-shadow-2xl"
        @mouseenter="reverseHoverring"
        @mouseleave="reverseHoverring"
    >
        <div
            class="absolute inset-0 rounded-lg transition-opacity duration-1000 ease-in-out"
            :style="{
                background: `linear-gradient(-30deg, ${bgGradientFrom} 0%, ${bgGradientTo} 50%)`,
                opacity: hoverring ? 0 : 1
            }"
        ></div>
        <div
            class="absolute inset-0 rounded-lg transition-opacity duration-1000 ease-in-out"
            :style="{
                background: `linear-gradient(-30deg, ${bgGradientTo} 0%, ${bgGradientFrom} 50%)`,
                opacity: hoverring ? 1 : 0
            }"
        ></div>
        <div class="relative z-20 items-center justify-end pt-12">
            <img
                :src="hyperLink.icon?.filepath"
                class="absolute top-10 left-10 z-20 h-24 w-24 drop-shadow-sm transition-all duration-500 group-hover:-top-10 group-hover:-left-10 group-hover:h-28 group-hover:w-28"
                :alt="hyperLink.title"
            />
            <div class="card-words relative z-30 mr-9 ml-9">
                <p
                    class="card-word absolute right-0 text-lg font-semibold whitespace-nowrap shadow-white drop-shadow-2xl transition-all duration-700 group-hover:right-full group-hover:translate-x-full group-hover:-translate-y-2 group-hover:text-3xl group-hover:font-extrabold dark:text-slate-800"
                >
                    {{ hyperLink.title }}
                </p>
                <p
                    class="card-word absolute top-12 right-0 text-sm whitespace-nowrap shadow-white drop-shadow-2xl transition-all duration-700 group-hover:top-14 group-hover:right-full group-hover:translate-x-full dark:text-slate-600"
                >
                    {{ hyperLink.description }}
                </p>
            </div>
        </div>
    </a>
</template>
