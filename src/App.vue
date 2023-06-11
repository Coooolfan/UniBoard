<template>
  <component :is="componentId"></component>
</template>

<script>
import LandingPage from './LandingPage.vue';
export default {
  components: {
    LandingPage,
  },
  data() {
    return {
      componentId: 'LandingPage',
    };
  },
};
</script>