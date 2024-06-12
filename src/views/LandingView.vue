<script setup lang="ts">
import { getSystemInfo } from '@/api/sysInfo'
import type { SystemInfo } from '@/api/sysInfo'
import { ref, onMounted } from 'vue'
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
    <div class="flex h-screen first-page">
        <div
            class="bg-[#f2f2f2] w-4/12 min-w-[35rem] flex flex-col items-center pt-[15vh] shadow-black shadow-ultra z-50"
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
            <p class="font-bold text-6xl font-[arial] mt-12 drop-shadow-xl">{{ sysInfo?.name }}</p>
            <div class="border-t border-[#A0A0A0] border mt-12 w-1/2" />
            <p class="text-[#404040] pt-3 text-lg">
                {{ sysInfo?.profile }}
            </p>
            <div class="flex w-80 justify-around pt-20">
                <template v-for="(url, key) in sysInfo?.contacts" :key="key">
                    <div v-if="url">
                        <a :href="url">
                            <img class="w-6" :src="getSvgPath(key)" :alt="key" />
                        </a>
                    </div>
                </template>
            </div>
        </div>
        <div class="flex-grow">
            <div class="relative h-screen w-full">
                <picture>
                    <source :srcset="sysInfo?.banner + '.avif'" type="image/avif" />
                    <source :srcset="sysInfo?.banner + '.webp'" type="image/webp" />
                    <img
                        :src="sysInfo?.banner + '.jpg'"
                        class="absolute inset-0 object-cover w-full h-full filter brightness-90"
                    />
                </picture>
                <div
                    class="relative flex items-center justify-center h-full w-full pb-10 text-white text-5xl tracking-widest text-shadow-xl"
                >
                    {{ sysInfo?.slogan }}
                </div>
            </div>
        </div>
    </div>
</template>
