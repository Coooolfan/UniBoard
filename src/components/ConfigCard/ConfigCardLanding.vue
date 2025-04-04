<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import Button from 'primevue/button'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import Skeleton from 'primevue/skeleton'
import { useToast } from 'primevue/usetoast'
import LabelAndInput from '@/components/LabelAndInput.vue'
import { api } from '@/ApiInstance'
import type { ProfileDto } from '@/__generated/model/dto'
declare const URL: {
    createObjectURL(file: File): string
}
const toast = useToast()
const userInfo = ref<ProfileDto['ProfileController/PUBLIC_PROFILE']>({
    id: 0,
    name: '',
    description: '',
    slogan: '',
    contacts: {
        github: '',
        telegram: '',
        qq: '',
        email: '',
        weibo: '',
        zhihu: '',
        twitter: '',
        facebook: '',
        instagram: '',
        linkedin: ''
    },
    customFont: {
        filepath: '',
        filename: ''
    },
    avatar: {
        filepath: '',
        filename: ''
    },
    banner: {
        filepath: '',
        filename: ''
    }
})
const selectedAvatarFile = ref<File | null>(null)
const selectedBannerFile = ref<File | null>(null)
const selectedFontFile = ref<File | null>(null)
const loading = ref(false)
const updatting = ref(false)

const avatarUrl = computed(() => {
    if (!userInfo.value) return ''
    return selectedAvatarFile.value
        ? URL.createObjectURL(selectedAvatarFile.value)
        : userInfo.value.avatar.filepath
})

const bannerUrl = computed(() => {
    if (!userInfo.value) return ''
    return selectedBannerFile.value
        ? URL.createObjectURL(selectedBannerFile.value)
        : userInfo.value.banner.filepath
})

onMounted(async () => {
    await refreshProfile()
})

async function refreshProfile() {
    loading.value = true
    userInfo.value = await api.profileController.getProfile()
    loading.value = false
}

async function updateProfileHandle() {
    updatting.value = true
    try {
        await api.profileController.updateProfile({
            body: {
                update: userInfo.value,
                ...(selectedAvatarFile.value && { avatar: selectedAvatarFile.value }),
                ...(selectedBannerFile.value && { banner: selectedBannerFile.value }),
                ...(selectedFontFile.value && { font: selectedFontFile.value })
            }
        })
        toast.add({
            severity: 'success',
            summary: '保存成功',
            detail: '系统信息更新成功',
            life: 3000
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: '保存失败',
            detail: '系统信息更新失败',
            life: 3000
        })
    } finally {
        updatting.value = false
    }
    refreshProfile()
}

function onFileChooseHandler(e: FileUploadSelectEvent, type: 'avatar' | 'banner' | 'font') {
    if (!e.files[0] || !userInfo.value) return

    const file = e.files[0]
    const reader = new FileReader()
    reader.onload = () => {
        switch (type) {
            case 'avatar':
                selectedAvatarFile.value = file
                break
            case 'banner':
                selectedBannerFile.value = file
                break
            case 'font':
                selectedFontFile.value = file
                break
        }
    }
    reader.readAsDataURL(file)
}
</script>
<template>
    <div class="mt-4 flex items-center space-x-2">
        <label for="avatar" class="w-20 shrink-0 text-right">头像</label>
        <div class="grow">
            <img
                v-if="userInfo"
                :src="avatarUrl"
                class="h-32 w-32 rounded-full object-cover shadow-md"
                alt="avater"
            />
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
    <div class="mt-4 flex items-center space-x-2">
        <label for="banner" class="w-20 shrink-0 text-right">横幅</label>
        <div class="grow">
            <img v-if="userInfo" id="banner" :src="bannerUrl" class="w-72" />
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
    <div class="flex flex-col items-start lg:flex-row">
        <LabelAndInput id="name" label="展示姓名" v-model="userInfo.name" :loading="loading" />
        <div class="mt-4 ml-4 w-full">
            <FileUpload
                mode="basic"
                chooseLabel="选择新字体"
                @select="(e) => onFileChooseHandler(e, 'font')"
                class="h-10"
            />
        </div>
    </div>
    <LabelAndInput
        id="profile"
        label="个人简介"
        v-model="userInfo.description"
        :loading="loading"
    />

    <LabelAndInput id="title" label="个人标语" v-model="userInfo.slogan" :loading="loading" />
    <div class="mx-auto grid grid-cols-1 justify-center lg:grid-cols-2 lg:gap-x-10">
        <LabelAndInput
            id="contacts.github"
            label="github"
            v-model="userInfo.contacts.github"
            :loading="loading"
        />
        <LabelAndInput
            id="contacts.telegram"
            label="telegram"
            v-model="userInfo.contacts.telegram"
            :loading="loading"
        />
        <LabelAndInput
            id="contacts.qq"
            label="QQ"
            v-model="userInfo.contacts.qq"
            :loading="loading"
        />
        <LabelAndInput
            id="contacts.email"
            label="email"
            v-model="userInfo.contacts.email"
            :loading="loading"
            placeholder="mailto://name@email.com"
        />
        <LabelAndInput
            id="contacts.weibo"
            label="weibo"
            v-model="userInfo.contacts.weibo"
            :loading="loading"
        />
        <LabelAndInput
            id="contacts.zhihu"
            label="zhihu"
            v-model="userInfo.contacts.zhihu"
            :loading="loading"
        />
        <LabelAndInput
            id="contacts.twitter"
            label="twitter"
            v-model="userInfo.contacts.twitter"
            :loading="loading"
        />
        <LabelAndInput
            id="contacts.facebook"
            label="facebook"
            v-model="userInfo.contacts.facebook"
            :loading="loading"
        />
        <LabelAndInput
            id="contacts.instagram"
            label="instagram"
            v-model="userInfo.contacts.instagram"
            :loading="loading"
        />
        <LabelAndInput
            id="contacts.linkedin"
            label="linkedin"
            v-model="userInfo.contacts.linkedin"
            :loading="loading"
        />
    </div>

    <div class="mt-4 flex justify-end">
        <Button @click="updateProfileHandle" :loading="updatting" label="保存" />
    </div>
</template>
