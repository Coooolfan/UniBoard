<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import router from '@/router'
import { api } from '@/ApiInstance'
import type { ApiErrors } from '@/__generated'
import { isLoggedIn } from '@/utils/IsLogin'
const username = ref('')
const password = ref('')
const loading = ref(false)
onMounted(() => {
    if (isLoggedIn()) {
        router.push('/dashboard')
    }
})
async function login() {
    loading.value = true
    try {
        await api.tokenController.getToken({
            login: {
                loginName: username.value,
                loginPassword: password.value
            }
        })
        loading.value = false
        // 登录成功后跳转到首页
        router.push('/dashboard')
    } catch (err) {
        const error = (await err) as ApiErrors['tokenController']['getToken']
        if (error.code === 'AUTHENTICATION_FAILED') {
            window.alert('登录失败\n请检查用户名和密码')
        }
        loading.value = false
    }
}
</script>
<template>
    <div
        class="flex h-dvh flex-col items-center justify-center bg-[#f2f2f2] transition-all dark:bg-[#1e2939]"
    >
        <h3 class="text-2xl font-bold text-black dark:text-white">UniBoard</h3>
        <form
            class="animate-slide-up mt-4 flex w-1/2 max-w-60 flex-col gap-4"
            @submit.prevent="login"
        >
            <InputText type="text" name="username" placeholder="用户名" v-model="username" fluid />
            <Password v-model="password" :feedback="false" placeholder="密码" toggleMask fluid />
            <Button
                :label="loading ? '登录中' : '登录'"
                @click="login"
                :loading="loading"
                type="submit"
            />
        </form>
    </div>
</template>
