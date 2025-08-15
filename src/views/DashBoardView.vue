<script setup lang="ts">
import { useRouter } from 'vue-router'
import ClockCard from '@/components/ClockCard.vue'
import { useDialog } from 'primevue/usedialog'
import DynamicDialog from 'primevue/dynamicdialog'
import Toast from 'primevue/toast'
import { defineAsyncComponent, nextTick, onMounted, type Component } from 'vue'
import { api } from '@/ApiInstance'
import ProbeMap from '@/components/probe/ProbeMap.vue'
import ProbeTargetPanels from '@/components/probe/ProbeTargetPanels.vue'

const router = useRouter()
const dialog = useDialog()

function router2Landing() {
    router.push('/')
}

// 异步导入组件
// Vite 不支持动态导入，import() 必须传入静态字符串

onMounted(async () => {
    api.tokenController.refreshToken()
    await nextTick()
    import('@/components/NoteCard.vue')
    import('@/components/ShortUrlCard.vue')
    import('@/components/FileCard.vue')
    import('@/components/ConfigCard/ConfigCard.vue')
})

// 组件映射
const componentMap: Record<string, Component> = {
    Note: defineAsyncComponent(() => import('@/components/NoteCard.vue')),
    Link: defineAsyncComponent(() => import('@/components/ShortUrlCard.vue')),
    File: defineAsyncComponent(() => import('@/components/FileCard.vue')),
    Config: defineAsyncComponent(() => import('@/components/ConfigCard/ConfigCard.vue'))
}

const componentNameMap: Record<string, string> = {
    Note: '笔记',
    Link: '链接',
    File: '文件',
    Config: '设置'
}

function IHandler(componentName: string) {
    const component = componentMap[componentName]
    if (component) {
        dialog.open(component, {
            props: {
                modal: true,
                closable: false,
                header: componentNameMap[componentName],
                maximizable: true,
                style: {
                    width: '80vw'
                }
            }
        })
    } else {
        console.error(`组件 "${componentName}" 未找到`)
    }
}
</script>

<template>
    <DynamicDialog />
    <Toast />
    <div class="flex h-screen w-screen flex-col items-center justify-between">
        <div class="relative z-50 flex flex-col items-center">
            <ClockCard class="mt-36 lg:mt-28" />
            <div class="mt-10 flex justify-between gap-4 md:gap-10 lg:gap-12">
                <i
                    class="pi pi-pencil h-10 w-10 cursor-pointer place-content-center rounded-xl bg-white/90 text-black drop-shadow-sm backdrop-blur-xs transition-all duration-300 before:grid before:place-content-center hover:scale-101 hover:drop-shadow-lg"
                    @click="IHandler('Note')"
                ></i>
                <i
                    class="pi pi-link h-10 w-10 cursor-pointer place-content-center rounded-xl bg-white/90 text-black drop-shadow-sm backdrop-blur-xs transition-all duration-300 before:grid before:place-content-center hover:scale-101 hover:drop-shadow-lg"
                    @click="IHandler('Link')"
                ></i>
                <i
                    class="pi pi-copy h-10 w-10 cursor-pointer place-content-center rounded-xl bg-white/90 text-black drop-shadow-sm backdrop-blur-xs transition-all duration-300 before:grid before:place-content-center hover:scale-101 hover:drop-shadow-lg"
                    @click="IHandler('File')"
                ></i>
                <i
                    class="pi pi-cog h-10 w-10 cursor-pointer place-content-center rounded-xl bg-white/90 text-black drop-shadow-sm backdrop-blur-xs transition-all duration-300 before:grid before:place-content-center hover:scale-101 hover:drop-shadow-lg"
                    @click="IHandler('Config')"
                ></i>
                <i
                    class="pi pi-sign-out h-10 w-10 cursor-pointer place-content-center rounded-xl bg-white/90 text-black drop-shadow-sm backdrop-blur-xs transition-all duration-300 before:grid before:place-content-center hover:scale-101 hover:drop-shadow-lg"
                    @click="router2Landing"
                ></i>
            </div>
        </div>
        <ProbeTargetPanels />
    </div>  
    <div class="fixed top-0 left-0 z-0 h-full w-full bg-[#80ADD1] brightness-80">
        <ProbeMap />
    </div>
</template>
