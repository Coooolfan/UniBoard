<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { api } from '@/ApiInstance'
import ConfirmPopup from 'primevue/confirmpopup'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message';
import type { ProbeTargetDto } from '@/__generated/model/dto'
import type { ProbeTargetInsert, ProbeTargetUpdate } from '@/__generated/model/static'
import ProbeTargetPanel from '@/components/probe/ProbeTargetPanel.vue'

const toast = useToast()
const confirm = useConfirm()

const probeTargetList = ref<ProbeTargetDto['ProbeController/DEFAULT_PROBE_TARGET'][]>([])
const dialogVisible = ref(false)
const keyDialogVisible = ref(false)
const dialogType = ref<'new' | 'edit'>('new')
const currentProbeTarget = ref<{
    id?: number
    name: string
    description: string
    location: {
        latitude: number
        longitude: number
    }
}>({
    name: '',
    description: '',
    location: {
        latitude: 0,
        longitude: 0
    }
})
const currentKey = ref('')
const refreshKeyDialogVisible = ref(false)
const currentRefreshTargetId = ref<number | null>(null)

onMounted(() => {
    refreshProbeTargets()
})

async function refreshProbeTargets() {
    try {
        const targets = await api.probeController.getAllProbeTagets()
        probeTargetList.value = [...targets]
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: '获取探针目标列表失败',
            life: 3000
        })
    }
}

function openNewProbeTargetDialog() {
    dialogType.value = 'new'
    currentProbeTarget.value = {
        name: '',
        description: '',
        location: {
            latitude: 0,
            longitude: 0
        }
    }
    dialogVisible.value = true
}

function openEditProbeTargetDialog(index: number) {
    const target = probeTargetList.value[index]
    dialogType.value = 'edit'
    currentProbeTarget.value = {
        id: target.id,
        name: target.name,
        description: target.description,
        location: {
            latitude: target.location.latitude,
            longitude: target.location.longitude
        }
    }
    dialogVisible.value = true
}

async function saveProbeTarget() {
    try {
        if (dialogType.value === 'new') {
            const insertData: ProbeTargetInsert = {
                name: currentProbeTarget.value.name,
                description: currentProbeTarget.value.description,
                location: currentProbeTarget.value.location
            }
            await api.probeController.insertProbeTarget({ body: insertData })
            toast.add({
                severity: 'success',
                summary: '成功',
                detail: '探针目标添加成功',
                life: 3000
            })
        } else {
            const updateData: ProbeTargetUpdate = {
                name: currentProbeTarget.value.name,
                description: currentProbeTarget.value.description,
                location: currentProbeTarget.value.location
            }
            await api.probeController.updateProbeTarget({
                id: currentProbeTarget.value.id!,
                body: updateData
            })
            toast.add({
                severity: 'success',
                summary: '成功',
                detail: '探针目标更新成功',
                life: 3000
            })
        }
        dialogVisible.value = false
        refreshProbeTargets()
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: dialogType.value === 'new' ? '添加探针目标失败' : '更新探针目标失败',
            life: 3000
        })
    }
}

async function removeProbeTarget(event: Event, id: number) {
    const target = probeTargetList.value.find((t) => t.id === id)
    if (!target) return

    confirm.require({
        target: event.currentTarget as HTMLElement,
        message: `确定要删除探针目标 "${target.name}" 吗？`,
        header: '确认删除',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: '取消',
        acceptLabel: '删除',
        accept: async () => {
            try {
                await api.probeController.deleteProbeTargetById({ id })
                toast.add({
                    severity: 'success',
                    summary: '成功',
                    detail: '探针目标删除成功',
                    life: 3000
                })
                refreshProbeTargets()
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: '错误',
                    detail: '删除探针目标失败',
                    life: 3000
                })
            }
        }
    })
}

function showRefreshKeyDialog(id: number) {
    currentRefreshTargetId.value = id
    refreshKeyDialogVisible.value = true
}

async function confirmRefreshKey() {
    if (!currentRefreshTargetId.value) return

    try {
        const result = await api.probeController.refreshProbeTargetKey({
            id: currentRefreshTargetId.value
        })
        currentKey.value = result.key
        refreshKeyDialogVisible.value = false
        keyDialogVisible.value = true
        toast.add({
            severity: 'success',
            summary: '成功',
            detail: 'Key 刷新成功',
            life: 3000
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: '刷新 Key 失败',
            life: 3000
        })
    }
}

