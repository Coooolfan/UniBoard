<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import type { SystemInfo } from '@/api/sysInfo'
import { getSystemInfo, updateSystemInfo } from '@/api/sysInfo'
import InputText from 'primevue/inputtext'
import Image from 'primevue/image'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import Skeleton from 'primevue/skeleton'
import { useToast } from 'primevue/usetoast'
import Fieldset from 'primevue/fieldset'
import {
    defaultHyperLinkCache,
    deleteHyperLink,
    fetchNewHyperLink,
    getHyperLinkCache,
    gethyperLinkCacheList,
    saveAndUpdateHyperLink,
    type HyperLinkCache
} from '@/api/hyperLink'
import HyperLinkCard from './HyperLinkCard.vue'
import ColorPicker from 'primevue/colorpicker'
import { axiosInstance } from '@/api/auth'
const toast = useToast()
const dialogRef: any = inject('dialogRef')
const systemInfo = ref<SystemInfo>()
const hyperLinkCacheList = ref<Array<HyperLinkCache>>([])
const updatting = ref(false)
onMounted(async () => {
    systemInfo.value = await getSystemInfo()
    hyperLinkCacheList.value = await gethyperLinkCacheList()
})

const closeDialog = () => {
    dialogRef.value.close()
}

async function saveConfigPage1() {
    if (!systemInfo.value) {
        return
    }
    updatting.value = true
    let res = await updateSystemInfo(systemInfo.value)
    if (res) {
        toast.add({
            severity: 'success',
            summary: '保存成功',
            detail: '系统信息更新成功',
            life: 3000
        })
    } else {
        toast.add({
            severity: 'error',
            summary: '保存失败',
            detail: '系统信息更新失败',
            life: 3000
        })
    }
    updatting.value = false
}

async function removeHyperLink(index: number) {
    // 如果是新建的超链接，直接删除
    if (!hyperLinkCacheList.value[index].saved) {
        hyperLinkCacheList.value.splice(index, 1)
        return
    }
    let res = await deleteHyperLink(hyperLinkCacheList.value[index].id)
    if (res) {
        toast.add({
            severity: 'success',
            summary: '删除成功',
            detail: '超链接信息删除成功',
            life: 3000
        })
    } else {
        toast.add({
            severity: 'error',
            summary: '删除失败',
            detail: '超链接信息删除失败',
            life: 3000
        })
    }
    hyperLinkCacheList.value = await gethyperLinkCacheList()
}

async function saveHyperLinkConfig(index: number) {
    if (!hyperLinkCacheList.value[index]) {
        return
    }
    hyperLinkCacheList.value[index].uploading = true
    let res = await saveAndUpdateHyperLink(hyperLinkCacheList.value[index])
    if (res) {
        toast.add({
            severity: 'success',
            summary: '保存成功',
            detail: '超链接信息更新成功',
            life: 3000
        })
    } else {
        toast.add({
            severity: 'error',
            summary: '保存失败',
            detail: '超链接信息更新失败',
            life: 3000
        })
    }
    hyperLinkCacheList.value[index].uploading = false
    if (!hyperLinkCacheList.value[index].saved) {
        hyperLinkCacheList.value = await gethyperLinkCacheList()
    }
}

