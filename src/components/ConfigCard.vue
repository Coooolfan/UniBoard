<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import type { SystemInfo } from '@/api/sysInfo'
import { getSystemInfo } from '@/api/sysInfo'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Skeleton from 'primevue/skeleton'
const dialogRef: any = inject('dialogRef')

const closeDialog = () => {
    dialogRef.value.close()
}
// interface SystemInfo {
//     name: string
//     version: string
//     profile: string
//     avatar: string
//     slogan: string
//     banner: string
//     contacts: {
//         telegram: string
//         qq: string
//         email: string
//         github: string
//         weibo: string
//         zhihu: string
//         twitter: string
//         facebook: string
//         instagram: string
//         linkedin: string
//     }
//     links: Array<Link>
// }
const systemInfo = ref<SystemInfo>()
onMounted(async () => {
    systemInfo.value = await getSystemInfo()
})
</script>
<template>
    <div class="flex items-center space-x-2 min-w-[40vw]">
        <label for="name" class="flex-shrink-0 w-24 text-right">展示姓名</label>
        <div class="flex-grow">
            <InputText v-if="systemInfo" id="name" v-model="systemInfo.name" class="w-full h-10" />
            <Skeleton v-else height="2.5rem"></Skeleton>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="version" class="flex-shrink-0 w-24 text-right">版本号</label>
        <div class="flex-grow">
            <InputText
                v-if="systemInfo"
                id="version"
                v-model="systemInfo.version"
                class="w-full h-10"
            />
            <Skeleton v-else height="2.5rem"></Skeleton>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="profile" class="flex-shrink-0 w-24 text-right">个人简介</label>
        <div class="flex-grow">
            <InputText
                v-if="systemInfo"
                id="profile"
                v-model="systemInfo.profile"
                class="w-full h-10"
            />
            <Skeleton v-else height="2.5rem"></Skeleton>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="avatar" class="flex-shrink-0 w-24 text-right">头像链接</label>
        <div class="flex-grow">
            <InputText
                v-if="systemInfo"
                id="avatar"
                v-model="systemInfo.avatar"
                class="w-full h-10"
            />
            <Skeleton v-else height="2.5rem"></Skeleton>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="slogan" class="flex-shrink-0 w-24 text-right">个人标语</label>
        <div class="flex-grow">
            <InputText
                v-if="systemInfo"
                id="slogan"
                v-model="systemInfo.slogan"
                class="w-full h-10"
            />
            <Skeleton v-else height="2.5rem"></Skeleton>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="banner" class="flex-shrink-0 w-24 text-right">横幅链接</label>
        <div class="flex-grow">
            <InputText
                v-if="systemInfo"
                id="banner"
                v-model="systemInfo.banner"
                class="w-full h-10"
            />
            <Skeleton v-else height="2.5rem"></Skeleton>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="banner" class="flex-shrink-0 w-24 text-right">媒体链接</label>
        <div class="flex items-center space-x-2 w-full">
            <label for="banner" class="flex-shrink-0 w-20 text-right">github</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="contacts.github"
                    v-model="systemInfo.contacts.github"
                    class="h-10 w-full"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
        <div class="flex items-center space-x-2 w-full">
            <label for="banner" class="flex-shrink-0 w-20 text-right">telegram</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="contacts.telegram"
                    v-model="systemInfo.contacts.telegram"
                    class="h-10 w-full"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
        <div class="flex items-center space-x-2 w-full">
            <label for="banner" class="flex-shrink-0 w-20 text-right">QQ</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="contacts.qq"
                    v-model="systemInfo.contacts.qq"
                    class="h-10 w-full"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
        <div class="flex items-center space-x-2 w-full">
            <label for="banner" class="flex-shrink-0 w-20 text-right">email</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="contacts.email"
                    v-model="systemInfo.contacts.email"
                    class="h-10 w-full"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
        <div class="flex items-center space-x-2 w-full">
            <label for="banner" class="flex-shrink-0 w-20 text-right">weibo</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="contacts.weibo"
                    v-model="systemInfo.contacts.weibo"
                    class="h-10 w-full"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
        <div class="flex items-center space-x-2 w-full">
            <label for="banner" class="flex-shrink-0 w-20 text-right">zhihu</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="contacts.zhihu"
                    v-model="systemInfo.contacts.zhihu"
                    class="h-10 w-full"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
        <div class="flex items-center space-x-2 w-full">
            <label for="banner" class="flex-shrink-0 w-20 text-right">twitter</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="contacts.twitter"
                    v-model="systemInfo.contacts.twitter"
                    class="h-10 w-full"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
        <div class="flex items-center space-x-2 w-full">
            <label for="banner" class="flex-shrink-0 w-20 text-right">facebook</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="contacts.facebook"
                    v-model="systemInfo.contacts.facebook"
                    class="h-10 w-full"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
        <div class="flex items-center space-x-2 w-full">
            <label for="banner" class="flex-shrink-0 w-20 text-right">instagram</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="contacts.instagram"
                    v-model="systemInfo.contacts.instagram"
                    class="h-10 w-full"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
        <label for="banner" class="flex-shrink-0 w-24 text-right"></label>
        <div class="flex items-center space-x-2 w-full">
            <label for="banner" class="flex-shrink-0 w-20 text-right">linkedin</label>
            <div class="flex-grow">
                <InputText
                    v-if="systemInfo"
                    id="contacts.linkedin"
                    v-model="systemInfo.contacts.linkedin"
                    class="h-10 w-full"
                />
                <Skeleton v-else height="2.5rem"></Skeleton>
            </div>
        </div>
    </div>
    <div class="mt-8 float-right">
        <Button @click="closeDialog" label="Save" />
        <Button @click="closeDialog" class="ml-8" label="Save and close" />
    </div>
</template>
