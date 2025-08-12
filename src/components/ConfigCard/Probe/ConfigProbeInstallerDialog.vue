<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Stepper from 'primevue/stepper'
import StepItem from 'primevue/stepitem'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Message from 'primevue/message'
import { api } from '@/ApiInstance'

const props = defineProps<{
    probeId: number
    showProbeInstallerDialog: boolean
}>()

const emit = defineEmits<{
    'update:showProbeInstallerDialog': [value: boolean]
}>()

const isInstalling = ref(false)
const installProgress = ref(0)
const installStatus = ref<
    'preparing' | 'downloading' | 'installing' | 'configuring' | 'completed' | 'error'
>('preparing')
const errorMessage = ref('')

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
    isInstalling.value = false
    installProgress.value = 0
    installStatus.value = 'preparing'
    errorMessage.value = ''
}

function closeDialog() {
    emit('update:showProbeInstallerDialog', false)
}
</script>

<template>
    <Dialog
        :visible="showProbeInstallerDialog"
        @update:visible="emit('update:showProbeInstallerDialog', $event)"
        header="在探针目标上安装探针"
        modal
        class="w-full max-w-3xl"
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
                                <a class="pi pi-github" href="https://github.com"> GitHub </a>
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
                        <Button label="继续" @click="activateCallback('2')" />
                    </div>
                </StepPanel>
            </StepItem>
            <StepItem value="2">
                <Step>选择安装方式</Step>
                <StepPanel v-slot="{ activateCallback }">
                    <div class="flex h-48 flex-col">
                        <div
                            class="border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-950 flex flex-auto items-center justify-center rounded border-2 border-dashed font-medium"
                        >
                            Content II
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
                                <li>观察到探针目标数据正常上报后</li>
                                <li>新 Key 仅在创建时展示一次，请务必保存</li>
                            </ul>
                        </Message>
                    </div>
                    <div class="py-6">
                        <Button
                            label="上一部"
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
