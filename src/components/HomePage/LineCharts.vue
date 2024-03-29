<template>
    <v-chart class="chart" :option="option" :autoresize="true" :loading="data_loading" />
</template>
<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    ToolboxComponent,
} from "echarts/components";
import { network_manager } from '../../api/network.js'
import VChart, { THEME_KEY } from "vue-echarts";
use([
    CanvasRenderer,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    LineChart,
    DataZoomComponent,
    ToolboxComponent,
]);
export default {
    name: "LineCharts",
    components: {
        VChart,
    },
    provide: {
        [THEME_KEY]: "",
    },
    data() {
        return {
            data: [{ data: [] }],
            data_loading: true,
        };
    },
    computed: {
        option() {
            return {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        animation: false,
                    },
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            show: true,
                            yAxisIndex: "none",

                        },
                    },
                },
                dataZoom: [
                    {
                        id: 'dataZoomX',
                        type: 'slider',
                        xAxisIndex: [0],
                        filterMode: 'filter',
                        height: 10,
                        moveHandleSize: 5,
                        handleSize: '200%',
                        bottom: "4%",
                    }
                ],
                xAxis: {
                    type: "time",
                    min: this.stamp2time(this.startTimestamp),
                    max: this.stamp2time(this.endTimestamp),
                },
                yAxis: {
                    type: "value",
                    max: 100,
                    min: 0,
                },
                series: [
                    {
                        type: "line",
                        name: this.items[0],
                        data: this.data[0].data,
                        smooth: true,
                        symbolSize: 1,
                    },
                ],
                grid: {
                    x: "8%",
                    y: "12%",
                    x2: "2%",
                    y2: "18%"
                },
            };
        },
    },
    mounted() {
        this.refreshStatus()
    },
    props: {
        ObjectIDs: {
            type: Array,
            default: [1],
        },
        startTimestamp: {
            type: Number,
            default: 0,
        },
        endTimestamp: {
            type: Number,
            default: () => Math.floor(Date.now() / 1000),
        },
        items: {
            type: Array,
            default: ['cpu'],
        },
    },
    methods: {
        stamp2time(stamp) {
            var date = new Date(stamp * 1000)
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = date.getDate() + ' '
            var h = date.getHours() + ':'
            var m = date.getMinutes() + ':'
            var s = date.getSeconds()
            return Y + M + D + h + m + s
        },
        async refreshStatus() {
            var density = 1
            var last = false
            var formatted = true
            this.data = await network_manager.getStatus(this.ObjectIDs, this.items,
                this.startTimestamp, this.endTimestamp, density, last, formatted)
            this.data_loading = false
        }
    }

};
</script>
<style scoped>
.chart {
    margin: auto;
}
</style>