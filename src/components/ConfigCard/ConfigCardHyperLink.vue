<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import Skeleton from 'primevue/skeleton'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

import HyperLinkCard from '@/components/HyperLinkCard.vue'
import LabelAndInput from '@/components/LabelAndInput.vue'
import ColorPicker from 'primevue/colorpicker'
import { api } from '@/ApiInstance'
import type { HyperLinkDto } from '@/__generated/model/dto'

const toast = useToast()
const hyperLinkList = ref<ReadonlyArray<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>>([])
const dialogVisible = ref(false)
const editIndex = ref<number | null>(null)
const isNewLink = ref(false)

// 用于传递给HyperLinkCard组件的数据
const previewHyperLink = ref<Partial<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>>({
    title: '',
    description: '',
    url: '',
    color: '#f2f2f2'
})


onMounted(async () => {
    await refreshHyperLinks()
})

// 刷新超链接列表
async function refreshHyperLinks() {
    hyperLinkList.value = [...(await api.hyperLinkController.getAllHyperLinks())]
}

// 删除指定索引的超链接
async function removeHyperLink(index: number) {
    if (!hyperLinkList.value[index].id) return

    try {
        await api.hyperLinkController.deleteHyperLinkById({
            id: hyperLinkList.value[index].id
        })

        toast.add({
            severity: 'success',
            summary: '删除成功',
            detail: '超链接信息删除成功',
            life: 3000
        })

        await refreshHyperLinks()
    } catch (err) {
        toast.add({
            severity: 'error',
            summary: '删除失败',
            detail: '超链接信息删除失败',
            life: 3000
        })
    }
}

// 保存或更新超链接信息
async function saveAndUpdateHyperLink(hyperLink) {
    try {
        if (hyperLink.id) {
            // 更新现有超链接
            // await api.hyperLinkController.updateHyperLinkById({
            //     id: hyperLink.id,
            //     body: {
            //         title: hyperLink.title,
            //         description: hyperLink.description,
            //         url: hyperLink.url
            //         // 省略icon字段，避免类型问题
            //     }
            // })
        } else {
            // 新增超链接，需要提供文件
            if (!hyperLink.icon) {
                throw new Error('请选择一个图标')
            }

            // 根据API类型定义构造参数
            // await api.hyperLinkController.insertHyperlink({
            //     body: {
            //         insert: {
            //             title: hyperLink.title,
            //             description: hyperLink.description,
            //             url: hyperLink.url
            //             // 省略icon字段，避免类型问题
            //         },
            //         file: hyperLink.icon
            //     }
            // })
        }
        hyperLink.saved = true
        return true
    } catch (error) {
        console.error('Failed to save hyperlink:', error)
        hyperLink.saved = false
        return false
    }
}

// 处理文件读取，创建预览
function handleFileRead(file: File) {
    // 直接存储File对象用于上传
    currentHyperLink.value.icon = file

    // 创建预览图像
    const reader = new FileReader()
    reader.onload = (e) => {
        if (!e.target?.result) return
        // 存储预览用的数据URL
        currentHyperLink.value.iconPreview = e.target.result as string
        // 更新预览数据
        updatePreviewData()
    }
    reader.readAsDataURL(file)
}

// 处理文件选择事件
function onFileChooseHandler(e: FileUploadSelectEvent) {
    if (!e.files[0]) return
    handleFileRead(e.files[0])
}

// 打开新增超链接对话框
function openNewHyperLinkDialog() {
    isNewLink.value = true
    editIndex.value = null
    currentHyperLink.value = { ...defaultHyperLinkCache }
    updatePreviewData()
    dialogVisible.value = true
}

// 打开编辑超链接对话框
function openEditDialog(index: number) {
    isNewLink.value = false
    editIndex.value = index
    const item = hyperLinkList.value[index]

    // 从API返回的数据创建UI兼容对象
    currentHyperLink.value = {
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        url: item.url || '',
        color: item.color || '#ffffff',
        iconPreview: item.icon?.filepath, // 使用现有图标的URL作为预览
        uploading: false,
        saved: false
    }

    // 更新预览数据
    updatePreviewData()
    dialogVisible.value = true
}
</script>
<template>
    <div class="flex flex-col">
        <div class="mb-4 flex justify-end">
            <Button label="新增超链接" icon="pi pi-plus" @click="openNewHyperLinkDialog" />
        </div>

        <div class="m-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="(item, index) of hyperLinkList" :key="index" class="flex flex-col">
                <HyperLinkCard :hyperLink="item"></HyperLinkCard>
                <div class="m-2 flex justify-end space-x-2">
                    <Button
                        icon="pi pi-pencil"
                        class="p-button-rounded p-button-text"
                        @click="openEditDialog(index)"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-text p-button-danger"
                        @click="removeHyperLink(index)"
                    />
                </div>
            </div>
        </div>
    </div>

    <Dialog
        v-model:visible="dialogVisible"
        modal
        :header="isNewLink ? '新增超链接' : '编辑超链接'"
        :style="{ width: '50rem' }"
        :closable="!currentHyperLink.uploading"
        :closeOnEscape="!currentHyperLink.uploading"
    >
        <div class="flex flex-col lg:flex-row">
            <div class="pr-4 lg:w-1/2">
                <LabelAndInput
                    id="title"
                    label="标题"
                    v-model="currentHyperLink.title"
                    :loading="currentHyperLink.uploading"
                    :disabled="currentHyperLink.uploading"
                    @update:modelValue="updatePreviewData"
                />
                <LabelAndInput
                    id="description"
                    label="描述"
                    v-model="currentHyperLink.description"
                    :loading="currentHyperLink.uploading"
                    :disabled="currentHyperLink.uploading"
                    @update:modelValue="updatePreviewData"
                />
                <LabelAndInput
                    id="url"
                    label="目标链接"
                    v-model="currentHyperLink.url"
                    :loading="currentHyperLink.uploading"
                    :disabled="currentHyperLink.uploading"
                    @update:modelValue="updatePreviewData"
                />
                <div class="mt-4 flex place-content-between items-center space-x-4">
                    <div class="flex grow items-center gap-2">
                        <label for="name" class="w-20 shrink-0 text-right">主题色</label>
                        <ColorPicker
                            id="color"
                            v-model="currentHyperLink.color"
                            v-tooltip.right="'建议使用淡色系'"
                            type="text"
                            :disabled="currentHyperLink.uploading"
                            @update:modelValue="updatePreviewData"
                        />
                    </div>
                    <div class="flex grow items-center gap-2">
                        <label class="w-20 shrink-0 text-right">图标</label>
                        <FileUpload
                            mode="basic"
                            accept="image/*"
                            chooseLabel="选择图标"
                            :auto="true"
                            class="h-10"
                            :disabled="currentHyperLink.uploading"
                            @select="onFileChooseHandler"
                        />
                    </div>
                </div>
            </div>
            <div class="mt-4 lg:mt-0 lg:w-1/2">
                <HyperLinkCard class="translate-4 scale-75" :hyperLink="previewHyperLink" />
            </div>
        </div>
        <template #footer>
            <Button
                label="取消"
                icon="pi pi-times"
                @click="dialogVisible = false"
                class="p-button-text"
                :disabled="currentHyperLink.uploading"
            />
            <Button
                label="保存"
                icon="pi pi-check"
                @click="saveHyperLinkConfig"
                :loading="currentHyperLink.uploading"
            />
        </template>
    </Dialog>
</template>
