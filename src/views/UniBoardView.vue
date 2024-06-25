<script setup lang="ts">
import { useRouter } from 'vue-router'
import ClockCard from '@/components/ClockCard.vue'
import { removeToken } from '@/api/auth'
import { useDialog } from 'primevue/usedialog'
import DynamicDialog from 'primevue/dynamicdialog'
import ConfigCard from '@/components/ConfigCard.vue'
import NoteCard from '@/components/NoteCard.vue'
import LinkCard from '@/components/LinkCard.vue'
import FileCard from '@/components/FileCard.vue'
import { ref } from 'vue'

const router = useRouter()
const dialog = useDialog()

function signOut() {
    removeToken()
    router.push('/')
}

function NoteHandler() {
    dialog.open(NoteCard, {
        props: {
            modal: true,
            closable: false
        }
    })
}

function LinkHandler() {
    dialog.open(LinkCard, {
        props: {
            modal: true,
            closable: false
        }
    })
}

function FileHandler() {
    dialog.open(FileCard, {
        props: {
            modal: true,
            closable: false
        }
    })
}

function ConfigHandler() {
    dialog.open(ConfigCard, {
        props: {
            modal: true,
            closable: false,
            header: '设置',
            maximizable: true
        }
    })
}
// TODO
// 0. 设置以浮窗的形式展示
// 1. 着陆页首屏的设置
// 2. 着陆页的第二屏的设置
</script>
<template>
    <div class="flex flex-col items-center min-h-screen bg-[#f2f2f2]">
        <ClockCard class="mt-28" />
        <DynamicDialog />
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
                @click="signOut"
            ></i>
        </div>
    </div>
</template>
