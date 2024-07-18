<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import type { UserInfo } from '@/api/userInfo'
import { getUserInfo, patchUserInfo, defaultUserInfo } from '@/api/userInfo'
import { removeToken } from '@/api/auth'
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
import LabelAndInput from './LabelAndInput.vue'
import ColorPicker from 'primevue/colorpicker'
import { useRouter } from 'vue-router'
const toast = useToast()
const router = useRouter()
const dialogRef: any = inject('dialogRef')
const userInfo = ref<UserInfo>(structuredClone(defaultUserInfo))
const hyperLinkCacheList = ref<Array<HyperLinkCache>>([])
const updatting = ref(false)
onMounted(async () => {
    userInfo.value = await getUserInfo()
    userInfo.value.loading = false
    hyperLinkCacheList.value = await gethyperLinkCacheList()
    hyperLinkCacheList.value.forEach((item) => {
        item.uploading = false
    })
})

function logout() {
    removeToken()
    router.push('/')
}

const closeDialog = () => {
    dialogRef.value.close()
}

async function saveConfigPage1() {
    if (!userInfo.value) {
        return
    }
    updatting.value = true
    let res = await patchUserInfo(userInfo.value)
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

function handleFileRead(type: 'avatar' | 'banner' | 'icon' | 'font', file: File, index?: number) {
    const reader = new FileReader()
    reader.onload = (e) => {
        if (!e.target?.result) return
        if ((type === 'avatar' || type === 'banner') && userInfo.value) {
            userInfo.value[type] = e.target.result as string
        } else if (type === 'icon' && index !== undefined) {
            hyperLinkCacheList.value[index].icon = e.target.result as string
        } else if (type === 'font' && userInfo.value) {
            // 直接保存Blob对象
            userInfo.value.name_font = file
            return
        }
    }
    reader.readAsDataURL(file)
}
function onFileChooseHandler(
    e: FileUploadSelectEvent,
    type: 'avatar' | 'banner' | 'icon' | 'font',
    index?: number
) {
    if (!e.files[0]) return
    if ((type === 'avatar' || type === 'banner') && userInfo.value) {
        handleFileRead(type, e.files[0])
    } else if (type === 'icon' && index !== undefined) {
        handleFileRead(type, e.files[0], index)
    } else if (type === 'font' && userInfo.value) {
        handleFileRead(type, e.files[0])
    }
}
function appendNewHyperLinkCache() {
    hyperLinkCacheList.value.push(structuredClone(defaultHyperLinkCache))
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
    <Fieldset legend="着陆页首屏设置" class="w-[80vw]">
        <div class="flex items-center space-x-2 mt-4">
            <label for="avatar" class="flex-shrink-0 w-20 text-right">头像</label>
            <div class="flex-grow">
                <Image v-if="userInfo" id="avatar" :src="userInfo.avatar" width="96px" />
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
            <label for="banner" class="flex-shrink-0 w-20 text-right">横幅</label>
            <div class="flex-grow">
                <Image v-if="userInfo" id="banner" :src="userInfo.banner" width="200px" />
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
        <div class="flex items-center">
            <LabelAndInput
                id="name"
                label="展示姓名"
                v-model="userInfo.name"
                :loading="userInfo.loading"
            />
            <div class="w-2/4 ml-4 mt-4 flex">
                <FileUpload
                    mode="basic"
                    chooseLabel="选择字体"
                    :maxFileSize="1000000"
                    @select="(e) => onFileChooseHandler(e, 'font')"
                    class="h-10"
                />
            </div>
        </div>
        <LabelAndInput
            id="profile"
            label="个人简介"
            v-model="userInfo.profile"
            :loading="userInfo.loading" />

        <LabelAndInput
            id="title"
            label="个人标语"
            v-model="userInfo.slogan"
            :loading="userInfo.loading" />

        <LabelAndInput
            id="contacts.github"
            label="github"
            v-model="userInfo.contacts.github"
            :loading="userInfo.loading" />
        <LabelAndInput
            id="contacts.telegram"
            label="telegram"
            v-model="userInfo.contacts.telegram"
            :loading="userInfo.loading" />
        <LabelAndInput
            id="contacts.qq"
            label="QQ"
            v-model="userInfo.contacts.qq"
            :loading="userInfo.loading" />
        <LabelAndInput
            id="contacts.email"
            label="email"
            v-model="userInfo.contacts.email"
            :loading="userInfo.loading"
            placeholder="mailto://name@email.com" />
        <LabelAndInput
            id="contacts.weibo"
            label="weibo"
            v-model="userInfo.contacts.weibo"
            :loading="userInfo.loading" />
        <LabelAndInput
            id="contacts.zhihu"
            label="zhihu"
            v-model="userInfo.contacts.zhihu"
            :loading="userInfo.loading" />
        <LabelAndInput
            id="contacts.twitter"
            label="twitter"
            v-model="userInfo.contacts.twitter"
            :loading="userInfo.loading" />
        <LabelAndInput
            id="contacts.facebook"
            label="facebook"
            v-model="userInfo.contacts.facebook"
            :loading="userInfo.loading" />
        <LabelAndInput
            id="contacts.instagram"
            label="instagram"
            v-model="userInfo.contacts.instagram"
            :loading="userInfo.loading" />
        <LabelAndInput
            id="contacts.linkedin"
            label="linkedin"
            v-model="userInfo.contacts.linkedin"
            :loading="userInfo.loading" />
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
                    <LabelAndInput
                        id="title"
                        label="标题"
                        v-model="item.title"
                        :loading="item.uploading.valueOf()"
                        :disabled="item.uploading"
                    />
                    <LabelAndInput
                        id="desc"
                        label="描述"
                        v-model="item.desc"
                        :loading="item.uploading.valueOf()"
                        :disabled="item.uploading"
                    />
                    <LabelAndInput
                        id="url"
                        label="目标链接"
                        v-model="item.url"
                        :loading="item.uploading.valueOf()"
                        :disabled="item.uploading"
                    />
                    <div class="flex items-center space-x-2 mt-4">
                        <label for="name" class="flex-shrink-0 w-20 text-right">主题色</label>
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
    <div class="flex mt-4 justify-end gap-4">
        <Button @click="logout" label="退出登录" severity="danger" /><Button
            @click="closeDialog"
            label="关闭"
        />
    </div>
</template>
