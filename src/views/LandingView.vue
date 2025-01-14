<script setup lang="ts">
import { getUserInfo } from '@/api/userInfo'
import type { UserInfo } from '@/api/userInfo'
import { ref, onMounted, watch, nextTick, useTemplateRef } from 'vue'
import LandingPageLink from '@/components/HyperLinkCard.vue'
import { getHyperLinks } from '@/api/hyperLink'
import type { HyperLink } from '@/api/hyperLink'
import { loginByPassword, loginByTOTP, verifyTokenLocal } from '@/api/auth'
import { getSysConfig, type sysConfig } from '@/api/sysConfig'
import InputOtp from 'primevue/inputotp'
import router from '@/router'
const userInfo = ref<UserInfo | null>(null)
const links = ref<Array<HyperLink>>([])
const sysConfig = ref<sysConfig>()
const fontFamily = ref('arial')

onMounted(async () => {
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
    getSysConfig().then((res) => {
        sysConfig.value = res
    })
})

async function loadFont() {
    if(!userInfo.value?.name_font) return
    const font = new FontFace('CustomFont', `url(${userInfo.value?.name_font})`)
    await font.load()
    document.fonts.add(font)
    fontFamily.value = 'CustomFont'
}

function getSvgPath(name: string) {
    // 使用动态import语法导入SVG文件
    // https://www.iconfinder.com/
    return new URL(`../assets/svg/${name}.svg`, import.meta.url).href
}
const sloganType = ref<'slogan' | 'otp' | 'password'>('slogan')
const otp = ref('')
const username = ref('')
const password = ref('')
const otpInputRef = useTemplateRef('otpInput')
const usernameInputRef = useTemplateRef('usernameInput')
const loading = ref(false)

