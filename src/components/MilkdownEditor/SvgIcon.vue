<!--
 * @Author: cyy
 * @Date: 2024-07-22 17:50:45
 * @LastEditors: cyy
 * @LastEditTime: 2024-07-22 18:00:43
 * @Description: 
-->
<template>
  <svg :style="svgStyle" aria-hidden="true">
    <use :xlink:href="symbolId" :style="style" />
  </svg>
</template>

<script>
import 'virtual:svg-icons-register'
import { defineComponent, computed } from 'vue'
export default defineComponent({
    name: 'SvgIcon',
    props: {
        prefix: {
            type: String,
            default: 'icon'
        },
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: '#000'
        },
        size: {
            type: [Number, String],
            default: 16
        }
    },
    setup(props) {
        const symbolId = computed(() => `#${props.prefix}-${props.name}`)
        const style = computed(() => {
            const r = {}
            if (props.color) {
                r.color = props.color
            }
            return r
        })
        const svgStyle = computed(() => {
            const r = {}
            if (props.size) {
                r.width = `${props.size}px`
                r.height = `${props.size}px`
            }
            return r
        })
        return { symbolId, style, svgStyle }
    }
})
</script>
