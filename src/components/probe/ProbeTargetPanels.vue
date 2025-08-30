<script lang="ts" setup>
import type { ProbeTargetDto } from '@/__generated/model/dto'
import { api } from '@/ApiInstance'
import { defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import ProbeTargetPanel from '@/components/probe/ProbeTargetPanel.vue'
import { isOnline } from '@/utils/probeUtils'

// 扩展原始类型，添加online字段
type ProbeTargetWithOnline = ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET'] & {
    online: boolean
}

const probeTargets = ref<ProbeTargetWithOnline[]>([])
let pollTimer: number | null = null
let isPolling = false
const BASE_INTERVAL_MS = 1000
const MAX_INTERVAL_MS = 10000
let nextDelayMs = BASE_INTERVAL_MS

const ProbeMap = defineAsyncComponent(() => import('@/components/probe/ProbeMap.vue'))

onMounted(async () => {
    await refreshProbes()
    startPolling()
})

onUnmounted(() => {
    stopPolling()
})

async function refreshProbes() {
    const targets = await api.probeController.getAllProbeTargets()
    
    const targetsWithOnline: ProbeTargetWithOnline[] = targets.map(target => ({
        ...target,
        online: isOnline(target.lastReportTime)
    }))
    
    // 排序：offline优先，然后各自按sort排序
    const sortedTargets = targetsWithOnline.sort((a, b) => {
        // 首先按online状态排序，offline(false)在前
        if (a.online !== b.online) {
            return a.online ? 1 : -1
        }
        // 相同online状态下，按sort字段排序
        return a.sort - b.sort
    })
    
    probeTargets.value = sortedTargets
}

function startPolling() {
    if (isPolling) {
        return
    }
    isPolling = true
    nextDelayMs = BASE_INTERVAL_MS
    scheduleNextPoll()
}

function stopPolling() {
    isPolling = false
    if (pollTimer) {
        clearTimeout(pollTimer)
        pollTimer = null
    }
}

function scheduleNextPoll() {
    if (!isPolling) {
        return
    }
    if (pollTimer) {
        clearTimeout(pollTimer)
        pollTimer = null
    }

    pollTimer = window.setTimeout(async () => {
        try {
            await refreshProbes()
            nextDelayMs = BASE_INTERVAL_MS
        } catch (error) {
            // 弱网/失败时指数退避，最大不超过 10s
            nextDelayMs = Math.min(nextDelayMs * 2, MAX_INTERVAL_MS)
        } finally {
            scheduleNextPoll()
        }
    }, nextDelayMs)
}
</script>
<template>
    <Transition name="probe-map" mode="out-in">
        <ProbeMap
            v-if="probeTargets.length > 0"
            class="fixed top-0 left-0 z-0 h-full w-full brightness-80"
        />
    </Transition>
    <div
        class="z-50 mt-10 hidden flex-col items-center justify-between pb-5 md:mb-20  md:flex"
    >
        <!-- 外层容器：高度控制 -->
        <div class="fade-mask-y w-full max-h-80 ">
            <!-- 滚动容器 -->
            <div class="probe-scroll-area scrollbar-hide h-full overflow-y-auto px-10 ">
                <TransitionGroup
                    name="probe-panel"
                    tag="div"
                    class="flex w-full flex-col items-center gap-6 py-8"
                >
                    <ProbeTargetPanel
                        v-for="(probeTarget) in probeTargets"
                        :key="probeTarget.id"
                        :probe-target="probeTarget"
                    />
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 容器样式 */
.probe-scroll-area {
    max-height: inherit;
    transition: all 0.3s ease-in-out;
}

/* 隐藏滚动条 */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
}

/* 动画样式 */
.probe-panel-enter-active {
    transition: all 0.6s cubic-bezier(0.01, 0.46, 0.23, 1);
}

.probe-panel-enter-from {
    opacity: 0.1;
    transform: translateY(100px) scale(0.6);
}

.probe-panel-enter-to {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.probe-map-enter-active {
    transition: opacity 0.8s ease-in-out;
}

.probe-map-leave-active {
    transition: opacity 0.3s ease-in-out;
}

.probe-map-enter-from,
.probe-map-leave-to {
    opacity: 0;
}

.probe-map-enter-to,
.probe-map-leave-from {
    opacity: 1;
}

/* 上下透明过渡遮罩 */
.fade-mask-y {
    /* 顶部/底部 32px 渐隐到透明，保留中间内容完全不透明 */
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000 32px, #000 calc(100% - 32px), transparent);
    mask-image: linear-gradient(to bottom, transparent, #000 32px, #000 calc(100% - 32px), transparent);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
}
</style>
