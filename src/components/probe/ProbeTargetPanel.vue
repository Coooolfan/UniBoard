<script setup lang="ts">
import type { ProbeTargetDto } from '@/__generated/model/dto'

interface Props {
    probeTarget: ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET']
}

const props = defineProps<Props>()

// 格式化最后报告时间
const formatLastReportTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

// 获取状态颜色
const getStatusColor = (value: number, type: 'cpu' | 'memory' | 'load') => {
    if (type === 'load') {
        return value > 2 ? 'text-red-600' : value > 1 ? 'text-yellow-600' : 'text-green-600'
    }
    return value > 80 ? 'text-red-600' : value > 60 ? 'text-yellow-600' : 'text-green-600'
}

const bueatyMetricData = (value: number | null | undefined, type: 'cpu' | 'memory' | 'load') => {
    if (value === null || value === undefined) {
        return '-'
    }

    if (type === 'cpu' || type === 'memory') {
        return `${value.toFixed(1)}%`
    }

    if (type === 'load') {
        return value.toFixed(1)
    }

    return value.toString()
}
</script>
<template>
    <div
        class="cursor-pointer rounded-lg border border-gray-200 bg-white/90 pt-3 pr-4 pb-3 pl-4 backdrop-blur-sm transition-all duration-300 hover:scale-101 hover:drop-shadow-xl"
    >
        <div class="flex items-center justify-between gap-10 md:gap-20 lg:gap-40">
            <div class="w-40 flex-1">
                <div class="flex items-center space-x-3">
                    <h3 class="font-semibold">{{ probeTarget.name }}</h3>
                    <div
                        class="flex items-center space-x-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600"
                    >
                        <span class="capitalize">online</span>
                    </div>
                </div>
                <p class="mt-1 text-sm text-gray-600">{{ probeTarget.description }}</p>
            </div>
            <div class="flex space-x-8 text-sm">
                <div class="w-14 text-center">
                    <div class="text-gray-500">CPU</div>
                    <div
                        class="font-semibold"
                        :class="getStatusColor(probeTarget.lastReportData?.cpu || 0, 'cpu')"
                    >
                        {{ bueatyMetricData(probeTarget.lastReportData?.cpu, 'cpu') }}
                    </div>
                </div>
                <div class="w-14 text-center">
                    <div class="text-gray-500">内存</div>
                    <div
                        class="font-semibold"
                        :class="getStatusColor(probeTarget.lastReportData?.memory || 0, 'memory')"
                    >
                        {{ bueatyMetricData(probeTarget.lastReportData?.memory, 'memory') }}
                    </div>
                </div>
                <div class="w-14 text-center">
                    <div class="text-gray-500">负载</div>
                    <div
                        class="font-semibold"
                        :class="getStatusColor(probeTarget.lastReportData?.load || 0, 'load')"
                    >
                        {{ bueatyMetricData(probeTarget.lastReportData?.load, 'load') }}
                    </div>
                </div>
                <div class="ml-4 w-34 text-center md:ml-10">
                    <div class="text-gray-500">最后更新</div>
                    <div class="text-xs">
                        {{ formatLastReportTime(probeTarget.lastReportTime) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
