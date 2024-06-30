<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import type { SystemInfo } from '@/api/sysInfo'
import { getSystemInfo, updateSystemInfo } from '@/api/sysInfo'
import InputText from 'primevue/inputtext'
import Image from 'primevue/image'
import FileUpload from 'primevue/fileupload'
import Skeleton from 'primevue/skeleton'
import { useToast } from 'primevue/usetoast'
import Fieldset from 'primevue/fieldset'
import { gethyperLinkCacheList, patchHyperLink, type HyperLinkCache } from '@/api/hyperLink'
import HyperLinkCard from './HyperLinkCard.vue'
import ColorPicker from 'primevue/colorpicker'
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

const choseAvatar = ref()
const choseBanner = ref()



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

async function saveHyperLinkConfig(index: number) {
    if(!hyperLinkCacheList.value[index]) {
        return
    }
    hyperLinkCacheList.value[index].uploading = true
    let res = await patchHyperLink(hyperLinkCacheList.value[index])
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
}

function handleFileRead(type: 'avatar' | 'banner', file: File, systemInfo: { value: any }) {
    const reader = new FileReader()
    reader.onload = (e) => {
        if (e.target?.result && systemInfo.value) {
            systemInfo.value[type] = e.target.result as string
        }
    }
    reader.readAsDataURL(file)
}

function onFileChooseHandler(type: 'avatar' | 'banner') {
    console.log('onFileChooseHandler', type)
    const choseAvatarElement = choseAvatar.value
    const choseBannerElement = choseBanner.value

    if (type === 'avatar' && choseAvatarElement?.files.length) {
        handleFileRead(type, choseAvatarElement.files[0], systemInfo)
        console.log('Chosen avatar:', choseAvatarElement.files[0])
    } else if (type === 'banner' && choseBannerElement?.files.length) {
        handleFileRead(type, choseBannerElement.files[0], systemInfo)
        console.log('Chosen banner:', choseBannerElement.files[0])
    } else {
        console.error('No file chosen or invalid type:', type)
    }
}
</script>
<template>
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
                        ref="choseAvatar"
                        mode="basic"
                        accept="image/*"
                        chooseLabel="选择新头像"
                        :maxFileSize="1000000"
                        @select="onFileChooseHandler('avatar')"
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
                        ref="choseBanner"
                        mode="basic"
                        accept="image/*"
                        chooseLabel="选择新横幅"
                        :maxFileSize="1000000"
                        @select="onFileChooseHandler('banner')"
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
        <div
            v-for="(item, index) of hyperLinkCacheList"
            :key="index"
            class="m-4 flex w-full justify-around content-around pb-4"
            :class="{ 'border-b-[1px]': index !== hyperLinkCacheList.length - 1 }"
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
                        />
                        <Skeleton v-else height="2.5rem" />
                    </div>
                </div>
                <div class="flex items-center space-x-2 mt-1">
                    <label for="name" class="flex-shrink-0 w-24 text-right">主题色</label>
                    <div class="flex-grow flex justify-between items-center	">
                        <ColorPicker
                            v-if="hyperLinkCacheList"
                            id="color"
                            v-model="item.color"
                            v-tooltip.bottom="'建议使用淡色系'"
                            type="text"
                        />
                        <Skeleton v-else height="2.5rem" />
                        <Button
                            v-if="hyperLinkCacheList"
                            class="ml-4"
                            label="保存"
                            @click="saveHyperLinkConfig(index)"
                            :loading="item.uploading"
                        />
                    </div>
                </div>
            </div>
            <HyperLinkCard :linkData="item" class="scale-90 w-full"></HyperLinkCard>
        </div>
    </Fieldset>
    <div class="m-4 float-end"><Button @click="closeDialog" label="关闭" /></div>
</template>
