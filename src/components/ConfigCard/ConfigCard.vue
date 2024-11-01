<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import type { UserInfo } from '@/api/userInfo'
import { getUserInfo, defaultUserInfo } from '@/api/userInfo'
import { removeToken } from '@/api/auth'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import { gethyperLinkCacheList, type HyperLinkCache } from '@/api/hyperLink'
import { useRouter } from 'vue-router'
import ConfigCardLanding from '@/components/ConfigCard/ConfigCardLanding.vue'
import ConfigCardHyperLink from '@/components/ConfigCard/ConfigCardHyperLink.vue'
const router = useRouter()
const dialogRef: any = inject('dialogRef')
const userInfo = ref<UserInfo>(structuredClone(defaultUserInfo))
const hyperLinkCacheList = ref<Array<HyperLinkCache>>([])
onMounted(async () => {
    userInfo.value = await getUserInfo()
    userInfo.value.loading = false
    hyperLinkCacheList.value = await gethyperLinkCacheList()
    hyperLinkCacheList.value.forEach((item) => {
        item.uploading = false
    })
})

function logout() {
    removeToken()
    router.push('/')
}

const closeDialog = () => {
    dialogRef.value.close()
}
</script>
<template>
    <Tabs value="0">
        <TabList>
            <Tab value="0">首屏设置</Tab>
            <Tab value="1">外链设置</Tab>
        </TabList>
        <TabPanels>
            <TabPanel value="0"> <ConfigCardLanding /> </TabPanel>
            <TabPanel value="1"> <ConfigCardHyperLink /> </TabPanel>
        </TabPanels>
    </Tabs>

    <br />

    <div class="flex mt-4 justify-end gap-4">
        <Button @click="logout" label="退出登录" severity="danger" /><Button
            @click="closeDialog"
            label="关闭"
        />
    </div>
</template>
<style scoped>
/* 手动声明Tabs组件的根元素宽度 */
.p-tabs {
    width: 80vw;
}
</style>
