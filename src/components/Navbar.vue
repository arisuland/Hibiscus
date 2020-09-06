<template>
  <nav class='flex items-center justify-between flex-wrap bg-blackish p-6 shade'>
    <div class='flex items-center flex-shrink-0 text-white mr-6'>
      <router-link class='font-semibold text-xxl tracking-tight' to='/'>Monori</router-link>
    </div>
    <div class='block lg:hidden'>
      <button 
        id='menu-toggle' 
        class='flex items-center px-3 py-2 border rounded text-blackish border-darkish hover:text-white hover:border-white'
        @click='isVisible = !isVisible'
      >
        Menu
      </button>
    </div>
    <div v-show='isVisible' class='w-full block flex-grow lg:flex lg:items-center lg:w-auto'>
      <div class='text-sm lg:flex-grow'>
        <router-link class='block mt-4 lg:inline-block lg:mt-0 text-grey hover:text-white mr-4' to='/explore'>
          Explore
        </router-link>
      </div>
      <div>
        <!-- TODO: Implement Vuex store -->
        <router-link class='inline-block text-sm px-4 py-2 leading-none border rounded text-grey border-whtie hover:border-transparent hover:text-grayish hover:bg-white mt-4 lg:mt-0' to='/login'>
          Login
        </router-link>
      </div>
    </div>
  </nav>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

interface Footer {
  date: Date;
}

@Component({
  name: 'navbar',
  data() {
    return {
      isVisible: true,
      user: null
    };
  },
  computed: {
    getUser() {
      // todo: this
    }
  }
})
export default class NavbarComponent extends Vue {}
</script>
<style lang='scss' scoped>
.shade {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}
</style>
