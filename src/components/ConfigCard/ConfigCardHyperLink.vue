<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import Button from 'primevue/button'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import HyperLinkCard from '@/components/HyperLinkCard.vue'
import LabelAndInput from '@/components/LabelAndInput.vue'
import ColorPicker from 'primevue/colorpicker'
import { api } from '@/ApiInstance'
import type { HyperLinkDto } from '@/__generated/model/dto'
import ConfirmPopup from 'primevue/confirmpopup'
import { unwrapApiError } from '@/utils/errorHandling'
import type { ApiErrors } from '@/__generated/ApiErrors'
import Checkbox from 'primevue/checkbox'
import { VueDraggable } from 'vue-draggable-plus'
const toast = useToast()
const confirm = useConfirm()
const hyperLinkList = ref<Array<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>>([])
const dialogVisible = ref(false)
const uploading = ref(false)
const dialogType = ref<'new' | 'edit'>('new')
const currentHyperLink = ref<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>({
    id: 0,
    title: '',
    description: '',
    url: '',
    color: '#f2f2f2',
    icon: {
        filename: '',
        filepath: ''
    },
    public: true
})
// string 表示从服务器获取的图片路径，File 表示从本地上传的图片
const selectedHyperLinkIcon = ref<string | File | null>(null)
onMounted(async () => {
    await refreshHyperLinks()
})

async function refreshHyperLinks() {
    hyperLinkList.value = [...(await api.hyperLinkController.getAllHyperLinks())]
}

function openNewHyperLinkDialog() {
    dialogType.value = 'new'
    dialogVisible.value = true
    currentHyperLink.value = {
        id: 0,
        title: '',
        description: '',
        url: '',
        color: '#f2f2f2',
        icon: {
            filename: '',
            filepath: ''
        },
        public: true
    }
    selectedHyperLinkIcon.value = null
}

function openEditHyperLinkDialog(index: number) {
    dialogType.value = 'edit'
    dialogVisible.value = true
    currentHyperLink.value = hyperLinkList.value[index]
    selectedHyperLinkIcon.value = currentHyperLink.value.icon.filepath
}

const selectedHyperLinkIconUrl = computed(() => {
    if (!dialogVisible.value || !selectedHyperLinkIcon.value) return ''
    return typeof selectedHyperLinkIcon.value === 'string'
        ? selectedHyperLinkIcon.value
        : URL.createObjectURL(selectedHyperLinkIcon.value)
})

const previewHyperLink = computed(() => {
    return {
        ...currentHyperLink.value,
        icon: {
            ...currentHyperLink.value.icon,
            filepath: selectedHyperLinkIconUrl.value
        }
    }
})

async function removeHyperLink(event: MouseEvent, id: number) {
    if (!event.currentTarget) return
    confirm.require({
        target: event.currentTarget as HTMLElement,
        message: '删除此超链接吗？\n操作不可逆！',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: '取消',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: '删除',
            severity: 'danger'
        },
        accept: async () => {
            await api.hyperLinkController.deleteHyperLinkById({ id })
            await refreshHyperLinks()
        }
    })
}

function onFileChooseHandler(e: FileUploadSelectEvent) {
    if (!e.files[0]) return

    const file = e.files[0]
    const reader = new FileReader()
    reader.onload = () => {
        selectedHyperLinkIcon.value = file
    }
    reader.readAsDataURL(file)
}
async function saveHyperLink() {
    uploading.value = true
    if (dialogType.value === 'edit') {
        await api.hyperLinkController.updateHyperLinkById({
            id: currentHyperLink.value.id,
            body: {
                update: currentHyperLink.value,
                ...(typeof selectedHyperLinkIcon.value === 'object' && {
                    file: selectedHyperLinkIcon.value!
                })
            }
        })
        toast.add({
            severity: 'success',
            summary: '编辑成功',
            detail: '超链接已更新',
            life: 3000
        })
    } else {
        if (!(typeof selectedHyperLinkIcon.value === 'object' && selectedHyperLinkIcon.value)) {
            toast.add({
                severity: 'error',
                summary: '创建失败',
                detail: '请选择一个图标',
                life: 3000
            })
            uploading.value = false
            return
        }
        await api.hyperLinkController.insertHyperlink({
            body: {
                insert: currentHyperLink.value,
                file: selectedHyperLinkIcon.value
            }
        })
        toast.add({
            severity: 'success',
            summary: '创建成功',
            detail: '超链接已添加',
            life: 3000
        })
    }
    uploading.value = false
    dialogVisible.value = false
    refreshHyperLinks()
}