function copyKey() {
    navigator.clipboard.writeText(currentKey.value).then(() => {
        toast.add({
            severity: 'success',
            summary: '成功',
            detail: 'Key 已复制到剪贴板',
            life: 3000
        })
    })
}
</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="flex flex-col">
        <div class="mb-4 flex justify-end">
            <Button label="新增探针目标" icon="pi pi-plus" @click="openNewProbeTargetDialog" />
        </div>

        <div class="grid-container m-8 grid grid-cols-1 gap-8">
            <div
                v-for="(item, index) of probeTargetList"
                :key="item.id"
                class="flex flex-col items-center"
            >
                <div class="flex w-full flex-col">
                    <ProbeTargetPanel :probe-target="item" />
                    <div class="mt-2 flex justify-end space-x-2">
                        <Button
                            icon="pi pi-key"
                            class="p-button-rounded p-button-text"
                            severity="info"
                            title="刷新Key"
                            @click="showRefreshKeyDialog(item.id)"
                        />
                        <Button
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-text"
                            title="编辑"
                            @click="openEditProbeTargetDialog(index)"
                        />
                        <Button
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-text p-button-danger"
                            title="删除"
                            @click="removeProbeTarget($event, item.id)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 添加/编辑对话框 -->
    <Dialog
        v-model:visible="dialogVisible"
        modal
        :header="dialogType === 'new' ? '新增探针目标' : '编辑探针目标'"
        :style="{ width: '40rem' }"
    >
        <div class="flex flex-col space-y-4">
            <div class="field">
                <label for="name" class="mb-2 block text-sm font-medium">名称</label>
                <InputText
                    id="name"
                    v-model="currentProbeTarget.name"
                    placeholder="探针名称"
                    class="w-full"
                />
            </div>

            <div class="field">
                <label for="description" class="mb-2 block text-sm font-medium">描述</label>
                <InputText
                    id="description"
                    v-model="currentProbeTarget.description"
                    placeholder="探针描述"
                    class="w-full"
                />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="field">
                    <label for="latitude" class="mb-2 block text-sm font-medium">纬度</label>
                    <InputNumber
                        id="latitude"
                        v-model="currentProbeTarget.location.latitude"
                        placeholder="纬度"
                        :min="-90"
                        :max="90"
                        :minFractionDigits="6"
                        :maxFractionDigits="6"
                        class="w-full"
                    />
                </div>
                <div class="field">
                    <label for="longitude" class="mb-2 block text-sm font-medium">经度</label>
                    <InputNumber
                        id="longitude"
                        v-model="currentProbeTarget.location.longitude"
                        placeholder="经度"
                        :min="-180"
                        :max="180"
                        :minFractionDigits="6"
                        :maxFractionDigits="6"
                        class="w-full"
                    />
                </div>
            </div>
        </div>

        <template #footer>
            <Button
                label="取消"
                icon="pi pi-times"
                @click="dialogVisible = false"
                severity="secondary"
                outlined
            />
            <Button
                :label="dialogType === 'new' ? '添加' : '更新'"
                icon="pi pi-check"
                @click="saveProbeTarget"
            />
        </template>
    </Dialog>

    <!-- Key 显示对话框 -->
    <Dialog
        v-model:visible="keyDialogVisible"
        header="探针目标 Key"
        modal
        :style="{ width: '600px' }"
    >
        <div class="space-y-4">
            <p class="text-gray-600">请保存此 Key，探针程序需要使用此 Key 进行身份验证：</p>
            <div class="flex space-x-2">
                <InputText v-model="currentKey" disabled class="flex-1" />
                <Button icon="pi pi-copy" @click="copyKey" v-tooltip="'复制'" outlined />
            </div>
            <Message severity="warn" :closable="false">
                请妥善保管此 Key，泄露后可能导致安全风险。
            </Message>
        </div>

        <template #footer>
            <Button label="关闭" icon="pi pi-times" @click="keyDialogVisible = false" />
        </template>
    </Dialog>

    <!-- 刷新Key确认对话框 -->
    <Dialog
        v-model:visible="refreshKeyDialogVisible"
        header="刷新探针目标 Key"
        modal
        :style="{ width: '500px' }"
    >
        <div class="space-y-4 pt-2">
            <Message severity="warn" :closable="false">
                <strong><i class="pi pi-exclamation-triangle" /> 重要提醒：</strong>
                <ul class="mt-2 ml-4 list-disc space-y-1">
                    <li>创建新 Key 后，旧 Key 将<strong>立即失效</strong></li>
                    <li>新 Key 仅在创建时展示一次，请务必保存</li>
                </ul>
            </Message>
            <p class="text-gray-700">确定要刷新此探针目标的 Key 吗？</p>
        </div>

        <template #footer>
            <Button
                label="取消"
                icon="pi pi-times"
                @click="refreshKeyDialogVisible = false"
                severity="secondary"
                outlined
            />
            <Button
                label="确认刷新"
                icon="pi pi-key"
                @click="confirmRefreshKey"
                severity="warning"
            />
        </template>
    </Dialog>
</template>
