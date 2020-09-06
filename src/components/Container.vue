<template>
  <section class='container section-mod mx-auto p-8 mt-8 mb-8'>
    <slot />
  </section>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'container'
})
export default class ContainerComponent extends Vue {}
</script>
<style lang='scss' scoped>
.section-mod {
  border-radius: 1.5rem;
  background: #333;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.50);
  border: 0;
}
</style>
