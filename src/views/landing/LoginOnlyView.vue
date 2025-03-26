<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import router from '@/router'
import { api } from '@/ApiInstance'
import type { ApiErrors } from '@/__generated'
const username = ref('')
const password = ref('')
const loading = ref(false)
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
        class="h-dvh bg-[#f2f2f2] dark:bg-[#1e2939] transition-all flex flex-col justify-center items-center"
    >
        <h3 class="font-bold text-2xl">UniBoard</h3>
        <form
            class="animate-slide-up mt-4 flex flex-col gap-4 w-1/2 max-w-60"
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
