<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import LabelAndInput from '@/components/LabelAndInput.vue'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import Step from 'primevue/step'
import StepPanels from 'primevue/steppanels'
import StepPanel from 'primevue/steppanel'
import { api } from '@/ApiInstance'
import router from '@/router'
import type { ProfileDto } from '@/__generated/model/dto'
import type { ApiErrors } from '@/__generated'

declare const URL: {
    createObjectURL(file: File): string
}

const toast = useToast()
const loading = ref(false)
const submitting = ref(false)
const activeStep = ref('1')
const contactsPanelCollapsed = ref(true)

// System profile information
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

// 选择的文件
const selectedAvatarFile = ref<File | null>(null)
const selectedBannerFile = ref<File | null>(null)
const selectedFontFile = ref<File | null>(null)

// 登录信息设置
const loginUsername = ref('')
const loginPassword = ref('')
const confirmPassword = ref('')

const avatarUrl = computed(() => {
    return selectedAvatarFile.value
        ? URL.createObjectURL(selectedAvatarFile.value)
        : '/src/assets/default-avatar.svg'
})

const bannerUrl = computed(() => {
    return selectedBannerFile.value
        ? URL.createObjectURL(selectedBannerFile.value)
        : '/src/assets/default-banner.svg'
})

function onFileChooseHandler(e: FileUploadSelectEvent, type: 'avatar' | 'banner' | 'font') {
    if (!e.files[0]) return

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

async function setupSystem() {
    // 检查密码是否匹配
    if (loginPassword.value !== confirmPassword.value) {
        toast.add({
            severity: 'error',
            summary: '密码不匹配',
            detail: '请确保两次输入的密码相同',
            life: 3000
        })
        return
    }
    submitting.value = true
    api.profileController
        .createProfile({
            body: {
                create: {
                    ...userInfo.value,
                    loginName: loginUsername.value,
                    loginPassword: loginPassword.value
                },
                // TODO 待验证
                avatar:
                    selectedAvatarFile.value ||
                    new File(
                        [await (await fetch('/src/assets/default-avatar.svg')).blob()],
                        'default-avatar.svg'
                    ),
                banner:
                    selectedBannerFile.value ||
                    new File(
                        [await (await fetch('/src/assets/default-banner.svg')).blob()],
                        'default-banner.svg'
                    ),
                ...(selectedFontFile.value && { font: selectedFontFile.value })
            }
        })
        .then(() => {
            toast.add({
                severity: 'success',
                summary: '系统初始化成功',
                detail: '正在前往登录页面',
                life: 3000
            })
            setTimeout(() => {
                router.push('/')
            }, 2000)
        })
        .catch(async (error) => {
            let err = (await error) as ApiErrors['profileController']['createProfile']
            let message = '请检查输入信息并重试'
            if (err.code === 'SYSTEM_ALREADY_INITIALIZED') {
                message = '系统已存在管理员账户，请直接登录'
            } else if (err.code === 'EMPTY_LOGIN_NAME') {
                message = '用户名不能为空'
            }
            toast.add({
                severity: 'error',
                summary: '系统初始化失败',
                detail: message,
                life: 3000
            })
        })
        .finally(() => {
            submitting.value = false
        })
}

function stepChangeHandler(step: number) {
    if (step === 1) {
        activeStep.value = '1'
    } else if (step === 2) {
        // 检查用户名和密码是否为空
        if (!loginUsername.value?.trim() || !loginPassword.value?.trim()) {
            toast.add({
                severity: 'error',
                summary: '请输入管理员账户信息',
                detail: '请确保用户名和密码不为空',
                life: 3000
            })
            return
        }

        // 检查两次密码是否匹配
        if (loginPassword.value !== confirmPassword.value) {
            toast.add({
                severity: 'error',
                summary: '密码不匹配',
                detail: '请确保两次输入的密码相同',
                life: 3000
            })
            return
        }

        activeStep.value = '2'
    }
}
</script>

<template>
    <Toast />
    <div class="min-h-screen w-screen bg-[#f2f2f2] p-6">
        <div class="mx-auto mt-16 mb-8 w-3/4 rounded-lg bg-white p-6 shadow-md">
            <div class="mb-6 flex items-center justify-between">
                <h1 class="text-xl font-bold">UniBoard 初始化</h1>
            </div>

            <Stepper v-model:value="activeStep">
                <StepList>
                    <Step value="1">登录信息</Step>
                    <Step value="2">个人资料</Step>
                </StepList>

                <StepPanels>
                    <!-- Step 1: 登录信息 -->
                    <StepPanel value="1">
                        <div class="py-4">
                            <div class="card mb-4 rounded-lg bg-white p-4">
                                <h2 class="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
                                    登录信息
                                </h2>

                                <div class="space-y-4">
                                    <LabelAndInput
                                        id="username"
                                        label="用户名"
                                        v-model="loginUsername"
                                        :loading="loading"
                                    />
                                    <LabelAndInput
                                        id="password"
                                        label="密码"
                                        v-model="loginPassword"
                                        type="password"
                                        :loading="loading"
                                    />

                                    <LabelAndInput
                                        id="confirmPassword"
                                        label="确认密码"
                                        v-model="confirmPassword"
                                        type="password"
                                        :loading="loading"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-end">
                            <Button
                                label="下一步"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                @click="stepChangeHandler(2)"
                            />
                        </div>
                    </StepPanel>

                    <!-- Step 2: 个人资料 -->
                    <StepPanel value="2">
                        <div class="py-4">
                            <!-- 基本信息 -->
                            <div class="card mb-4 rounded-lg bg-white p-4">
                                <h2 class="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
                                    基本信息
                                </h2>
                                <div class="mt-4 flex items-center space-x-2">
                                    <label for="avatar" class="w-20 shrink-0 text-right"
                                        >头像</label
                                    >
                                    <div class="grow">
                                        <img
                                            :src="avatarUrl"
                                            class="h-32 w-32 rounded-full object-cover shadow-md"
                                            alt="avater"
                                        />
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
                                    <label for="banner" class="w-20 shrink-0 text-right"
                                        >横幅</label
                                    >
                                    <div class="grow">
                                        <img id="banner" :src="bannerUrl" class="w-72" />
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
                                    <LabelAndInput
                                        id="name"
                                        label="展示姓名"
                                        v-model="userInfo.name"
                                        :loading="loading"
                                    />
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

                                <LabelAndInput
                                    id="title"
                                    label="个人标语"
                                    v-model="userInfo.slogan"
                                    :loading="loading"
                                />
                            </div>

                            <!-- 联系方式 -->
                            <div class="rounded-lg bg-white p-4">
                                <!-- 联系方式在一个面板中 -->
                                <Panel
                                    header="联系方式"
                                    :toggleable="true"
                                    :collapsed="contactsPanelCollapsed"
                                    @toggle="contactsPanelCollapsed = !contactsPanelCollapsed"
                                    class="mb-2"
                                >
                                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                        <LabelAndInput
                                            id="contacts.github"
                                            label="GitHub"
                                            v-model="userInfo.contacts.github"
                                            :loading="loading"
                                            placeholder="https://github.com/username"
                                        />
                                        <LabelAndInput
                                            id="contacts.email"
                                            label="Email"
                                            v-model="userInfo.contacts.email"
                                            :loading="loading"
                                            placeholder="mailto://name@email.com"
                                        />
                                        <LabelAndInput
                                            id="contacts.twitter"
                                            label="Twitter"
                                            v-model="userInfo.contacts.twitter"
                                            :loading="loading"
                                        />
                                        <LabelAndInput
                                            id="contacts.facebook"
                                            label="Facebook"
                                            v-model="userInfo.contacts.facebook"
                                            :loading="loading"
                                        />
                                        <LabelAndInput
                                            id="contacts.instagram"
                                            label="Instagram"
                                            v-model="userInfo.contacts.instagram"
                                            :loading="loading"
                                        />
                                        <LabelAndInput
                                            id="contacts.linkedin"
                                            label="LinkedIn"
                                            v-model="userInfo.contacts.linkedin"
                                            :loading="loading"
                                        />
                                        <LabelAndInput
                                            id="contacts.weibo"
                                            label="微博"
                                            v-model="userInfo.contacts.weibo"
                                            :loading="loading"
                                        />
                                        <LabelAndInput
                                            id="contacts.zhihu"
                                            label="知乎"
                                            v-model="userInfo.contacts.zhihu"
                                            :loading="loading"
                                        />
                                        <LabelAndInput
                                            id="contacts.qq"
                                            label="QQ"
                                            v-model="userInfo.contacts.qq"
                                            :loading="loading"
                                        />
                                        <LabelAndInput
                                            id="contacts.telegram"
                                            label="Telegram"
                                            v-model="userInfo.contacts.telegram"
                                            :loading="loading"
                                            placeholder="https://t.me/username"
                                        />
                                    </div>
                                </Panel>
                            </div>
                        </div>

                        <div class="mt-4 flex justify-between">
                            <Button
                                label="上一步"
                                severity="secondary"
                                icon="pi pi-arrow-left"
                                @click="stepChangeHandler(1)"
                            />
                            <Button
                                @click="setupSystem"
                                :loading="submitting"
                                label="初始化系统"
                                class="p-button-primary"
                            />
                        </div>
                    </StepPanel>
                </StepPanels>
            </Stepper>

            <div class="mt-6 flex justify-center">
                <div class="flex items-center text-sm text-gray-500">
                    <i class="pi pi-info-circle mr-2"></i>
                    在此页面关闭之前，数据不会被保存
                </div>
            </div>
        </div>
    </div>
</template>