async function switchSloganType(usePassword?: boolean) {
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

watch(otp, (newVal) => {
    if (newVal.length === 6) {
        login()
    }
})

async function login() {
    loading.value = true
    if (sloganType.value === 'otp' && (await loginByTOTP(otp.value))) {
        // 登录成功后跳转到首页
        loading.value = false
        router.push('/dashboard')
    } else if (
        sloganType.value === 'password' &&
        (await loginByPassword(username.value, password.value))
    ) {
        loading.value = false
        // 登录成功后跳转到首页
        router.push('/dashboard')
    } else {
        otp.value = ''
        sloganType.value = 'slogan'
    }
}
</script>
<template>
    <div class="min-h-screen first-page relative bg-[#f2f2f2] transition-all lg:bg-transparent">
        <svg
            class="h-screen w-auto absolute top-0 left-0 -z-10 drop-shadow-5xl shadow-black hidden overflow-hidden lg:block md:-translate-x-6 2xl:translate-x-0"
            width="1638.389"
            height="2160"
            viewBox="0 0 433.49 571.5"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <clipPath id="a">
                    <path fill="none" stroke-width=".321" d="M0 0h475.949v571.5H0z" />
                </clipPath>
            </defs>
            <path
                d="M-20.43-12.51l417.518 1.042s92.666 30.194-17.7 329.016-58.307 266.545-58.307 266.545l-4.164 64.554-369.624-9.37z"
                clip-path="url(#a)"
                fill="#f2f2f2"
            />
        </svg>
        <picture>
            <img
                :src="userInfo?.banner"
                class="absolute inset-0 object-cover w-full h-full filter brightness-90 -z-20 hidden md:block"
                alt="banner"
            />
        </picture>
        <div class="flex z-30 flex-col lg:flex-row xl:gap-96">
            <div
                class="flex flex-col items-center justify-center gap-0 2xl:gap-4 mt-[10vh] md:mt-0 md:pl-5 xl:pl-0 z-30 translate-x-0 xl:translate-x-16 2xl:translate-x-28 transition-all"
            >
                <picture>
                    <img
                        :src="userInfo?.avatar"
                        class="rounded-full object-cover w-48 h-48 xl:w-60 xl:h-60 shadow-md"
                        alt="avater"
                    />
                </picture>
                <div
                    class="font-bold text-6xl mt-12 drop-shadow-xl z-50 cursor-pointer"
                    @click="switchSloganType()"
                    :style="{ fontFamily: fontFamily }"
                >
                    {{ userInfo?.name }}
                </div>
                <div
                    class="border-[#A0A0A0] border border-t-0 border-l-0 border-r-0 mt-20 lg:mt-8 xl:mt-20 w-3/5"
                />
                <p class="text-[#404040] mt-5 text-lg">
                    {{ userInfo?.profile }}
                </p>
                <div class="flex w-80 justify-around mt-24">
                    <template v-for="(url, key) in userInfo?.contacts" :key="key">
                        <div v-if="url">
                            <a :href="url">
                                <img class="w-6" :src="getSvgPath(key)" :alt="key" />
                            </a>
                        </div>
                    </template>
                </div>
            </div>
            <div class="grow z-10">
                <div class="relative h-auto mt-8 w-full lg:h-screen lg:mt-0">
                    <div
                        class="relative flex items-center justify-center h-full w-full pb-10 text-white text-5xl tracking-widest text-shadow-xl"
                    >
                        <InputOtp v-show="sloganType === 'otp'" v-model="otp" :length="6">
                            <template #default="{ attrs, events, index }">
                                <input
                                    v-if="index === 1"
                                    ref="otpInput"
                                    type="text"
                                    v-bind="attrs"
                                    v-on="events"
                                    class="animate-slide-up text-shadow shadow-black/50 ml-2.5 w-10 text-4xl border-0 appearance-none text-center transition-all duration-200 bg-transparent outline-hidden border-b-2 border-gray-300 focus:outline-hidden focus:border-b-gray-200"
                                />
                                <input
                                    v-else
                                    type="text"
                                    v-bind="attrs"
                                    v-on="events"
                                    class="animate-slide-up text-shadow shadow-black/50 ml-2.5 w-10 text-4xl border-0 appearance-none text-center transition-all duration-200 bg-transparent outline-hidden border-b-2 border-gray-300 focus:outline-hidden focus:border-b-gray-200"
                                />
                                <i
                                    class="animate-slide-up pi pi-angle-double-right pl-4 text-white cursor-pointer"
                                    v-if="index === 6"
                                    @click="switchSloganType(true)"
                                ></i>
                            </template>
                        </InputOtp>
                        <form
                            v-show="sloganType === 'password'"
                            class="animate-slide-up flex flex-col items-center justify-center lg:flex-row"
                            @submit.native.prevent
                        >
                            <input
                                type="text"
                                ref="usernameInput"
                                v-model="username"
                                class="text-shadow-m caret-black shadow-black/50 lg:ml-2.5 lg:w-36 text-xl border-0 appearance-none text-center bg-transparent outline-hidden border-b-2 border-black mt-10 lg:border-gray-100 lg:mt-0 focus:outline-hidden focus:border-b-green-800"
                            />
                            <input
                                type="password"
                                v-model="password"
                                class="text-shadow-m caret-black shadow-black/50 lg:ml-2.5 lg:w-36 text-xl border-0 appearance-none text-center bg-transparent outline-hidden border-b-2 border-black mt-10 lg:border-gray-100 lg:mt-0 lg:mr-4 focus:outline-hidden focus:border-b-green-800"
                            />
                            <button
                                :class="loading ? 'pi-spin pi-spinner' : 'pi-arrow-right'"
                                class="pi text-shadow-m shadow-black"
                                @click="login"
                            />
                        </form>
                        <span
                            v-show="sloganType === 'slogan'"
                            class="animate-slide-up hidden lg:block"
                        >
                            {{ userInfo?.slogan }}</span
                        >
                    </div>
                </div>
            </div>
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
        Source Code
        <a href="https://github.com/Coooolfan/UniBoard" class="italic" target="_blank">UniBoard</a>
    </footer>
</template>
