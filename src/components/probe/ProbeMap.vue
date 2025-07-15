<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'
import {
    TooltipComponent,
    type TooltipComponentOption,
    GeoComponent,
    type GeoComponentOption
} from 'echarts/components'
import { EffectScatterChart, type EffectScatterSeriesOption } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import icelandSvg from '@/assets/Map_of_Iceland.svg?raw'

echarts.use([
    TooltipComponent,
    GeoComponent,
    EffectScatterChart,
    CanvasRenderer,
    UniversalTransition
])

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | GeoComponentOption | EffectScatterSeriesOption
>

const map = ref<HTMLElement | null>(null)
let myChart: echarts.ECharts | null = null

onMounted(() => {
    if (!map.value) return

    myChart = echarts.init(map.value)

    if (!myChart) return

    echarts.registerMap('iceland_svg', { svg: icelandSvg })

    const option: EChartsOption = {
        tooltip: {},
        geo: {
            tooltip: {
                show: true
            },
            map: 'iceland_svg',
            roam: true
        },
        series: {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            symbolSize: function (params) {
                return (params[2] / 100) * 15 + 5
            },
            itemStyle: {
                color: '#b02a02'
            },
            encode: {
                tooltip: 2
            },
            data: [
                [488.2358421078053, 459.70913833075736, 100],
                [770.3415644319939, 757.9672194986475, 30],
                [1180.0329284196291, 743.6141808346214, 80],
                [894.03790632245, 1188.1985153835008, 61],
                [1372.98925630313, 477.3839988649537, 70],
                [1378.62251255796, 935.6708486282843, 81]
            ]
        }
    }

    myChart.setOption(option)

    myChart.getZr().on('click', function (params) {
        const pixelPoint = [params.offsetX, params.offsetY]
        const dataPoint = myChart?.convertFromPixel({ geoIndex: 0 }, pixelPoint)
        console.log(dataPoint)
    })
})

onUnmounted(() => {
    if (myChart) {
        myChart.dispose()
        myChart = null
    }
})
</script>

<template>
    <div ref="map" class="h-full w-full"></div>
</template>
