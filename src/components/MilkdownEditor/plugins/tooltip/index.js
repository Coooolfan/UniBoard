import { tooltipFactory } from '@milkdown/plugin-tooltip'
import { usePluginViewFactory } from '@prosemirror-adapter/vue'
import Tooltip from './Tooltip.vue'

export default () => {
    const tooltip = tooltipFactory('my-tooltip')
    const pluginViewFactory = usePluginViewFactory()

    const setTooltip = (ctx) => {
        ctx.set(tooltip.key, {
            view: pluginViewFactory({
                component: Tooltip
            })
        })
    }
    return {
        tooltip,
        setTooltip
    }
}
