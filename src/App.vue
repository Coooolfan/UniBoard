<template>
    <component :is="componentId"></component>
</template>

<script>
// import HomePage from './components/HomePage/HomePage.vue';
import LandingPage from './components/LandingPage/LandingPage.vue';
import { defineAsyncComponent } from 'vue'
import { localstorge_manager } from './api/localstorage.js'

const HomePage = defineAsyncComponent(() =>
    import('./components/HomePage/HomePage.vue')
)

export default {
    components: {
        LandingPage,
        HomePage,
    },
    data() {
        return {
            componentId: 'LandingPage',
        };

    },
    mounted() {
        const pageStored = localstorge_manager.getPage();
        if (pageStored == undefined || pageStored == null) {
            localstorge_manager.setPage('LandingPage');
        } else {
            this.componentId = pageStored;
        }
        if (localstorge_manager.getDeviceID() == undefined || localstorge_manager.getDeviceID() == null) {
            localstorge_manager.setDeviceID();
        }

    },
};
</script>