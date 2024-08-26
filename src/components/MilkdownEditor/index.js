/*
 * @Author: cyy
 * @Date: 2021-10-14 18:47:03
 * @LastEditors: cyy
 * @LastEditTime: 2024-07-22 18:00:54
 * @Description:
 */
// import './font/iconfont.css'
import { defineComponent, h, watch, ref } from 'vue'
// import { Editor, rootCtx, defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
// import { forceUpdate, getHTML, outline, replaceAll, $shortcut } from '@milkdown/utils'
// import { Milkdown, useEditor } from '@milkdown/vue'
// import { history } from '@milkdown/plugin-history'
// import { cursor } from '@milkdown/plugin-cursor'
// import { prism } from '@milkdown/plugin-prism'
// import { TooltipProvider } from '@milkdown/plugin-tooltip'
// import { emoji } from '@milkdown/plugin-emoji'
// import { clipboard } from '@milkdown/plugin-clipboard'
// import { math } from '@milkdown/plugin-math'
// import { indent, indentPlugin } from '@milkdown/plugin-indent'
// import { diagram } from '@milkdown/plugin-diagram'
// import { listener, listenerCtx } from '@milkdown/plugin-listener'
// import slash from './plugins/slash'
// import { nord, nordDark, nordLight } from './theme'
// import { nord } from "@milkdown/theme-nord";
// import gfm from './plugins/gfm'
// import block from './plugins/block'
// import menu from './plugins/menu'
// import getUploader from './plugins/uploder'
// import 'katex/dist/katex.min.css'
// import './theme/code.css'
// import mdEditor from './MdEditor.vue'
// import { usePluginViewFactory } from '@prosemirror-adapter/vue';
// import Slash from './plugins/Slash.vue';
// import { slashFactory } from '@milkdown/plugin-slash';

// import { useTootip } from './plugins/tooltip'
import MilkdownEditorWrapper from './MilkdownEditorWrapper.vue'
// const slashTooltip = slashFactory('Commands');
export default defineComponent({
    props: {
        modelValue: {
            type: String
        },
        config: {
            type: Object,
            default: () => ({
                menu: false,
                readonly: false,
                theme: 'auto' // dark, light, 自动
            })
        },
        uploader: {
            type: Function
        }
    },
    emits: ['update:modelValue'],
    setup(props, { expose, emit }) {
        const doc = ref(props.modelValue)
        const showMDEditor = ref(false)
        let editorInstance
        // 自定义快捷键
        // const myShortcut = $shortcut((ctx) => ({
        //   'Mod-s': () => {
        //     emit('save', doc.value)
        //     return true
        //   },
        //   'Mod-/': () => {
        //     showMDEditor.value = !showMDEditor.value
        //     return true
        //   }
        // }))
        // const pluginViewFactory = usePluginViewFactory();
        // const editor = useEditor((root, renderVue) => {
        // editorInstance = Editor.make()
        // .config((ctx) => {
        // ctx.set(rootCtx, root)
        // ctx.set(defaultValueCtx, doc.value)
        // 是否为只读
        // ctx.set(editorViewOptionsCtx, { editable: () => !props.config.readonly })
        // 监听内容更新
        // ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
        //   doc.value = markdown
        //   emit('update:modelValue', markdown)
        // })
        // ctx.set(slashTooltip.key, {
        //   view: pluginViewFactory({
        //     component: Slash
        //   }),
        // })
        // useTootip(ctx)
        // ctx.get(listenerCtx).updated((ctx, doc, prevDoc) => {
        //   console.log(doc.toJSON())
        // });
        // })
        // .use(listener)
        // .use(myShortcut)
        // .use(gfm(renderVue))
        // .use(block)
        // .use(history)
        // .use(clipboard)
        // .use(math)
        // .use(prism)
        // .use(cursor)
        // .use(slash)
        // .use(emoji)
        // .use(diagram)
        // .use(getUploader(props.uploader))
        // .use(
        //   indent.configure(indentPlugin, {
        //     type: 'space', // available values: 'tab', 'space',
        //     size: 2
        //   })
        // )

        // 菜单显示
        // if (props.config.menu) {
        //   editorInstance.use(menu)
        // }
        // 主题配置
        // switch (props.config.theme) {
        // case 'dark':
        //   editorInstance.use(nordDark)
        //   break
        // case 'light':
        //   editorInstance.use(nordLight)
        //   break
        // default:
        // 自动切换主题
        // editorInstance.use(nord)
        // }
        // return editorInstance
        // })

        // 只读切换
        // watch(
        //   () => props.config,
        //   () => {
        //     editorInstance.action(forceUpdate())
        //     // editorInstance.action(switchTheme(props.config.theme === 'dark' ? nordDark : nordLight))
        //   },
        //   { deep: true }
        // )

        // expose({
        //   editorInstance,
        //   loading: editor.loading,
        //   setValue: (md) => editorInstance.action(replaceAll(md)),
        //   // 返回HTML
        //   getHtml: () => editorInstance.action(getHTML()),
        //   // 获取大纲
        //   getOutline: () => editorInstance.action(outline())
        // })

        return () =>
            h('div', {}, [
                h(MilkdownEditorWrapper)
                // h(MilkdownEditorWrapper, { style: { display: showMDEditor.value ? 'none' : 'block' } }),
                // h(mdEditor, {
                //   style: { display: showMDEditor.value ? 'block' : 'none' },
                //   modelValue: doc.value,
                //   dark: props.config.theme === 'dark',
                //   onSave: () => emit('save', doc.value),
                //   onSwitchEditor: () => {
                //     showMDEditor.value = !showMDEditor.value
                //   },
                //   'onUpdate:modelValue': (v) => {
                //     emit('update:modelValue', v)
                //     editorInstance.action(replaceAll(v))
                //   }
                // })
            ])
    }
})
