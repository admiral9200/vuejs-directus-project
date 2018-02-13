<template>
  <div class="vue-directus-app" :data-is-busy="isBusy">
    <slot />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'VueDirectusApp',

  computed: {
    ...mapGetters({
      isBusy: 'VueDirectus/isBusy'
    })
  }
}
</script>

<style lang="postcss">
.vue-directus-app {
  height: 100%;
  position: relative;

  &[data-is-busy] {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
