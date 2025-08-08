<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'
import { TitleComponent, GeoComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterGLChart } from 'echarts-gl/charts'
import worldMap from '@/assets/world.json'
echarts.use([TitleComponent, GeoComponent, ScatterGLChart, CanvasRenderer])
echarts.registerMap('world', worldMap as any)
const map = ref<HTMLElement | null>(null)
let myChart: echarts.ECharts | null = null

// const ROOT_PATH = 'https://echarts.apache.org/examples'
const ROOT_PATH = ''
const CHUNK_COUNT = 230
let dataCount = 0

function fetchData(idx: number) {
    if (idx >= CHUNK_COUNT) {
        return
    }
    const dataURL = ROOT_PATH + '/data/asset/data/gps/gps_' + idx + '.bin'
    const xhr = new XMLHttpRequest()
    xhr.open('GET', dataURL, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function (e) {
        const rawData = new Int32Array(this.response)
        const data = new Float32Array(rawData.length)
        const addedDataCount = rawData.length / 2
        for (let i = 0; i < rawData.length; i += 2) {
            data[i] = rawData[i + 1] / 1e7
            data[i + 1] = rawData[i] / 1e7
        }
        if (myChart) {
            myChart.appendData({
                seriesIndex: 0,
                data: data
            })
        }
        fetchData(idx + 1)
    }
    xhr.send()
}

function fetchMockProbeTargets() {
    const mockData = [
        { lng: 116.4074, lat: 39.9042 }, // Beijing
        { lng: 121.4737, lat: 31.2304 }, // Shanghai
        { lng: 114.0579, lat: 22.5431 }, // Shenzhen
        { lng: 113.2644, lat: 23.1291 } // Guangzhou
    ]
    const data = new Float32Array(mockData.length * 2)
    mockData.forEach((item, index) => {
        data[index * 2] = item.lng
        data[index * 2 + 1] = item.lat
    })
    if (myChart) {
        myChart.appendData({
            seriesIndex: 0,
            data: data
        })
        // myChart.setOption({ geo: { zoom: 1.2 } })
    }
}

onMounted(() => {
    if (!map.value) return

    myChart = echarts.init(map.value)

    if (!myChart) return

    const option = {
        backgroundColor: '#f2f2f2',
        geo: {
            map: 'world',
            roam: true,
            label: {
                emphasis: {
                    show: false
                }
            },
            silent: true,
            itemStyle: {
                normal: {
                    areaColor: '#fff',
                    borderColor: '#ccc'
                }
            }
        },
        series: [
            {
                name: '弱',
                type: 'scatterGL',
                progressive: 1e6,
                coordinateSystem: 'geo',
                symbol: 'circle',
                symbolSize: 1,
                zoomScale: 10,
                blendMode: 'lighter',
                large: true,
                itemStyle: {
                    color: 'rgb(20, 15, 2)'
                },
                postEffect: {
                    enable: true
                },
                silent: true,
                dimensions: ['lng', 'lat'],
                data: new Float32Array()
            }
        ]
    }

    myChart.setOption(option)
    // fetchData(0)
    fetchMockProbeTargets()
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
