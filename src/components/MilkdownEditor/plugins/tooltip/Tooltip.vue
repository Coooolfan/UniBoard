<template>
    <div ref="divRef" class="tooltip">
        <button @mousedown.prevent="toggle('toggleStrongCommand')">
            <SvgIcon name="text-bold" />
        </button>
        <button @mousedown.prevent="toggle('toggleEmphasisCommand')">
            <SvgIcon name="text-italic" />
        </button>
        <button @mousedown.prevent="toggle('toggleStrikethroughCommand')">
            <SvgIcon name="strikethrough" />
        </button>
        <button @mousedown.prevent="toggle('wrapInBlockquoteCommand')">
            <SvgIcon name="quote" />
        </button>
        <button @mousedown.prevent="toggle('toggleInlineCodeCommand')">
            <SvgIcon name="code" />
        </button>
        <button @mousedown.prevent="toggle('toggleLinkCommand')">
            <SvgIcon name="link" />
        </button>
    </div>
</template>

<script setup>
import SvgIcon from '../../SvgIcon.vue'
import { TooltipProvider } from '@milkdown/plugin-tooltip'
import {
    toggleStrongCommand,
    toggleInlineCodeCommand,
    toggleLinkCommand,
    toggleEmphasisCommand,
    wrapInBlockquoteCommand
} from '@milkdown/preset-commonmark'
import { toggleStrikethroughCommand } from '@milkdown/preset-gfm'
import { callCommand } from '@milkdown/utils'
import { useInstance } from '@milkdown/vue'
import { usePluginViewContext } from '@prosemirror-adapter/vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const { view, prevState } = usePluginViewContext()
const [loading, get] = useInstance()

const divRef = ref(null)

let tooltipProvider

onMounted(() => {
    tooltipProvider = new TooltipProvider({
        content: divRef.value
    })

    tooltipProvider.update(view.value, prevState.value)
})

watch([view, prevState], () => {
    tooltipProvider?.update(view.value, prevState.value)
})

onUnmounted(() => {
    tooltipProvider.destroy()
})

const toggleMap = {
    toggleStrongCommand: toggleStrongCommand.key,
    toggleInlineCodeCommand: toggleInlineCodeCommand.key,
    toggleLinkCommand: toggleLinkCommand.key,
    toggleEmphasisCommand: toggleEmphasisCommand.key,
    toggleStrikethroughCommand: toggleStrikethroughCommand.key,
    wrapInBlockquoteCommand: wrapInBlockquoteCommand.key
}
const toggle = (t) => {
    if (loading.value) return
    get().action(callCommand(toggleMap[t], ''))
}
</script>
<style lang="less" scoped>
.tooltip {
    position: absolute;
    display: none;
    @apply overflow-hidden text-gray-600 bg-white border rounded;

    &[data-show='true'] {
        display: block;
    }

    button {
        @apply text-gray-600 p-2 hover:bg-slate-100 hover:text-gray-900;
    }
}
</style>
