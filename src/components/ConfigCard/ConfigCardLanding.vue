<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import type { UserInfo } from '@/api/userInfo'
import { getUserInfo, patchUserInfo, defaultUserInfo } from '@/api/userInfo'
import Image from 'primevue/image'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import Skeleton from 'primevue/skeleton'
import { useToast } from 'primevue/usetoast'
import LabelAndInput from '@/components/LabelAndInput.vue'
const toast = useToast()
const userInfo = ref<UserInfo>(structuredClone(defaultUserInfo))
const updatting = ref(false)
onMounted(async () => {
    userInfo.value = await getUserInfo()
    userInfo.value.loading = false
})

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

function handleFileRead(type: 'avatar' | 'banner' | 'font', file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
        if (!e.target?.result) return
        if ((type === 'avatar' || type === 'banner') && userInfo.value) {
            userInfo.value[type] = e.target.result as string
        } else if (type === 'font' && userInfo.value) {
            // 直接保存Blob对象
            userInfo.value.name_font = file
            return
        }
    }
    reader.readAsDataURL(file)
}
function onFileChooseHandler(e: FileUploadSelectEvent, type: 'avatar' | 'banner' | 'font') {
    if (!e.files[0]) return
    if ((type === 'avatar' || type === 'banner') && userInfo.value) {
        handleFileRead(type, e.files[0])
    } else if (type === 'font' && userInfo.value) {
        handleFileRead(type, e.files[0])
    }
}
</script>
<template>
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
                @select="(e) => onFileChooseHandler(e, 'font')"
                class="h-10"
            />
        </div>
    </div>
    <LabelAndInput
        id="profile"
        label="个人简介"
        v-model="userInfo.profile"
        :loading="userInfo.loading"
    />

    <LabelAndInput
        id="title"
        label="个人标语"
        v-model="userInfo.slogan"
        :loading="userInfo.loading"
    />
    <div class="grid grid-cols-2 mx-auto justify-center gap-x-10">
        <LabelAndInput
            id="contacts.github"
            label="github"
            v-model="userInfo.contacts.github"
            :loading="userInfo.loading"
        />
        <LabelAndInput
            id="contacts.telegram"
            label="telegram"
            v-model="userInfo.contacts.telegram"
            :loading="userInfo.loading"
        />
        <LabelAndInput
            id="contacts.qq"
            label="QQ"
            v-model="userInfo.contacts.qq"
            :loading="userInfo.loading"
        />
        <LabelAndInput
            id="contacts.email"
            label="email"
            v-model="userInfo.contacts.email"
            :loading="userInfo.loading"
            placeholder="mailto://name@email.com"
        />
        <LabelAndInput
            id="contacts.weibo"
            label="weibo"
            v-model="userInfo.contacts.weibo"
            :loading="userInfo.loading"
        />
        <LabelAndInput
            id="contacts.zhihu"
            label="zhihu"
            v-model="userInfo.contacts.zhihu"
            :loading="userInfo.loading"
        />
        <LabelAndInput
            id="contacts.twitter"
            label="twitter"
            v-model="userInfo.contacts.twitter"
            :loading="userInfo.loading"
        />
        <LabelAndInput
            id="contacts.facebook"
            label="facebook"
            v-model="userInfo.contacts.facebook"
            :loading="userInfo.loading"
        />
        <LabelAndInput
            id="contacts.instagram"
            label="instagram"
            v-model="userInfo.contacts.instagram"
            :loading="userInfo.loading"
        />
        <LabelAndInput
            id="contacts.linkedin"
            label="linkedin"
            v-model="userInfo.contacts.linkedin"
            :loading="userInfo.loading"
        />
    </div>

    <div class="flex justify-end mt-4">
        <Button @click="saveConfigPage1" :loading="updatting" label="保存" />
    </div>
</template>