async function saveHyperLinkBySnapShot() {
    uploading.value = true
    try {
        await api.hyperLinkController.insertHyperLinkBySnapshot({
            body: {
                url: currentHyperLink.value.url,
                public: currentHyperLink.value.public
            }
        })
        toast.add({
            severity: 'success',
            summary: '创建成功',
            detail: '超链接已添加',
            life: 3000
        })
        dialogVisible.value = false
        refreshHyperLinks()
    } catch (error: any) {
        const err =
            await unwrapApiError<ApiErrors['hyperLinkController']['insertHyperLinkBySnapshot']>(
                error
            )
        if (err.code === 'FETCH_SNAPSHOT_FAILED') {
            toast.add({
                severity: 'error',
                summary: '创建失败',
                detail: '无法获取网页信息，请检查 URL 是否有效',
                life: 3000
            })
        } else {
            toast.add({
                severity: 'error',
                summary: '创建失败',
                detail: '未知错误',
                life: 3000
            })
        }
    }
    uploading.value = false
}
</script>
<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="flex flex-col">
        <div class="mb-4 flex justify-end">
            <Button label="新增超链接" icon="pi pi-plus" @click="openNewHyperLinkDialog" />
        </div>
        <VueDraggable
            ref="el"
            v-model="hyperLinkList"
            :animation="150"
            ghostClass="ghost"
            handle=".drag-handle"
            target=".grid-container"
        >
            <div class="grid-container m-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div
                    v-for="(item, index) of hyperLinkList"
                    :key="item.id"
                    class="flex flex-col items-center"
                >
                    <div class="flex flex-col items-end">
                        <HyperLinkCard :hyperLink="item" :allow-redirect="false"></HyperLinkCard>
                        <div class="mt-2 flex justify-end space-x-2">
                            <Button
                                icon="pi pi-list"
                                class="drag-handle p-button-rounded p-button-text"
                                severity="secondary"
                                title="拖动以排序，即刻生效"
                            />
                            <Button
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-text"
                                @click="openEditHyperLinkDialog(index)"
                            />
                            <Button
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-text p-button-danger"
                                @click="removeHyperLink($event, item.id)"
                            />
                        </div>
                    </div>
                </div></div
        ></VueDraggable>
    </div>

    <Dialog
        v-model:visible="dialogVisible"
        modal
        :header="dialogType === 'new' ? '新增超链接' : '编辑超链接'"
        :style="{ width: '50rem' }"
        :closable="!uploading"
        :closeOnEscape="!uploading"
    >
        <Tabs value="0">
            <TabList>
                <Tab value="0">手动添加</Tab>
                <Tab value="1">从URL自动导入</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <div class="flex flex-col lg:flex-row">
                        <div class="pr-4 lg:w-1/2">
                            <LabelAndInput
                                id="title"
                                label="标题"
                                v-model="currentHyperLink.title"
                                :loading="uploading"
                                :disabled="uploading"
                            />
                            <LabelAndInput
                                id="description"
                                label="描述"
                                v-model="currentHyperLink.description"
                                :loading="uploading"
                                :disabled="uploading"
                            />
                            <LabelAndInput
                                id="url"
                                label="目标链接"
                                v-model="currentHyperLink.url"
                                :loading="uploading"
                                :disabled="uploading"
                            />
                            <div class="mt-4 flex place-content-between items-center space-x-4">
                                <div class="flex grow items-center gap-2">
                                    <label for="name" class="w-20 shrink-0 text-right"
                                        >主题色</label
                                    >
                                    <ColorPicker
                                        id="color"
                                        v-model="currentHyperLink.color"
                                        v-tooltip.right="'建议使用淡色系'"
                                        type="text"
                                        :disabled="uploading"
                                    />
                                </div>
                                <div class="flex grow items-center gap-2">
                                    <label
                                        title="公开的超链接所有人可见，否则仅在登陆状态下可见"
                                        for="name"
                                        class="shrink-0 text-right"
                                        >公开</label
                                    >
                                    <Checkbox
                                        v-model="currentHyperLink.public"
                                        binary
                                        :disabled="uploading"
                                    />
                                </div>
                                <div class="flex grow items-center gap-2">
                                    <label class="shrink-0 text-right">图标</label>
                                    <FileUpload
                                        mode="basic"
                                        accept="image/*"
                                        chooseLabel="选择"
                                        :auto="true"
                                        class="h-10"
                                        :disabled="uploading"
                                        @select="onFileChooseHandler"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 lg:mt-0 lg:w-1/2">
                            <HyperLinkCard
                                class="translate-4 scale-75"
                                :hyperLink="previewHyperLink"
                                :allow-redirect="false"
                            />
                        </div>
                    </div>
                    <div class="mt-4 flex justify-end gap-2">
                        <Button
                            label="取消"
                            @click="dialogVisible = false"
                            severity="secondary"
                            :disabled="uploading"
                        />
                        <Button
                            :label="dialogType === 'new' ? '创建' : '保存'"
                            @click="saveHyperLink"
                            :loading="uploading"
                        /></div
                ></TabPanel>
                <TabPanel value="1">
                    <div class="flex flex-col gap-2">
                        <LabelAndInput
                            id="url-snapshot"
                            label="目标链接"
                            v-model="currentHyperLink.url"
                            :loading="uploading"
                            :disabled="uploading"
                        />

                        <div class="flex grow items-center gap-2">
                            <label
                                title="公开的超链接所有人可见，否则仅在登陆状态下可见"
                                for="name"
                                class="w-20 shrink-0 text-right"
                                >公开</label
                            >
                            <Checkbox
                                v-model="currentHyperLink.public"
                                binary
                                :disabled="uploading"
                            />
                        </div>
                        <span class="m-4 text-sm text-gray-500">
                            UniBoard 可以尝试从 URL 自动提取标题、描述、图标等信息。
                        </span>
                    </div>
                    <div class="mt-4 flex justify-end gap-2">
                        <Button
                            label="取消"
                            @click="dialogVisible = false"
                            severity="secondary"
                            :disabled="uploading"
                        />
                        <Button
                            :label="dialogType === 'new' ? '创建' : '保存'"
                            @click="saveHyperLinkBySnapShot"
                            :loading="uploading"
                        />
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Dialog>
</template>

<style scoped>
.ghost {
    opacity: 0.5;
}
</style>
