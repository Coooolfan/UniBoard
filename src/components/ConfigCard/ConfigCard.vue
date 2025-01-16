<script setup lang="ts">
import { inject } from 'vue'
import Button from 'primevue/button'
import { removeToken } from '@/api/auth'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import { useRouter } from 'vue-router'
import ConfigCardLanding from '@/components/ConfigCard/ConfigCardLanding.vue'
import ConfigCardHyperLink from '@/components/ConfigCard/ConfigCardHyperLink.vue'
import ConfigCardSystem from '@/components/ConfigCard/ConfigCardSystem.vue'
const router = useRouter()
const dialogRef: any = inject('dialogRef')

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
            <Tab value="2">系统设置</Tab>
        </TabList>
        <TabPanels>
            <TabPanel value="0"> <ConfigCardLanding /> </TabPanel>
            <TabPanel value="1"> <ConfigCardHyperLink /> </TabPanel>
            <TabPanel value="2"> <ConfigCardSystem /> </TabPanel>
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
    min-width: 80vw;
}
</style>
