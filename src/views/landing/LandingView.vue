<script setup lang="ts">
import { ref, onMounted, nextTick, useTemplateRef, computed } from 'vue'
import LandingPageLink from '@/components/HyperLinkCard.vue'
import router from '@/router'
import ProfileComponent from '@/components/LandingView/ProfileComponent.vue'
import LoginOnlyView from '@/views/landing/LoginOnlyView.vue'
import { api } from '@/ApiInstance'
import { unwrapApiError } from '@/utils/errorHandling'
import type { HyperLinkDto, ProfileDto, SystemConfigDto } from '@/__generated/model/dto'
import type { ApiErrors } from '@/__generated'
import { isLoggedIn } from '@/utils/IsLogin'
const fontFamily = ref('arial')
const sloganType = ref<'slogan' | 'password'>('slogan')
const username = ref('')
const password = ref('')
const usernameInputRef = useTemplateRef('usernameInput')
const loading = ref(false)
const profile = ref<ProfileDto['ProfileController/PUBLIC_PROFILE'] | null>(null)
const links = ref<ReadonlyArray<HyperLinkDto['HyperLinkController/DEFAULT_HYPER_LINK']>>([])
const systemConfig = ref<SystemConfigDto['SystemConfigController/DEFAULT_SYSTEM_CONFIG']>({
    id: 0,
    host: '',
    showProfile: true,
    showCopyRight: true
})
onMounted(async () => {
    api.systemConfigController.getSystemConfig().then((res) => {
        systemConfig.value = res
    })
    api.profileController
        .getProfile()
        .then((res) => {
            profile.value = res
            loadFont()
            document.title = `${profile.value.name} - ${profile.value.description}`
            document
                .querySelector('link[rel="icon"]')
                ?.setAttribute('href', profile.value.avatar.filepath)
        })
        .catch(async (error) => {
            const err = await unwrapApiError<ApiErrors['profileController']['getProfile']>(error)
            if (err.code === 'SYSTEM_UNINITIALIZED') router.push('/setup')
        })
    api.hyperLinkController
        .getAllHyperLinks()
        .then((res) => {
            links.value = res
        })
        .catch((err) => {
            console.error(err)
        })
})

async function loadFont() {
    if (!profile.value?.customFont) return
    const font = new FontFace('CustomFont', `url(${profile.value?.customFont?.filepath})`)
    await font.load()
    document.fonts.add(font)
    fontFamily.value = 'CustomFont'
}

async function switchSloganType() {
    if (isLoggedIn()) {
        router.push('/dashboard')
        return
    }
    loading.value = false
    // 如果已经登录，直接跳转到首页
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
    } catch (error) {
        const err = await unwrapApiError<ApiErrors['tokenController']['getToken']>(error)
        if (err.code === 'AUTHENTICATION_FAILED') {
            sloganType.value = 'slogan'
        }
        loading.value = false
    }
}
</script>
<template>
    <LoginOnlyView v-if="!systemConfig.showProfile"></LoginOnlyView>
    <div class="relative min-h-screen bg-[#f2f2f2] transition-all lg:bg-transparent" v-else>
        <img
            :src="profile?.banner.filepath"
            class="absolute inset-0 -z-20 h-full w-full object-cover brightness-90 filter lg:block"
            alt="banner"
        />
        <div class="z-30 flex flex-col lg:flex-row lg:place-content-between lg:items-center">
            <div class="lg:animate-slide-right w-auto lg:grid">
                <img
                    src="/src/assets/svg/profile_mask.svg"
                    alt="profile_mask"
                    class="lg:drop-shadow-5xl hidden lg:-z-10 lg:col-start-1 lg:col-end-1 lg:row-start-1 lg:row-end-1 lg:block lg:h-screen lg:overflow-hidden lg:object-fill lg:shadow-black"
                />
                <ProfileComponent
                    class="mt-30 w-full lg:col-start-1 lg:col-end-1 lg:row-start-1 lg:row-end-1 lg:mt-0 lg:ml-4 lg:w-[71%]"
                    :profile="profile"
                    :fontFamily="fontFamily"
                    @switch-slogan-type="switchSloganType"
                />
            </div>

            <span
                v-show="sloganType === 'slogan'"
                class="animate-slide-up lg:text-shadow-xl hidden lg:block lg:grow-1 lg:-translate-y-12 lg:text-center lg:text-5xl lg:tracking-widest lg:text-white"
            >
                {{ profile?.slogan }}
            </span>

            <form
                v-show="sloganType === 'password'"
                class="animate-slide-up flex flex-col items-center justify-center lg:grow-1 lg:-translate-y-12 lg:flex-row lg:gap-8 lg:text-center"
                @submit.prevent="login"
            >
                <input
                    type="text"
                    ref="usernameInput"
                    v-model="username"
                    class="text-shadow-m mt-10 appearance-none border-0 border-b-2 border-white bg-transparent text-center text-xl text-white shadow-black/50 outline-hidden focus:border-b-green-800 focus:outline-hidden lg:mt-0"
                />
                <input
                    type="password"
                    v-model="password"
                    class="text-shadow-m mt-10 appearance-none border-0 border-b-2 border-white bg-transparent text-center text-xl text-white shadow-black/50 outline-hidden focus:border-b-green-800 focus:outline-hidden lg:mt-0"
                />
                <button
                    :class="loading ? 'pi-spin pi-spinner' : 'pi-arrow-right'"
                    class="pi text-shadow-m mt-8 mb-8 text-white shadow-black"
                    type="submit"
                />
            </form>
        </div>
    </div>

    <div
        v-if="links?.length && systemConfig.showProfile"
        class="z-20 flex min-h-screen w-auto flex-col items-center bg-[#f2f2f2] bg-linear-to-b shadow-inner"
    >
        <p class="mt-[10vh] text-4xl font-extrabold text-slate-800">选择一个页面以继续</p>
        <div class="mt-5 mb-5 w-1/2 border border-t-0 border-r-0 border-l-0 border-[#A0A0A0]" />
        <p class="mb-20 text-base text-slate-600 italic">此页面的中的内容并非全部公开项</p>
        <div
            class="mx-auto grid grid-cols-1 items-center justify-center gap-10 lg:grid-cols-2 xl:w-4/5 xl:grid-cols-3"
        >
            <template v-for="link in links" :key="link.id">
                <LandingPageLink :hyperLink="link" />
            </template>
        </div>
    </div>

    <footer
        v-if="systemConfig.showCopyRight && systemConfig.showProfile"
        class="items-center bg-[#f2f2f2] p-2 text-center text-slate-600"
    >
        <a href="https://github.com/Coooolfan/" class="italic" target="_blank">@Coooolfan</a>
        Powered by
        <a href="https://github.com/Coooolfan/UniBoard" class="italic" target="_blank">UniBoard</a>
    </footer>
</template>
