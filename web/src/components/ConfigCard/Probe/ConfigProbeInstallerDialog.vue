<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Stepper from 'primevue/stepper'
import StepItem from 'primevue/stepitem'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Message from 'primevue/message'
import { api } from '@/ApiInstance'
import type { ProbeTargetDto } from '@/__generated/model/dto'
import { useClipboard } from '@/composables/useClipboard'

const props = defineProps<{
    probeTarget: ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET'] | null
    showProbeInstallerDialog: boolean
}>()

const emit = defineEmits<{
    'update:showProbeInstallerDialog': [value: boolean]
}>()

const isInstalling = ref(false)
const probeTargetKey = ref('-')
const systemConfigHost = ref('-')

const { copyToClipboard } = useClipboard()

const preCheckList = ref({
    systemConfigHost: {
        id: 1,
        message: '“系统设置 - 站点域名” 配置有效',
        value: true
    },
    https: {
        id: 2,
        message: 'TLS 可用，您正在使用 HTTPS 访问站点',
        value: true
    }
})
// 当对话框显示时重置状态
watch(
    () => props.showProbeInstallerDialog,
    (visible) => {
        if (visible) {
            resetInstallState()
            preCheck()
        }
    }
)

async function preCheck() {
    try {
        // 检查站点域名配置
        const systemConfig = await api.systemConfigController.getSystemConfig()
        if (!(systemConfig.host && systemConfig.host.trim())) {
            preCheckList.value.systemConfigHost.value = false
            preCheckList.value.systemConfigHost.message = '“系统设置 - 站点域名” 配置为空或无效'
        } else {
            systemConfigHost.value = systemConfig.host
        }

        // 检查 HTTPS 状态
        if (window.location.protocol !== 'https:') {
            preCheckList.value.https.value = false
            if (systemConfig.host.startsWith('https')) {
                preCheckList.value.https.message =
                    '“系统设置 - 站点域名” 配置声明为 HTTPS，但当前访问使用 HTTP 协议'
            } else {
                preCheckList.value.https.message = 'TLS 不可用，您正在使用 HTTP 访问站点'
            }
        }
    } catch (error) {
        console.error('预检失败:', error)
        // 检查失败时设置为 false
        preCheckList.value.systemConfigHost.value = false
        preCheckList.value.systemConfigHost.message = '无法获取系统配置'
        preCheckList.value.https.value = false
        preCheckList.value.https.message = '检查 HTTPS 状态失败'
    }
}

function resetInstallState() {
    probeTargetKey.value = '-'
}

function closeDialog() {
    emit('update:showProbeInstallerDialog', false)
}

const preCheckPassed = computed(() => {
    return preCheckList.value.systemConfigHost.value && preCheckList.value.https.value
})

const preCheckTips = computed(() => {
    if (preCheckList.value.systemConfigHost.value && !preCheckList.value.https.value) {
        return 'HTTPS 启用与否不影响探针上报，您仍然可以手动完成探针目标的配置与安装'
    }
    return ''
})

const bueatyProbeTargetDesc = computed(() => {
    if (props.probeTarget) {
        return `ID: ${props.probeTarget.id} 名称: ${props.probeTarget.name} 描述: ${props.probeTarget.description}`
    }
})

async function genCmd() {
    if (props.probeTarget == undefined) return
    const refreshProbeTargetKeyResp = await api.probeController.refreshProbeTargetKey({
        id: props.probeTarget?.id
    })

    probeTargetKey.value = refreshProbeTargetKeyResp.key
}

const installScript = computed(() => {
    if (props.probeTarget == undefined) return

    var host = structuredClone(systemConfigHost.value)

    if (host.endsWith('/')) host = host.slice(0, -1)

    return `curl -fsSL "${host}/api/probe-script/installer/probe/${props.probeTarget.id}/key/${probeTargetKey.value}/interval/60" | sudo bash`
})

function copyScript() {
    if (installScript.value) {
        copyToClipboard(installScript.value, '安装脚本已复制到剪贴板', '复制安装脚本失败')
    }
}
</script>

