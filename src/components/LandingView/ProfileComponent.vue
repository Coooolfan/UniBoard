<script setup lang="ts">
import type { UserInfo } from '@/api/userInfo'
import type { PropType } from 'vue'

defineProps({
    userInfo: {
        type: Object as PropType<UserInfo>,
        required: true
    },
    fontFamily: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['switchSloganType'])
function getSvgPath(name: string) {
    // 使用动态import语法导入SVG文件
    // https://www.iconfinder.com/
    return new URL(`/src/assets/svg/${name}.svg`, import.meta.url).href
}
function switchSloganType() {
    // 通过emit触发父组件的事件
    emit('switchSloganType')
}
</script>
<template>
    <div class="flex flex-col items-center justify-center gap-4 z-30 translate-x-0 transition-all">
        <picture>
            <img
                :src="userInfo.avatar"
                class="rounded-full object-cover w-52 h-52 shadow-md"
                alt="avater"
            />
        </picture>
        <span
            class="font-bold text-6xl mt-12 drop-shadow-xl z-50 cursor-pointer text-slate-800"
            @click="switchSloganType()"
            :style="{ fontFamily: fontFamily }"
        >
            {{ userInfo.name }}
        </span>
        <div class="border-[#A0A0A0] border border-t-0 border-l-0 border-r-0 mt-18 w-2/5" />
        <span class="text-slate-600 mt-5 text-lg">
            {{ userInfo.profile }}
        </span>
        <div class="flex w-80 justify-around mt-24">
            <template v-for="(url, key) in userInfo.contacts" :key="key">
                <a :href="url" v-if="url">
                    <img class="w-6" :src="getSvgPath(key)" :alt="key" />
                </a>
            </template>
        </div>
    </div>
</template>
