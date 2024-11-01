<script lang="ts" setup>
import { defaultSysConfig, getSysConfig, patchSysConfig, type sysConfig } from '@/api/sysConfig'
import Button from 'primevue/button'
import LabelAndInput from '@/components/LabelAndInput.vue'
import LabelAndCheckbox from '@/components/LabelAndCheckbox.vue'
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
const toast = useToast()
const sysConfig = ref<sysConfig>(structuredClone(defaultSysConfig))
onMounted(async () => {
    sysConfig.value = await getSysConfig()
})

async function updateConfig() {
    sysConfig.value.loading = true
    const resp = await patchSysConfig(sysConfig.value)
    if (resp) {
        toast.add({
            severity: 'success',
            summary: '更新成功',
            detail: '相关内容刷新页面可见',
            life: 3000
        })
    } else {
        toast.add({
            severity: 'error',
            summary: '更新失败',
            detail: '请检查网络连接或稍后再试',
            life: 3000
        })
    }
    sysConfig.value.loading = false
}
</script>
<template>
    <LabelAndInput
        id="host"
        label="站点域名"
        placeholder="当前版本无须设置此项，留空即可"
        v-model="sysConfig.host"
        :loading="sysConfig.loading"
    />
    <LabelAndCheckbox
        title="是否展示着陆页最下方的版权信息"
        id="showCopyright"
        label="仓库地址"
        v-model="sysConfig.show_copyright"
        :loading="sysConfig.loading"
    />
    <div class="flex justify-end mt-4">
        <Button @click="updateConfig" :loading="sysConfig.loading" label="保存" />
    </div>
</template>