<template>
    <Dialog
        :visible="showProbeInstallerDialog"
        @update:visible="emit('update:showProbeInstallerDialog', $event)"
        header="在探针目标上安装探针"
        modal
        class="w-196"
        :closable="!isInstalling"
    >
        <Stepper value="1">
            <StepItem value="1">
                <Step>预检&提示</Step>
                <StepPanel v-slot="{ activateCallback }">
                    <Message severity="info" :closable="false" class="mb-4">
                        <strong><i class="pi pi-info-circle" /> Tips：</strong>
                        <ul class="mt-2 ml-4 list-disc space-y-1">
                            <li>Uniboard 采用被动的“推”方式完成数据采集</li>
                            <li>Uniboard 永远不会向探针目标主动发送任何数据</li>
                            <li>
                                此页面的安装程序仅用于开箱即用的快速配置，您完全可以基于 OpenAPI
                                自行构建数据上报程序，参见
                                <a class="pi pi-github" href="https://uniboard.coooolfan.com/guide/probe.html#_1-前置准备"> 文档站 </a>
                            </li>
                            <li>请确保探针目标可以连接到 Uniboard 实例</li>
                        </ul>
                    </Message>
                    <hr />
                    <Message
                        v-for="item in Object.values(preCheckList)"
                        :key="item.id"
                        :severity="item.value ? 'success' : 'error'"
                        :closable="false"
                        class="mb-4"
                    >
                        <strong>
                            <i :class="item.value ? 'pi pi-check' : 'pi pi-exclamation-triangle'" />
                            {{ item.message }}
                        </strong>
                    </Message>
                    <div>
                        <Button
                            class="mr-4"
                            label="继续"
                            @click="activateCallback('2')"
                            :disabled="!preCheckPassed"
                        />
                        <span class="text-gray-400">{{ preCheckTips }}</span>
                    </div>
                </StepPanel>
            </StepItem>
            <StepItem value="2">
                <Step>生成安装脚本</Step>
                <StepPanel v-slot="{ activateCallback }">
                    <div class="flex flex-col justify-end">
                        <Message severity="success" :closable="false" class="mb-4 max-w-11/12">
                            <span>
                                {{ '即将为 "' + bueatyProbeTargetDesc + '" 生成安装脚本' }}</span
                            >
                        </Message>
                        <Message severity="info" :closable="false" class="mb-4 max-w-11/12">
                            <span
                                >单击生成后，Uniboard 会为此探针目标重新生成用于鉴权的 Key ，旧 Key
                                将立即失效</span
                            >
                        </Message>
                        <Button
                            label="生成"
                            class="w-16"
                            @click="genCmd"
                            :disabled="probeTargetKey.length >= 2"
                        />
                        <div v-if="probeTargetKey.length >= 2" class="mt-4">
                            <div class="relative">
                                <pre
                                    class="mb-4 overflow-x-auto rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-green-400"
                                    >{{ installScript }}</pre
                                >
                                <Button
                                    icon="pi pi-copy"
                                    @click="copyScript"
                                    size="small"
                                    severity="secondary"
                                    outlined
                                    label="复制脚本"
                                    v-tooltip="'复制脚本'"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 py-6">
                        <Button
                            label="上一步"
                            severity="secondary"
                            @click="activateCallback('1')"
                        />
                        <Button label="下一步" @click="activateCallback('3')" />
                    </div>
                </StepPanel>
            </StepItem>
            <StepItem value="3">
                <Step>执行安装操作</Step>
                <StepPanel v-slot="{ activateCallback }">
                    <div class="flex flex-col">
                        <Message severity="success" :closable="false">
                            <strong><i class="pi pi-info-circle" /> Tips：</strong>
                            <ul class="mt-2 ml-4 list-disc space-y-1">
                                <li>手动登录监控目标，在控制台中粘贴您复制的命令</li>
                                <li>安装脚本将自动执行 service 注册等操作，并为您启动上报服务</li>
                                <li>确保探针目标可以连接到 Uniboard 实例</li>
                                <li>静候佳音</li>
                            </ul>
                        </Message>
                    </div>
                    <div class="py-6">
                        <Button
                            label="上一步"
                            severity="secondary"
                            @click="activateCallback('2')"
                        />
                    </div>
                </StepPanel>
            </StepItem>
        </Stepper>

        <template #footer>
            <div class="flex justify-end gap-2">
                <!-- 取消/关闭按钮 -->
                <Button
                    v-if="!isInstalling"
                    label="关闭"
                    icon="pi pi-times"
                    @click="closeDialog"
                    severity="secondary"
                    outlined
                />
            </div>
        </template>
    </Dialog>
</template>
