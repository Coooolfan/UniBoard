<script lang="ts" setup>
import type { ProbeTargetDto } from '@/__generated/model/dto'
import { api } from '@/ApiInstance'
import { defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import ProbeTargetPanel from '@/components/probe/ProbeTargetPanel.vue'

const probeTargets = ref<ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET'][]>([])
let pollTimer: number | null = null

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
    probeTargets.value = [...targets].sort((a, b) => a.sort - b.sort).slice(0, 3)
}

function startPolling() {
    // 每秒更新一次数据
    pollTimer = window.setInterval(async () => {
        await refreshProbes()
    }, 1000)
}

function stopPolling() {
    if (pollTimer) {
        clearInterval(pollTimer)
        pollTimer = null
    }
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
        class="z-50 mt-10 hidden flex-col items-center justify-between gap-6 pb-5 md:mb-20 md:flex"
    >
        <TransitionGroup
            name="probe-panel"
            tag="div"
            class="flex w-full flex-col items-center gap-6"
        >
            <ProbeTargetPanel
                v-for="(probeTarget, index) in probeTargets"
                :key="probeTarget.id"
                :probe-target="probeTarget"
                :style="{ '--delay': `${index * 150}ms` }"
                class="probe-panel-item"
            />
        </TransitionGroup>
    </div>
</template>

<style scoped>
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

.probe-panel-item {
    width: 100%;
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
</style>
