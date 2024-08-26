<!--
 * @Author: cyy
 * @Date: 2022-07-20 11:58:55
 * @LastEditors: cyy
 * @LastEditTime: 2024-07-22 17:57:36
 * @Description: markdown编辑器
-->
<template>
    <div class="md" ref="mdRef"></div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { EditorState } from '@codemirror/state'
import {
    autocompletion,
    closeBrackets,
    closeBracketsKeymap,
    completionKeymap
} from '@codemirror/autocomplete'
import {
    crosshairCursor,
    drawSelection,
    dropCursor,
    EditorView,
    highlightActiveLine,
    highlightActiveLineGutter,
    highlightSpecialChars,
    keymap,
    lineNumbers,
    rectangularSelection
} from '@codemirror/view'
import {
    bracketMatching,
    defaultHighlightStyle,
    foldGutter,
    foldKeymap,
    indentOnInput,
    syntaxHighlighting
} from '@codemirror/language'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'

const props = defineProps({
    modelValue: {
        type: String,
        defalut: ''
    },
    dark: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:modelValue', 'save', 'switchEditor'])
const mdRef = ref(null)
const mdFocus = ref(false)
const baseTheme = EditorView.baseTheme({
    '&.cm-editor.cm-focused': {
        outline: 'none'
    },
    '&light .cm-o-replacement': {
        backgroundColor: '#04c'
    },
    '&dark': {
        color: 'rgba(236, 239, 244, 0.87)',
        backgroundColor: '#2e3440'
    },
    '&dark.ͼ3 .ͼc': {
        color: '#95d3ff'
    },
    '&dark.cm-content': {
        caretColor: '#0e9'
    },
    '&dark.cm-focused .cm-cursor': {
        borderLeftColor: '#074'
    },
    '&dark.cm-focused .cm-selectionBackground, ::selection': {
        backgroundColor: '#252932'
    },
    '&dark.ͼ3 .cm-activeLine': {
        backgroundColor: '#252932'
    },
    '&dark.ͼ3 .cm-gutters': {
        backgroundColor: '#252932',
        color: '#ccc',
        border: 'none'
    }
})

const createState = (doc, dark = false) =>
    EditorState.create({
        doc,
        extensions: [
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            foldGutter(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            rectangularSelection(),
            crosshairCursor(),
            highlightActiveLine(),
            highlightSelectionMatches(),
            keymap.of([
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
                {
                    key: 'Mod-/',
                    run() {
                        emit('switchEditor')
                        return true
                    }
                },
                {
                    key: 'Mod-s',
                    run() {
                        emit('save')
                        return true
                    }
                }
            ]),
            markdown(),
            baseTheme,
            EditorView.theme({}, { dark }),
            EditorView.updateListener.of((v) => {
                if (v.focusChanged) {
                    mdFocus.value = v.view.hasFocus
                }
                if (v.docChanged) {
                    emit('update:modelValue', v.state.doc.toString())
                }
            })
        ]
    })
let view
onMounted(() => {
    view = new EditorView({
        state: createState(props.modelValue),
        parent: mdRef.value
    })
})
watch([() => props.modelValue, () => props.dark], () => {
    if (!mdFocus.value) {
        view.setState(createState(props.modelValue, props.dark))
    }
})
</script>
