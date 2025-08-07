<script lang="ts" setup>
import type { ProbeTargetDto } from '@/__generated/model/dto'
import { api } from '@/ApiInstance'
import { onMounted, onUnmounted, ref } from 'vue'
import ProbeTargetPanel from '@/components/probe/ProbeTargetPanel.vue'

const probeTargets = ref<ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET'][]>([])
let pollTimer: number | null = null

onMounted(async () => {
    await refreshProbes()
    startPolling()
})

onUnmounted(() => {
    stopPolling()
})

async function refreshProbes() {
    const targets = await api.probeController.getAllProbeTargets()
    probeTargets.value = [...targets].sort((a, b) => a.sort - b.sort)
}

function startPolling() {
    // 每30秒更新一次数据
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
    <div
        class="z-50 mt-10 hidden flex-col items-center justify-between gap-6 pb-5 md:mb-20 md:flex"
    >
        <ProbeTargetPanel
            v-for="probeTarget in probeTargets"
            :key="probeTarget.id"
            :probe-target="probeTarget"
        />
    </div>
</template>
