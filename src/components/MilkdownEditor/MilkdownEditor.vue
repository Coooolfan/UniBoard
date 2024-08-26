<!--
 * @Author: cyy
 * @Date: 2024-06-03 18:38:34
 * @LastEditors: cyy
 * @LastEditTime: 2024-07-22 18:34:41
 * @Description: 
-->
<template>
  <Milkdown />
</template>

<script setup>
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core'
import { nord } from './theme/nord'
import { Milkdown, useEditor } from '@milkdown/vue'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { getHTML, outline, replaceAll, getMarkdown } from '@milkdown/utils'
import useTooltip from './plugins/tooltip/index'
import useSlash from './plugins/slash/index'

const doc = defineModel({ type: String })
let editorInstance
const { tooltip, setTooltip } = useTooltip()
const { slash, setSlash } = useSlash()
useEditor((root) => {
    editorInstance = Editor.make()
        .config(nord)
        .config((ctx) => {
            ctx.set(rootCtx, root)
            ctx.set(defaultValueCtx, doc.value)
            setTooltip(ctx)
            setSlash(ctx)
        })
        .use(commonmark)
        .use(gfm)
        .use(tooltip)
        .use(slash)
    return editorInstance
})
defineExpose({
    editorInstance,
    setValue: (md) => editorInstance.action(replaceAll(md)),
    getMarkdown: () => editorInstance.action(getMarkdown()),
    getHtml: () => editorInstance.action(getHTML()),
    getOutline: () => editorInstance.action(outline())
})
</script>
