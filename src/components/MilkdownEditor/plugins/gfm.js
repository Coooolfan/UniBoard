import { gfm, image, link } from '@milkdown/preset-gfm'
import { defineComponent, inject, h } from 'vue'
import { nodeMetadata } from '@milkdown/vue'
const MyLink = defineComponent({
    name: 'my-link',
    setup(_, { slots }) {
        const node = inject(nodeMetadata, {}).node
        const href = node?.value?.attrs?.href
        return () => h('a', { target: '_blank', href }, slots.default?.())
    }
})

export default (renderVue) =>
    gfm
        .configure(image, {
            placeholder: '添加图片',
            input: {
                placeholder: '请输入图片地址',
                buttonText: '确认'
            }
        })
        .configure(link, {
            view: renderVue(MyLink),
            input: {
                placeholder: '请输入链接地址',
                buttonText: '确认'
            }
        })
