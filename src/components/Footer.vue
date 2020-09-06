<template>
  <div class='mx-auto mt-20 mb-3'>
    <!-- DO NOT REMOVE THIS PART -->
    <p class='text-greyple'>Copyright &copy; {{ getYear() }} | Made by <a href='https://augu.dev'>August (Chris)</a></p>
    <p class='text-center text-blue-700'>
      <router-link to='/privacy'>Privacy Policy</router-link> | <router-link to='/terms'>Terms of Service</router-link>
    </p>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

interface Footer {
  date: Date;
}

@Component({
  name: 'footer',
  data() {
    return {
      date: new Date()
    };
  },
  computed: {
    getYear() {
      return this.$data.date.getFullYear() === 2020 ? this.$data.date.getFullYear() : `2020-${this.$data.date.getFullYear()}`;
    }
  }
})
export default class FooterComponent extends Vue {}
</script>
