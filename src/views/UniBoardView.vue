<script setup lang="ts">
import { useRouter } from 'vue-router'
import ClockCard from '@/components/ClockCard.vue'
import { useDialog } from 'primevue/usedialog'
import DynamicDialog from 'primevue/dynamicdialog'
import Toast from 'primevue/toast'

const router = useRouter()
const dialog = useDialog()

function router2Landing() {
    router.push('/')
}

// 异步导入组件
// TODO：当用户hover时，预加载组件
// TODO：抽象组件导入函数、按钮事件
function NoteHandler() {
    import('@/components/NoteCard.vue').then((NoteCard) => {
        dialog.open(NoteCard.default, {
            props: {
                modal: true,
                closable: false,
                header: '笔记'
            }
        })
    })
}

function LinkHandler() {
    import('@/components/ShortUrlCard.vue').then((ShortUrlCard) => {
        dialog.open(ShortUrlCard.default, {
            props: {
                modal: true,
                closable: false,
                header: '短链接'
            }
        })
    })
}

function FileHandler() {
    import('@/components/FileCard.vue').then((FileCard) => {
        dialog.open(FileCard.default, {
            props: {
                modal: true,
                closable: false,
                header: '文件'
            }
        })
    })
}

function ConfigHandler() {
    import('@/components/ConfigCard.vue').then((ConfigCard) => {
        dialog.open(ConfigCard.default, {
            props: {
                modal: true,
                closable: false,
                header: '设置'
            }
        })
    })
}
</script>

<template>
    <div class="flex flex-col items-center min-h-screen bg-[#f2f2f2]">
        <ClockCard class="mt-28" />
        <DynamicDialog />
        <Toast />
        <div class="flex justify-between w-2/5 max-w-96 mt-10">
            <i
                class="pi text-black grid place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-pencil"
                @click="NoteHandler"
            ></i>
            <i
                class="pi text-black grid place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-link"
                @click="LinkHandler"
            ></i>
            <i
                class="pi text-black grid place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-copy"
                @click="FileHandler"
            ></i>
            <i
                class="pi text-black grid place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-cog"
                @click="ConfigHandler"
            ></i>
            <i
                class="pi text-black grid place-content-center rounded-xl bg-white w-10 h-10 cursor-pointer transition-all duration-700 hover:drop-shadow-md pi-sign-out"
                @click="router2Landing"
            ></i>
        </div>
    </div>
</template>
