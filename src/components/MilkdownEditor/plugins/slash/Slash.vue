<template>
  <div ref="divRef" role="tooltip" @mousedown.prevent.stop="mousedown" @mouseup.prevent.stop class="slash">
    <ul v-for="(group, index) in menuList" :key="index" :class="group.class">
      <li
        v-for="item in group.list"
        :key="item.idx"
        @mousemove.prevent="activeIdx = item.idx"
        @mousedown.prevent="select(item)"
        :title="item.title"
        :index="item.idx"
        :class="{ active: item.idx === activeIdx }"
      >
        <SvgIcon :name="item.icon" />
        <label v-if="item.label">{{ item.label }}</label>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { editorViewCtx } from '@milkdown/core'
import { SlashProvider } from '@milkdown/plugin-slash'
import {
    createCodeBlockCommand,
    insertHrCommand,
    wrapInHeadingCommand,
    wrapInBlockquoteCommand,
    wrapInBulletListCommand,
    wrapInOrderedListCommand,
    toggleInlineCodeCommand,
    insertImageCommand
} from '@milkdown/preset-commonmark'
import { insertTableCommand } from '@milkdown/preset-gfm'
import { callCommand } from '@milkdown/utils'
import { useInstance } from '@milkdown/vue'
import { usePluginViewContext } from '@prosemirror-adapter/vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import SvgIcon from '../../SvgIcon.vue'

const { view, prevState } = usePluginViewContext()
const [loading, get] = useInstance()

const divRef = ref()
const menuList = [
    {
        class: 'inline',
        list: [
            { idx: 1, cmd: wrapInHeadingCommand.key, title: '标题一', icon: 'h1', payload: 1 },
            { idx: 2, cmd: wrapInHeadingCommand.key, title: '标题二', icon: 'h2', payload: 2 },
            { idx: 3, cmd: wrapInHeadingCommand.key, title: '标题三', icon: 'h3', payload: 3 },
            { idx: 4, cmd: wrapInHeadingCommand.key, title: '标题四', icon: 'h4', payload: 4 },
            { idx: 5, cmd: wrapInBulletListCommand.key, title: '无序列表', icon: 'list' },
            { idx: 6, cmd: wrapInOrderedListCommand.key, title: '有序列表', icon: 'list-numbers' }
        ]
    },
    {
        list: [
            // { idx: 7, cmd: toggleInlineCodeCommand.key, label: '行内代码', icon: 'code' },
            { idx: 7, cmd: insertTableCommand.key, label: '插入表格', icon: 'table' },
            { idx: 8, cmd: wrapInBlockquoteCommand.key, label: '引用', icon: 'quote' },
            { idx: 9, cmd: createCodeBlockCommand.key, label: '代码块', icon: 'code' },
            { idx: 10, cmd: insertHrCommand.key, label: '分割线', icon: 'dividing-line' },
            { idx: 11, cmd: insertImageCommand.key, label: '插入图片', icon: 'picture' }
        ]
    }
]
let slashProvider
const activeIdx = ref(0)
onMounted(() => {
    slashProvider = new SlashProvider({
        content: divRef.value,
        debounce: 50
    })

    slashProvider.update(view.value, prevState.value)
})

watch([view, prevState], () => {
    console.log(view.value, prevState.value)
    slashProvider?.update(view.value, prevState.value)
})

onUnmounted(() => {
    slashProvider.destroy()
})

const removeSlash = (ctx) => {
    const view = ctx.get(editorViewCtx)
    const { dispatch, state } = view
    const { tr, selection } = state
    const { from } = selection
    dispatch(tr.deleteRange(from - 1, from))
}

const select = (item) => {
    if (loading.value) return
    get().action((ctx) => {
        removeSlash(ctx)
        return callCommand(item.cmd, item.payload)(ctx)
    })
}
const mousedown = () => {
    console.log('===')
}
</script>
<style lang="less" scoped>
.slash {
    position: absolute;
    display: none;
    @apply overflow-hidden text-gray-600 bg-white border rounded;

    &[data-show='true'] {
        display: block;
    }

    ul {
        list-style: none;
        padding: 10px;
        border-bottom: 1px solid #e4e7ed;

        &:last-child {
            padding-bottom: 10px;
        }

        &.inline {
            display: flex;

            li {
                width: 32px;
                height: 32px;
            }
        }

        li {
            display: flex;
            align-items: center;
            cursor: pointer;
            @apply text-gray-600 px-2 py-1 rounded hover:bg-slate-100 hover:text-gray-900;

            &.active {
                @apply bg-slate-100 text-gray-900;
            }

            label {
                cursor: pointer;
                margin-left: 16px;
                font-size: 0.9rem;
            }
        }
    }
}
</style>
