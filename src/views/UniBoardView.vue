<script setup lang="ts">
import { useRouter } from 'vue-router'
import ClockCard from '@/components/ClockCard.vue'
import { useDialog } from 'primevue/usedialog'
import DynamicDialog from 'primevue/dynamicdialog'
import Toast from 'primevue/toast'
import { defineAsyncComponent, nextTick, onMounted, type Component } from 'vue'

const router = useRouter()
const dialog = useDialog()

function router2Landing() {
    router.push('/')
}

// 异步导入组件
// Vite 不支持动态导入，import() 必须传入静态字符串

onMounted(async () => {
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
                header: componentNameMap[componentName]
            }
        })
    } else {
        console.error(`组件 "${componentName}" 未找到`)
    }
}
</script>

<template>
    <div class="flex flex-col items-center min-h-screen bg-[#f2f2f2]">
        <ClockCard class="mt-28" />
        <DynamicDialog />
        <Toast />
        <div class="flex justify-between w-2/5 max-w-96 mt-10">
            <i
                class="pi text-black place-content-center before:grid before:place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-pencil"
                @click="IHandler('Note')"
            ></i>
            <i
                class="pi text-black place-content-center before:grid before:place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-link"
                @click="IHandler('Link')"
            ></i>
            <i
                class="pi text-black place-content-center before:grid before:place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-copy"
                @click="IHandler('File')"
            ></i>
            <i
                class="pi text-black place-content-center before:grid before:place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-cog"
                @click="IHandler('Config')"
            ></i>
            <i
                class="pi text-black place-content-center before:grid before:place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-sign-out"
                @click="router2Landing"
            ></i>
        </div>
    </div>
</template>
