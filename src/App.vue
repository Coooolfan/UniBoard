<template>
  <component :is="componentId"></component>
</template>

<script>
import HomePage from './components/HomePage/HomePage.vue';
import LandingPage from './components/LandingPage/LandingPage.vue';
import { localstorge_manager } from './api/localstorage.js'
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
    var pagestored = localstorge_manager.getPage();
    if (pagestored == undefined || pagestored == null) {
      localstorge_manager.setPage('LandingPage');
    } else {
      this.componentId = pagestored;
    }

  },
};
</script>