<script setup lang="ts">
import type { ProbeTargetDto } from '@/__generated/model/dto'
import { isOnline } from '@/utils/probeUtils'

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
function getStatusColor(value: number | null | undefined, type: 'cpu' | 'memory' | 'load'): string {
    if (value === null || value === undefined) {
        return 'text-gray-500 dark:text-gray-400'
    }

    if (type === 'load') {
        return value > 2
            ? 'text-red-600 dark:text-red-400'
            : value > 1
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-green-600 dark:text-green-400'
    }

    return value > 80
        ? 'text-red-600 dark:text-red-400'
        : value > 60
          ? 'text-yellow-600 dark:text-yellow-400'
          : 'text-green-600 dark:text-green-400'
}

function bueatyMetricData(
    value: number | null | undefined,
    type: 'cpu' | 'memory' | 'load'
): string {
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
        class="cursor-pointer rounded-lg border border-gray-200 bg-white/90 pt-3 pr-4 pb-3 pl-4 drop-shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-101 hover:drop-shadow-xl dark:border-gray-700 dark:bg-[#18181B]"
    >
        <div class="flex items-center justify-between gap-10 md:gap-20 lg:gap-40">
            <div class="w-50 flex-1">
                <div class="flex items-center space-x-3">
                    <h3 class="font-semibold text-black dark:text-white">{{ probeTarget.name }}</h3>
                    <div
                        v-if="isOnline(probeTarget.lastReportTime)"
                        class="flex items-center space-x-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    >
                        <i class="pi pi-check-circle" />
                        <span>online</span>
                    </div>
                    <div
                        v-else
                        class="flex items-center space-x-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    >
                        <i class="pi pi-wave-pulse" />
                        <span>offline</span>
                    </div>
                </div>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {{ probeTarget.description }}
                </p>
            </div>
            <div class="flex space-x-8 text-sm">
                <div class="w-14 text-center">
                    <div class="text-gray-500 dark:text-gray-400">CPU</div>
                    <div
                        class="font-semibold"
                        :class="getStatusColor(probeTarget.lastReportData?.cpu, 'cpu')"
                    >
                        {{ bueatyMetricData(probeTarget.lastReportData?.cpu, 'cpu') }}
                    </div>
                </div>
                <div class="w-14 text-center">
                    <div class="text-gray-500 dark:text-gray-400">内存</div>
                    <div
                        class="font-semibold"
                        :class="getStatusColor(probeTarget.lastReportData?.memory, 'memory')"
                    >
                        {{ bueatyMetricData(probeTarget.lastReportData?.memory, 'memory') }}
                    </div>
                </div>
                <div class="w-14 text-center">
                    <div class="text-gray-500 dark:text-gray-400">负载</div>
                    <div
                        class="font-semibold"
                        :class="getStatusColor(probeTarget.lastReportData?.load, 'load')"
                    >
                        {{ bueatyMetricData(probeTarget.lastReportData?.load, 'load') }}
                    </div>
                </div>
                <div class="ml-4 w-34 text-center md:ml-10">
                    <div class="text-gray-500 dark:text-gray-400">最后更新</div>
                    <div class="text-xs dark:text-gray-300">
                        {{ formatLastReportTime(probeTarget.lastReportTime) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
