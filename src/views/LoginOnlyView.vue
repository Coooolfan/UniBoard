<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { loginByPassword, verifyTokenLocal } from '@/api/auth'
import router from '@/router'
const username = ref('')
const password = ref('')
const loading = ref(false)
async function login() {
    loading.value = true
    if (verifyTokenLocal()) {
        router.push('/dashboard')
        return
    }
    if (await loginByPassword(username.value, password.value)) {
        router.push('/dashboard')
        return
    }
    window.alert('登录失败\n请检查用户名和密码')
    loading.value = false
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
