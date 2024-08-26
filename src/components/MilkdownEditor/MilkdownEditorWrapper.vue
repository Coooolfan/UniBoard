<!--
 * @Author: cyy
 * @Date: 2024-06-03 18:39:43
 * @LastEditors: cyy
 * @LastEditTime: 2024-07-01 18:31:41
 * @Description: 
-->
<template>
    <MilkdownProvider>
        <ProsemirrorAdapterProvider>
            <MilkdownEditor
                v-model="doc"
                ref="editorRef"
                :config="config"
                @save="emit('save', $event)"
                :uploader="uploader"
            />
        </ProsemirrorAdapterProvider>
    </MilkdownProvider>
</template>

<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import MilkdownEditor from './MilkdownEditor.vue'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import { ref } from 'vue'
const doc = defineModel({ type: String })
const props = defineProps({
    config: {
        type: Object,
        default: () => ({
            readonly: false,
            menu: true,
            theme: 'auto'
        })
    },
    uploader: {
        type: Function,
        default: () => () => Promise.resolve('')
    }
})
const emit = defineEmits(['save'])
const editorRef = ref(null)

defineExpose({
    setValue: (md) => editorRef.value.setValue(md),
    getHtml: () => editorRef.value.getHtml(),
    getOutline: () => editorRef.value.getOutline(),
    getMarkdown: () => editorRef.value.getMarkdown(),
    editorInstance: editorRef.value?.editorInstance
})
</script>
