<script setup lang="ts">
import { ref, onMounted, nextTick, useTemplateRef, computed } from 'vue'
import LandingPageLink from '@/components/HyperLinkCard.vue'
import router from '@/router'
import ProfileComponent from '@/components/LandingView/ProfileComponent.vue'
import LoginOnlyView from '@/views/LoginOnlyView.vue'
import cloneWithFallback from '@/assets/utils/CloneWithCallback'
import { api } from '@/ApiInstance'
import type { ProfileDto } from '@/__generated/model/dto'
import type { ApiErrors } from '@/__generated'
import type { Dynamic_HyperLink } from '@/__generated/model/dynamic'
// const sysConfig = ref<sysConfig>(cloneWithFallback(defaultSysConfig))
const fontFamily = ref('arial')
const sloganType = ref<'slogan' | 'password'>('slogan')
const username = ref('')
const password = ref('')
const usernameInputRef = useTemplateRef('usernameInput')
const loading = ref(false)
const profile = ref<ProfileDto["ProfileController/PUBLIC_PROFILE"] | null>(null)
const links = ref<ReadonlyArray<Dynamic_HyperLink> | null>(null)
onMounted(async () => {
    api.profileController.getProfile().then(res => {
        profile.value = res
        loadFont()
        document.title = `${profile.value.name} - ${profile.value.description}`
    })
    api.hyperLinkController.getAllHyperLinks().then(res => {
        links.value = res
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
        });
        loading.value = false;
        // 登录成功后跳转到首页
        router.push('/dashboard');
    } catch (err) {
        const error = await err as ApiErrors["tokenController"]["getToken"];
        if (error.code === 'AUTHENTICATION_FAILED') {
            sloganType.value = 'slogan';
        }
        loading.value = false;
    }
}

const onlyShowLoginView = computed(() => {
    return false
})

</script>
<template>
    <LoginOnlyView v-if="onlyShowLoginView"></LoginOnlyView>
    <div class="min-h-screen relative bg-[#f2f2f2] transition-all lg:bg-transparent" v-if="!onlyShowLoginView">
        <img :src="profile?.banner.filepath"
            class="absolute inset-0 object-cover w-full h-full filter brightness-90 -z-20 lg:block" alt="banner" />
        <div class="flex z-30 flex-col lg:flex-row lg:items-center lg:place-content-between">
            <div class="w-auto lg:animate-slide-right lg:grid">
                <img src="/src/assets/svg/profile_mask.svg" alt="profile_mask"
                    class="hidden lg:block lg:overflow-hidden lg:h-screen lg:object-fill lg:-z-10 lg:drop-shadow-5xl lg:shadow-black lg:row-start-1 lg:col-start-1 lg:row-end-1 lg:col-end-1" />
                <ProfileComponent
                    class="mt-30 w-full lg:row-start-1 lg:col-start-1 lg:row-end-1 lg:col-end-1 lg:mt-0 lg:ml-4 lg:w-[71%]"
                    :profile="profile" :fontFamily="fontFamily" @switch-slogan-type="switchSloganType" />
            </div>

            <span v-show="sloganType === 'slogan'"
                class="hidden animate-slide-up lg:block lg:grow-1 lg:text-center lg:text-white lg:text-shadow-xl lg:tracking-widest lg:-translate-y-12 lg:text-5xl">
                {{ profile?.slogan }}
            </span>

            <form v-show="sloganType === 'password'"
                class="animate-slide-up flex flex-col items-center justify-center lg:grow-1 lg:text-center lg:flex-row lg:gap-8 lg:-translate-y-12"
                @submit.prevent="login">
                <input type="text" ref="usernameInput" v-model="username"
                    class="text-shadow-m text-white shadow-black/50 text-xl border-0 appearance-none text-center bg-transparent outline-hidden border-b-2 border-white mt-10 lg:mt-0 focus:outline-hidden focus:border-b-green-800" />
                <input type="password" v-model="password"
                    class="text-shadow-m text-white shadow-black/50 text-xl border-0 appearance-none text-center bg-transparent outline-hidden border-b-2 border-white mt-10 lg:mt-0 focus:outline-hidden focus:border-b-green-800" />
                <button :class="loading ? 'pi-spin pi-spinner' : 'pi-arrow-right'"
                    class="pi text-shadow-m shadow-black text-white mt-8 mb-8" type="submit" />
            </form>
        </div>
    </div>

    <div v-if="links?.length"
        class="flex min-h-screen items-center w-auto flex-col shadow-inner z-20 bg-linear-to-b bg-[#f2f2f2]">
        <p class="text-4xl font-extrabold mt-[10vh] text-slate-800">选择一个页面以继续</p>
        <div class="border-[#A0A0A0] border border-t-0 border-l-0 border-r-0 mt-5 mb-5 w-1/2" />
        <p class="text-base mb-20 italic text-slate-600">此页面的中的内容并非全部公开项</p>
        <div class="grid grid-cols-1 xl:w-4/5 lg:grid-cols-2 xl:grid-cols-3 mx-auto gap-10 items-center justify-center">
            <template v-for="link in links" :key="link.id">
                <LandingPageLink :hyperLink="link" />
            </template>
        </div>
    </div>

    <footer class="bg-[#f2f2f2] items-center text-center pt-8 pb-2 text-slate-600">
        <a href="https://github.com/Coooolfan/" class="italic" target="_blank">@Coooolfan</a>
        Powered by
        <a href="https://github.com/Coooolfan/UniBoard" class="italic" target="_blank">UniBoard</a>
    </footer>
</template>
