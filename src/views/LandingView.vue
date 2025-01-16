<script setup lang="ts">
import { defaultUserInfo, getUserInfo } from '@/api/userInfo'
import type { UserInfo } from '@/api/userInfo'
import { ref, onMounted, nextTick, useTemplateRef } from 'vue'
import LandingPageLink from '@/components/HyperLinkCard.vue'
import { getHyperLinks } from '@/api/hyperLink'
import type { HyperLink } from '@/api/hyperLink'
import { loginByPassword, verifyTokenLocal } from '@/api/auth'
import { getSysConfig, type sysConfig } from '@/api/sysConfig'
import router from '@/router'
import ProfileComponent from '@/components/LandingView/ProfileComponent.vue'
import cloneWithFallback from '@/assets/utils/CloneWithCallback'
const userInfo = ref<UserInfo>(cloneWithFallback(defaultUserInfo))
const links = ref<Array<HyperLink>>([])
const sysConfig = ref<sysConfig>()
const fontFamily = ref('arial')
const sloganType = ref<'slogan' | 'password'>('slogan')
const username = ref('')
const password = ref('')
const usernameInputRef = useTemplateRef('usernameInput')
const loading = ref(false)

onMounted(async () => {
    getSysConfig().then((res) => {
        sysConfig.value = res
    })
    getUserInfo().then((res) => {
        userInfo.value = res
        document.title = userInfo.value.name
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
        favicon.href = userInfo.value.avatar
        loadFont()
    })
    getHyperLinks().then((res) => {
        links.value = res
    })
})

async function loadFont() {
    if (!userInfo.value?.name_font) return
    const font = new FontFace('CustomFont', `url(${userInfo.value?.name_font})`)
    await font.load()
    document.fonts.add(font)
    fontFamily.value = 'CustomFont'
}

async function switchSloganType() {
    loading.value = false
    // 如果已经登录，直接跳转到首页
    if (verifyTokenLocal()) {
        router.push('/dashboard')
        return
    }
    if (sloganType.value === 'slogan') {
        sloganType.value = 'password'
        await nextTick()
        usernameInputRef.value!.focus()
        return
    }
    sloganType.value = 'slogan'
}

async function login() {
    loading.value = true
    if (
        sloganType.value === 'password' &&
        (await loginByPassword(username.value, password.value))
    ) {
        loading.value = false
        // 登录成功后跳转到首页
        router.push('/dashboard')
    } else {
        sloganType.value = 'slogan'
    }
}
</script>
<template>
    <div class="min-h-screen first-page relative bg-[#f2f2f2] transition-all lg:bg-transparent">
        <img
            :src="userInfo.banner"
            class="absolute inset-0 object-cover w-full h-full filter brightness-90 -z-20 lg:block"
            alt="banner"
        />

        <div class="flex z-30 flex-col lg:flex-row lg:items-center lg:place-content-between">
            <div class="w-auto lg:grid">
                <img
                    src="/src/assets/svg/profile_mask.svg"
                    alt="profile_mask"
                    class="hidden lg:block lg:overflow-hidden lg:h-screen lg:object-fill lg:-z-10 lg:drop-shadow-5xl lg:shadow-black lg:row-start-1 lg:col-start-1 lg:row-end-1 lg:col-end-1"
                />
                <ProfileComponent
                    class="mt-30 w-full lg:row-start-1 lg:col-start-1 lg:row-end-1 lg:col-end-1 lg:mt-0 lg:ml-4 lg:w-[71%]"
                    :userInfo="userInfo"
                    :fontFamily="fontFamily"
                    @switch-slogan-type="switchSloganType"
                />
            </div>

            <span
                v-show="sloganType === 'slogan'"
                class="hidden animate-slide-up lg:block lg:grow-1 lg:text-center lg:text-white lg:text-shadow-xl lg:tracking-widest lg:-translate-y-12 lg:text-5xl"
            >
                {{ userInfo.slogan }}
            </span>

            <form
                v-show="sloganType === 'password'"
                class="animate-slide-up flex flex-col items-center justify-center lg:grow-1 lg:text-center lg:flex-row lg:gap-8 lg:-translate-y-12"
                @submit.native.prevent
            >
                <input
                    type="text"
                    ref="usernameInput"
                    v-model="username"
                    class="text-shadow-m text-white shadow-black/50 text-xl border-0 appearance-none text-center bg-transparent outline-hidden border-b-2 border-white mt-10 lg:mt-0 focus:outline-hidden focus:border-b-green-800"
                />
                <input
                    type="password"
                    v-model="password"
                    class="text-shadow-m text-white shadow-black/50 text-xl border-0 appearance-none text-center bg-transparent outline-hidden border-b-2 border-white mt-10 lg:mt-0 focus:outline-hidden focus:border-b-green-800"
                />
                <button
                    :class="loading ? 'pi-spin pi-spinner' : 'pi-arrow-right'"
                    class="pi text-shadow-m shadow-black text-white mt-8 mb-8"
                    @click="login"
                />
            </form>
        </div>
    </div>

    <div
        v-show="links.length > 0"
        class="flex min-h-screen second-page items-center w-auto flex-col shadow-inner z-20 bg-linear-to-b bg-[#f2f2f2]"
    >
        <p class="text-4xl font-extrabold mt-[10vh]">选择一个页面以继续</p>
        <div class="border-[#A0A0A0] border border-t-0 border-l-0 border-r-0 mt-5 mb-5 w-1/2" />
        <p class="text-base mb-20 italic text-gray-800">此页面的中的内容并非全部公开项</p>
        <div
            class="grid grid-cols-1 xl:w-4/5 lg:grid-cols-2 xl:grid-cols-3 mx-auto gap-10 items-center justify-center"
        >
            <template v-for="link in links" :key="link.id">
                <LandingPageLink :linkData="link" />
            </template>
        </div>
    </div>
    <footer
        v-show="sysConfig?.show_copyright"
        class="bg-[#f2f2f2] items-center text-center pt-8 pb-2"
    >
        <a href="https://github.com/Coooolfan/" class="italic" target="_blank">@Coooolfan</a>
        Powered by
        <a href="https://github.com/Coooolfan/UniBoard" class="italic" target="_blank">UniBoard</a>
    </footer>
</template>
