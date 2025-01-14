<script lang="ts" setup>
import { defaultSysConfig, getSysConfig, patchSysConfig, type sysConfig } from '@/api/sysConfig'
import Button from 'primevue/button'
import Card from 'primevue/card'
import LabelAndInput from '@/components/LabelAndInput.vue'
import LabelAndCheckbox from '@/components/LabelAndCheckbox.vue'
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { changePassword } from '@/api/auth'
const toast = useToast()
const sysConfig = ref<sysConfig>(structuredClone(defaultSysConfig))
onMounted(async () => {
    sysConfig.value = await getSysConfig()
})

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordloading = ref(false)

async function updateConfig() {
    sysConfig.value.loading = true
    const resp = await patchSysConfig(sysConfig.value)
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
    sysConfig.value.loading = false
}

async function updatePassword() {
    passwordloading.value = true
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
    const resp = await changePassword(oldPassword.value, newPassword.value)
    if (resp === 'success') {
        toast.add({
            severity: 'success',
            summary: '更新成功',
            detail: '退出登录后生效',
            life: 3000
        })
    } else {
        toast.add({
            severity: 'error',
            summary: '更新失败',
            detail: resp,
            life: 20000
        })
    }
    passwordloading.value = false
}
</script>
<template>
    <LabelAndInput
        id="host"
        label="站点域名"
        placeholder="当前版本无须设置此项，留空即可"
        v-model="sysConfig.host"
        :loading="sysConfig.loading"
    />
    <div class="flex">
        <LabelAndCheckbox
            title="是否展示着陆页最下方的版权信息"
            id="showCopyright"
            label="仓库地址"
            v-model="sysConfig.show_copyright"
            :loading="sysConfig.loading"
        />
        <LabelAndCheckbox
            title="是否展示着陆页信息，如果不展示则只显示登录表单"
            id="showProfilePage"
            label="展示主页"
            v-model="sysConfig.show_profile_page"
            :loading="sysConfig.loading"
        />
    </div>

    <div class="flex justify-end mt-4 mb-4">
        <Button @click="updateConfig" :loading="sysConfig.loading" label="保存" />
    </div>

    <Card style="background-color: #f2f2f2" class="w-1/2">
        <template #content>
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
            <div class="flex justify-end mt-4">
                <Button @click="updatePassword" :loading="passwordloading" label="更新" />
            </div>
        </template>
    </Card>
</template>
