<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'
import { GeoComponent } from 'echarts/components'
import { EffectScatterChart } from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import worldMap from '@/assets/world.json?raw'
import type { ProbeTargetDto } from '@/__generated/model/dto'
import { api } from '@/ApiInstance'

echarts.use([GeoComponent, SVGRenderer, EffectScatterChart])

const map = ref<HTMLElement | null>(null)
let myChart: echarts.ECharts | null = null
const probeTargets = ref<ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET'][]>([])

async function fetchData() {
    try {
        const targets = await api.probeController.getAllProbeTargets()
        probeTargets.value = [...targets]

        if (!myChart) return

        const mapData = targets.map((target) => [
            target.location.longitude,
            target.location.latitude,
            target.name
        ])

        myChart.setOption({
            series: [
                {
                    data: mapData
                }
            ]
        })
    } catch (error) {
        console.error('Failed to fetch probe targets:', error)
    }
}

onMounted(async () => {
    if (!map.value) return

    myChart = echarts.init(map.value, null, { renderer: 'svg' })

    if (!myChart) return

    echarts.registerMap('world', worldMap)

    const option = {
        progressive: 20000,
        backgroundColor: '#f2f2f2',
        geo: {
            center: ['0%', '1%'],
            zoom: 1.1,
            map: 'world',
            roam: false,
            silent: true,
            itemStyle: {
                color: '#fff',
                borderColor: '#fff',
                borderWidth: 1
            }
        },
        series: [
            {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                geoIndex: 0,
                symbolSize: function (params: any) {
                    return 10
                },
                itemStyle: {
                    color: '#b02a02'
                },
                encode: {
                    tooltip: 2
                },
                data: []
            }
        ]
    }

    myChart.setOption(option)
    fetchData()
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
