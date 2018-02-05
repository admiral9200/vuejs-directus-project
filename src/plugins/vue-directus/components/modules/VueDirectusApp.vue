<template>
  <div class="vue-directus-app">
    <div class="vue-directus-app__slot">
      <slot />
    </div>
    <div class="vue-directus-app__controls" v-if="diff.length > 0">
      <button>SAVE</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'VueDirectusApp',

  computed: {
    ...mapGetters({
      diff: 'VueDirectus/items/diff'
    })
  }
}
</script>

<style>
.vue-directus-app__controls {
  bottom: 20px;
  position: fixed;
  right: 20px;
}
</style>
