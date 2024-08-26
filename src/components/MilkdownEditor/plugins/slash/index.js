import { slashFactory } from '@milkdown/plugin-slash'
import { usePluginViewFactory } from '@prosemirror-adapter/vue'
import Slash from './Slash.vue'
import { ref } from 'vue'
const inspectKeys = ['ArrowDown', 'ArrowUp', 'Enter']
export default () => {
    const slashMenu = slashFactory('slashMenu')
    const pluginViewFactory = usePluginViewFactory()
    const opened = ref(false)
    const setSlash = (ctx) => {
        ctx.set(slashMenu.key, {
            props: {
                handleKeyDown: (view, event) => {
                    console.log(ctx.get(slashMenu.key), event.key)
                    // if (opened.value && event.key !== 'Escape') {
                    //   return true
                    // } else {
                    //   opened.value = false
                    // }
                    // if (event.key === '/') {
                    //   opened.value = true
                    // }
                    // return false
                    // if (!ctx.get(slashMenu.key).opened) {
                    //   return false;
                    // }
                    // return inspectKeys.includes(event.key);
                }
            },
            view: pluginViewFactory({
                component: Slash
            })
            // opened: false
        })
    }
    return {
        slash: slashMenu,
        setSlash
    }
}
