<script lang="ts" setup>
import Button from 'primevue/button'
import Card from 'primevue/card'
import LabelAndInput from '@/components/LabelAndInput.vue'
import LabelAndCheckbox from '@/components/LabelAndCheckbox.vue'
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { api } from '@/ApiInstance'
import type { SystemConfigDto } from '@/__generated/model/dto'
import type { ApiErrors } from '@/__generated/ApiErrors'
import { c } from 'node_modules/vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P'
const toast = useToast()
const systemConfigLoading = ref(false)
const sysConfig = ref<SystemConfigDto['SystemConfigController/DEFAULT_SYSTEM_CONFIG']>({
    id: 0,
    host: '',
    showProfile: false,
    showCopyRight: false
})
onMounted(async () => {
    await refreshSystemConfig()
})

async function refreshSystemConfig() {
    systemConfigLoading.value = true
    sysConfig.value = await api.systemConfigController.getSystemConfig()
    systemConfigLoading.value = false
}

const loginName = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordloading = ref(false)

async function updateConfig() {
    systemConfigLoading.value = true
    const resp = await api.systemConfigController.updateSystemConfig({
        body: {
            host: sysConfig.value.host,
            showProfile: sysConfig.value.showProfile,
            showCopyRight: sysConfig.value.showCopyRight
        }
    })
    if (resp) {
        toast.add({
            severity: 'success',
            summary: '更新成功',
            detail: '相关内容刷新页面可见',
            life: 3000
        })
    } else {
        toast.add({
            severity: 'error',
            summary: '更新失败',
            detail: '请检查网络连接或稍后再试',
            life: 3000
        })
    }
    systemConfigLoading.value = false
}

async function updatePassword() {
    passwordloading.value = true
    // if (loginName.value.trim() === '') {
    //     toast.add({
    //         severity: 'error',
    //         summary: '更新失败',
    //         detail: '登录名不能为空',
    //         life: 3000
    //     })
    //     passwordloading.value = false
    //     return
    // }
    if (newPassword.value !== confirmPassword.value) {
        toast.add({
            severity: 'error',
            summary: '更新失败',
            detail: '两次输入的密码不一致',
            life: 3000
        })
        passwordloading.value = false
        return
    }
    try {
        await api.profileController.updatePassword({
            update: {
                loginName: loginName.value,
                oldPassword: oldPassword.value,
                newPassword: newPassword.value
            }
        })

        toast.add({
            severity: 'success',
            summary: '更新成功',
            detail: '退出登录后生效',
            life: 3000
        })
    } catch (error: any) {
        let err: ApiErrors['profileController']['updatePassword']
        if (error instanceof Promise) {
            err = (await error) as ApiErrors['profileController']['updatePassword']
        } else {
            err = error as ApiErrors['profileController']['updatePassword']
        }
        console.log(err)
        let detail = ''
        switch (err.code) {
            case 'EMPTY_LOGIN_NAME':
                detail = '登录名不能为空'
                break
            case 'FORBIDDEN':
                detail = '旧密码错误'
                break
            case 'SYSTEM_UNINITIALIZED':
                detail = '系统未初始化'
                break
            default:
                detail = '未知错误'
                break
        }
        toast.add({
            severity: 'error',
            summary: '更新失败',
            detail: detail,
            life: 3000
        })
    } finally {
        passwordloading.value = false
    }
}
</script>
<template>
    <LabelAndInput
        id="host"
        label="站点域名"
        placeholder="当前版本无须设置此项，留空即可"
        v-model="sysConfig.host"
        :loading="systemConfigLoading"
    />
    <div class="flex">
        <LabelAndCheckbox
            title="是否展示着陆页最下方的版权信息"
            id="showCopyright"
            label="仓库地址"
            v-model="sysConfig.showCopyRight"
            :loading="systemConfigLoading"
        />
        <LabelAndCheckbox
            title="是否展示着陆页信息，如果不展示则只显示登录表单"
            id="showProfilePage"
            label="展示主页"
            v-model="sysConfig.showProfile"
            :loading="systemConfigLoading"
        />
    </div>

    <div class="mt-4 mb-4 flex justify-end">
        <Button @click="updateConfig" :loading="systemConfigLoading" label="保存" />
    </div>

    <Card class="lg:w-1/2">
        <template #content>
            <LabelAndInput
                id="loginName"
                label="登录名"
                v-model="loginName"
                :loading="passwordloading"
            />
            <LabelAndInput
                id="oldPassword"
                label="旧密码"
                v-model="oldPassword"
                :loading="passwordloading"
            />
            <LabelAndInput
                id="newPassword"
                label="新密码"
                v-model="newPassword"
                :loading="passwordloading"
            />
            <LabelAndInput
                id="confirmPassword"
                label="确认密码"
                v-model="confirmPassword"
                :loading="passwordloading"
            />
        </template>
        <template #footer>
            <div class="mt-4 flex justify-end">
                <Button @click="updatePassword" :loading="passwordloading" label="更新" />
            </div>
        </template>
    </Card>
</template>
