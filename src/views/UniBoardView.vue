<script setup lang="ts">
import { useRouter } from 'vue-router'
import ClockCard from '@/components/ClockCard.vue'
import { useDialog } from 'primevue/usedialog'
import DynamicDialog from 'primevue/dynamicdialog'
import ConfigCard from '@/components/ConfigCard.vue'
import NoteCard from '@/components/NoteCard.vue'
import LinkCard from '@/components/ShortLinkCard.vue'
import FileCard from '@/components/FileCard.vue'
import Toast from 'primevue/toast'
const router = useRouter()
const dialog = useDialog()

function router2Landing() {
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
            closable: false,
            header: '短链接',
            maximizable: true
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
