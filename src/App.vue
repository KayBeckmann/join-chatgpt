<template>
  <div id="app">
    <!-- Desktop Navbar -->
    <Navbar v-if="isDesktop" />
    
    <!-- Router View -->
    <router-view />
    
    <!-- Mobile Menu -->
    <MobileMenu v-if="!isDesktop" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import MobileMenu from './components/MobileMenu.vue';

export default {
  components: {
    Navbar,
    MobileMenu,
  },
  data() {
    return {
      isDesktop: window.innerWidth >= 768,
    };
  },
  mounted() {
    window.addEventListener('resize', this.checkDevice);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkDevice);
  },
  methods: {
    checkDevice() {
      this.isDesktop = window.innerWidth >= 768;
    },
  },
};
</script>

<style>
/* Allgemeine App-Styling */
#app {
  font-family: 'Arial', sans-serif;
  text-align: center;
  margin: 0;
  padding: 0;
}
</style>