function handleFileRead(type: 'avatar' | 'banner' | 'icon', file: File, index?: number) {
    const reader = new FileReader()
    reader.onload = (e) => {
        if (!e.target?.result) return
        if ((type === 'avatar' || type === 'banner') && systemInfo.value) {
            systemInfo.value[type] = e.target.result as string
        } else if (type === 'icon' && index !== undefined) {
            hyperLinkCacheList.value[index].icon = e.target.result as string
        }
    }
    reader.readAsDataURL(file)
}
function onFileChooseHandler(
    e: FileUploadSelectEvent,
    type: 'avatar' | 'banner' | 'icon',
    index?: number
) {
    if (!e.files[0]) return
    if ((type === 'avatar' || type === 'banner') && systemInfo.value) {
        handleFileRead(type, e.files[0])
    } else if (type === 'icon' && index !== undefined) {
        handleFileRead(type, e.files[0], index)
    }
}
function appendNewHyperLinkCache() {
    hyperLinkCacheList.value.push(structuredClone(defaultHyperLinkCache))
}
function ttt() {
    axiosInstance.get('hyperlink-caches/39/').then((res) => {
        console.log(res)
    })
}
let attempt = 0
let maxAttempts = 8
async function refreshFromServer(index: number) {
    if (!hyperLinkCacheList.value[index].url) return
    toast.add({
        severity: 'info',
        summary: '正在获取',
        detail: '正在从服务器获取超链接信息……',
        life: 8000
    })
    hyperLinkCacheList.value[index].uploading = true
    let fetch_resp = await fetchNewHyperLink(hyperLinkCacheList.value[index].url)
    if (!fetch_resp.id) {
        toast.add({
            severity: 'error',
            summary: '请求失败',
            detail: '无法从服务器获取超链接信息',
            life: 3000
        })
        return
    } else {
        hyperLinkCacheList.value[index].cacheId = fetch_resp.id
    }
    // 间隔1s循环检查是否获取到数据

    let timer = setInterval(async () => {
        attempt++
        if (attempt < maxAttempts) {
            let resp = await getHyperLinkCache(hyperLinkCacheList.value[index].cacheId as number)
            console.log(resp)
            if (resp.finished) {
                toast.add({
                    severity: 'success',
                    summary: '获取成功',
                    detail: '超链接信息获取成功',
                    life: 3000
                })
                clearInterval(timer)
                hyperLinkCacheList.value[index].uploading = false
                hyperLinkCacheList.value[index].title = resp.title
                hyperLinkCacheList.value[index].desc = resp.desc
                hyperLinkCacheList.value[index].icon = resp.icon
                hyperLinkCacheList.value[index].color = resp.color
            }
        } else {
            clearInterval(timer)
            console.log('超过最大重试次数')
            hyperLinkCacheList.value[index].uploading = false
            toast.add({
                severity: 'error',
                summary: '获取失败',
                detail: '超链接信息获取失败',
                life: 3000
            })
            // 可以在这里添加处理超过最大重试次数的逻辑
            attempt = 0
            maxAttempts = 8
        }
    }, 1000)
}
</script>
<template>
    <Button @click="ttt" />
    <Fieldset legend="着陆页首屏设置">
        <div class="flex items-center space-x-2 min-w-[80vw]">
            <label for="name" class="flex-shrink-0 w-24 text-right">展示姓名</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="name"
                    v-model="systemInfo.name"
                    class="w-full h-10"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="profile" class="flex-shrink-0 w-24 text-right">个人简介</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="profile"
                    v-model="systemInfo.profile"
                    class="w-full h-10"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="avatar" class="flex-shrink-0 w-24 text-right">头像</label>
            <div class="flex-grow">
                <Image
                    v-if="systemInfo"
                    id="avatar"
                    :src="systemInfo.avatar"
                    height="96px"
                    width="96px"
                />
                <Skeleton v-else height="96px"></Skeleton>
                <div class="float-start mt-2">
                    <FileUpload
                        mode="basic"
                        accept="image/*"
                        chooseLabel="选择新头像"
                        :maxFileSize="1000000"
                        @select="(e) => onFileChooseHandler(e, 'avatar')"
                    />
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="slogan" class="flex-shrink-0 w-24 text-right">个人标语</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="slogan"
                    v-model="systemInfo.slogan"
                    class="w-full h-10"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="banner" class="flex-shrink-0 w-24 text-right">横幅</label>
            <div class="flex-grow">
                <Image v-if="systemInfo" id="banner" :src="systemInfo.banner" width="200px" />
                <Skeleton v-else height="120px"></Skeleton>
                <div class="float-start mt-2">
                    <FileUpload
                        mode="basic"
                        accept="image/*"
                        chooseLabel="选择新横幅"
                        :maxFileSize="1000000"
                        @select="(e) => onFileChooseHandler(e, 'banner')"
                    />
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="banner" class="flex-shrink-0 w-24 text-right">媒体链接</label>
            <div class="flex items-center space-x-2 w-full">
                <label for="banner" class="flex-shrink-0 w-20 text-right">github</label>
                <div class="flex-grow">
                    <InputText
                        v-if="systemInfo"
                        id="contacts.github"
                        v-model="systemInfo.contacts.github"
                        class="h-10 w-full"
                    />
                    <Skeleton v-else height="2.5rem"></Skeleton>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
            <div class="flex items-center space-x-2 w-full">
                <label for="banner" class="flex-shrink-0 w-20 text-right">telegram</label>
                <div class="flex-grow">
                    <InputText
                        v-if="systemInfo"
                        id="contacts.telegram"
                        v-model="systemInfo.contacts.telegram"
                        class="h-10 w-full"
                    />
                    <Skeleton v-else height="2.5rem"></Skeleton>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
            <div class="flex items-center space-x-2 w-full">
                <label for="banner" class="flex-shrink-0 w-20 text-right">QQ</label>
                <div class="flex-grow">
                    <InputText
                        v-if="systemInfo"
                        id="contacts.qq"
                        v-model="systemInfo.contacts.qq"
                        class="h-10 w-full"
                    />
                    <Skeleton v-else height="2.5rem"></Skeleton>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
            <div class="flex items-center space-x-2 w-full">
                <label for="banner" class="flex-shrink-0 w-20 text-right">email</label>
                <div class="flex-grow">
                    <InputText
                        v-if="systemInfo"
                        id="contacts.email"
                        v-model="systemInfo.contacts.email"
                        class="h-10 w-full"
                        placeholder="mailto://name@email.com"
                    />
                    <Skeleton v-else height="2.5rem"></Skeleton>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
            <div class="flex items-center space-x-2 w-full">
                <label for="banner" class="flex-shrink-0 w-20 text-right">weibo</label>
                <div class="flex-grow">
                    <InputText
                        v-if="systemInfo"
                        id="contacts.weibo"
                        v-model="systemInfo.contacts.weibo"
                        class="h-10 w-full"
                    />
                    <Skeleton v-else height="2.5rem"></Skeleton>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
            <div class="flex items-center space-x-2 w-full">
                <label for="banner" class="flex-shrink-0 w-20 text-right">zhihu</label>
                <div class="flex-grow">
                    <InputText
                        v-if="systemInfo"
                        id="contacts.zhihu"
                        v-model="systemInfo.contacts.zhihu"
                        class="h-10 w-full"
                    />
                    <Skeleton v-else height="2.5rem"></Skeleton>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
            <div class="flex items-center space-x-2 w-full">
                <label for="banner" class="flex-shrink-0 w-20 text-right">twitter</label>
                <div class="flex-grow">
                    <InputText
                        v-if="systemInfo"
                        id="contacts.twitter"
                        v-model="systemInfo.contacts.twitter"
                        class="h-10 w-full"
                    />
                    <Skeleton v-else height="2.5rem"></Skeleton>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
            <div class="flex items-center space-x-2 w-full">
                <label for="banner" class="flex-shrink-0 w-20 text-right">facebook</label>
                <div class="flex-grow">
                    <InputText
                        v-if="systemInfo"
                        id="contacts.facebook"
                        v-model="systemInfo.contacts.facebook"
                        class="h-10 w-full"
                    />
                    <Skeleton v-else height="2.5rem"></Skeleton>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
            <div class="flex items-center space-x-2 w-full">
                <label for="banner" class="flex-shrink-0 w-20 text-right">instagram</label>
                <div class="flex-grow">
                    <InputText
                        v-if="systemInfo"
                        id="contacts.instagram"
                        v-model="systemInfo.contacts.instagram"
                        class="h-10 w-full"
                    />
                    <Skeleton v-else height="2.5rem"></Skeleton>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-2 mt-4">
            <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
            <div class="flex items-center space-x-2 w-full">
                <label for="banner" class="flex-shrink-0 w-20 text-right">linkedin</label>
                <div class="flex-grow">
                    <InputText
                        v-if="systemInfo"
                        id="contacts.linkedin"
                        v-model="systemInfo.contacts.linkedin"
                        class="h-10 w-full"
                    />
                    <Skeleton v-else height="2.5rem"></Skeleton>
                </div>
            </div>
        </div>
        <div class="mt-8 float-right">
            <Button @click="saveConfigPage1" class="ml-8" :loading="updatting" label="保存" /></div
    ></Fieldset>
    <Fieldset legend="着陆页第二屏设置">
        <div>
            <div
                v-for="(item, index) of hyperLinkCacheList"
                :key="index"
                class="m-4 flex justify-around content-around pb-4 items-center border-b-[1px]"
            >
                <div>
                    <div class="flex items-center space-x-2">
                        <label for="name" class="flex-shrink-0 w-24 text-right">标题</label>
                        <div class="flex-grow">
                            <InputText
                                v-if="hyperLinkCacheList"
                                id="name"
                                v-model="item.title"
                                class="h-10"
                                :disabled="item.uploading"
                            />
                            <Skeleton v-else height="2.5rem" />
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 mt-1">
                        <label for="name" class="flex-shrink-0 w-24 text-right">描述</label>
                        <div class="flex-grow">
                            <InputText
                                v-if="hyperLinkCacheList"
                                id="name"
                                v-model="item.desc"
                                class="h-10"
                                :disabled="item.uploading"
                            />
                            <Skeleton v-else height="2.5rem" />
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 mt-1">
                        <label for="name" class="flex-shrink-0 w-24 text-right">目标链接</label>
                        <div class="flex-grow">
                            <InputText
                                v-if="hyperLinkCacheList"
                                id="name"
                                v-model="item.url"
                                class="h-10"
                                :disabled="item.uploading"
                            />
                            <Skeleton v-else height="2.5rem" />
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 mt-1">
                        <label for="name" class="flex-shrink-0 w-24 text-right">主题色</label>
                        <div class="flex-grow flex items-center">
                            <ColorPicker
                                v-if="hyperLinkCacheList"
                                id="color"
                                v-model="item.color"
                                v-tooltip.right="'建议使用淡色系'"
                                type="text"
                                :disabled="item.uploading"
                            />
                            <Skeleton v-else height="2.5rem" />
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 mt-4 justify-end">
                        <FileUpload
                            mode="basic"
                            accept="image/*"
                            chooseLabel="选择新ICON"
                            :maxFileSize="1000000"
                            :auto="true"
                            class="h-10"
                            :disabled="item.uploading"
                            @select="(e) => onFileChooseHandler(e, 'icon', index)"
                        />
                        <Button
                            icon="pi pi-refresh"
                            aria-label="Save"
                            v-tooltip.bottom="'从URL自动获取'"
                            @click="refreshFromServer(index)"
                        />
                        <Button
                            v-if="hyperLinkCacheList"
                            severity="danger"
                            class="ml-4 float-end h-10 transition-all"
                            label="删除"
                            @click="removeHyperLink(index)"
                            :loading="item.uploading"
                        />
                        <Button
                            v-if="hyperLinkCacheList"
                            class="ml-4 float-end h-10 transition-all"
                            label="保存"
                            :disabled="item.uploading"
                            @click="saveHyperLinkConfig(index)"
                            :loading="item.uploading"
                        />
                    </div>
                </div>
                <HyperLinkCard :linkData="item" class="scale-90 w-full"></HyperLinkCard>
            </div>
            <Button label="新增超链接" class="float-end" @click="appendNewHyperLinkCache" />
        </div>
    </Fieldset>
    <div class="m-4 float-end"><Button @click="closeDialog" label="关闭" /></div>
</template>
