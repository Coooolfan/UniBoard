<script setup lang="ts">
import { getSystemInfo } from '@/api/sysInfo'
import type { SystemInfo } from '@/api/sysInfo'
import { ref, onMounted } from 'vue'
import LandingPageLink from '@/components/LandingPageLink.vue'
const sysInfo = ref<SystemInfo | null>(null)
onMounted(async () => {
    sysInfo.value = await getSystemInfo()
    // 修改页面标题和头像
    document.title = sysInfo.value.name
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    favicon.href = sysInfo.value.avatar + '.avif'
})
function getSvgPath(name: string) {
    // 使用动态import语法导入SVG文件
    // https://www.iconfinder.com/
    return new URL(`../assets/svg/${name}.svg`, import.meta.url).href
}
</script>
<template>
    <div class="h-screen first-page relative bg-green-500 -z-10">
        <svg
            class="h-screen w-auto absolute top-0 left-0 z-20 drop-shadow-5xl shadow-black"
            width="1638.389"
            height="2160"
            viewBox="0 0 433.49 571.5"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <clipPath id="a">
                    <path fill="none" stroke-width=".321" d="M0 0h475.949v571.5H0z" />
                </clipPath>
            </defs>
            <path
                d="M-20.43-12.51l417.518 1.042s92.666 30.194-17.7 329.016-58.307 266.545-58.307 266.545l-4.164 64.554-369.624-9.37z"
                clip-path="url(#a)"
                fill="#f2f2f2"
            />
        </svg>
        <picture>
            <source :srcset="sysInfo?.banner + '.avif'" type="image/avif" />
            <source :srcset="sysInfo?.banner + '.webp'" type="image/webp" />
            <img
                :src="sysInfo?.banner + '.jpg'"
                class="absolute inset-0 object-cover w-full h-full filter brightness-90"
            />
        </picture>
        <div class="flex">
            <div
                class="w-4/12 min-w-[35rem] flex flex-col items-center pt-[15vh] z-30 translate-x-6"
            >
                <picture>
                    <source :srcset="sysInfo?.avatar + '.avif'" type="image/avif" />
                    <source :srcset="sysInfo?.avatar + '.webp'" type="image/webp" />
                    <img
                        :src="sysInfo?.avatar + '.jpg'"
                        class="rounded-full w-60 border-10 border-gray-200 shadow-md cursor-pointer"
                        alt="avater"
                    />
                </picture>
                <p class="font-bold text-6xl font-[arial] mt-12 drop-shadow-xl">
                    {{ sysInfo?.name }}
                </p>
                <div class="border-[#A0A0A0] border border-t-0 border-l-0 border-r-0 mt-20 w-3/5" />
                <p class="text-[#404040] mt-5 text-lg">
                    {{ sysInfo?.profile }}
                </p>
                <div class="flex w-80 justify-around mt-24">
                    <template v-for="(url, key) in sysInfo?.contacts" :key="key">
                        <div v-if="url">
                            <a :href="url">
                                <img class="w-6" :src="getSvgPath(key)" :alt="key" />
                            </a>
                        </div>
                    </template>
                </div>
            </div>
            <div class="flex-grow z-10">
                <div class="relative h-screen w-full">
                    <div
                        class="relative flex items-center justify-center h-full w-full pb-10 text-white text-5xl tracking-widest text-shadow-xl"
                    >
                        {{ sysInfo?.slogan }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div
        class="flex h-screen second-page items-center w-auto bg-[#f2f2f2] flex-col shadow-inner z-20"
    >
        <p class="text-4xl font-extrabold mt-[10vh]">选择一个页面以继续</p>
        <div class="border-[#A0A0A0] border border-t-0 border-l-0 border-r-0 mt-5 mb-5 w-1/2" />
        <p class="text-base mb-20 italic text-gray-800">此页面的中的内容并非全部公开项</p>
        <div class="grid w-4/5 grid-cols-2 mx-auto">
            <template v-for="link in sysInfo?.links" :key="link.id">
                <LandingPageLink :linkData="link" />
            </template>
        </div>
    </div>
</template>
