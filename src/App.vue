<template>
  <div id='app'>
    <Navbar />
    <router-view />
    <Footer />
  </div>  
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

@Component({
  name: 'app',
  components: { Navbar, Footer }
})
export default class Application extends Vue {}
</script>
<style lang='scss'>
@import './assets/tailwind.css';
</style>
