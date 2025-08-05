<script lang="ts" setup>
import type { ProbeTargetDto } from '@/__generated/model/dto'
import { api } from '@/ApiInstance'
import { onMounted, ref } from 'vue'
import ProbeTargetPanel from '@/components/probe/ProbeTargetPanel.vue'

const probeTargets = ref<ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET'][]>([])

onMounted(async () => {
    refreshProbes()
})

async function refreshProbes() {
    const targets = await api.probeController.getAllProbeTagets()
    probeTargets.value = [...targets]
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
