<template>
  <div class="vue-directus-app" :data-busy="busy">
    <div class="vue-directus-app__slot">
      <slot />
    </div>
    <div class="vue-directus-app__controls">
      <button @click="save" :disabled="busy" v-if="diff.length > 0">SAVE</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'VueDirectusApp',

  computed: {
    ...mapGetters({
      busy: 'VueDirectus/items/busy',
      diff: 'VueDirectus/items/diff'
    })
  },

  methods: {
    ...mapActions({
      save: 'VueDirectus/items/save'
    })
  }
}
</script>

<style>
.vue-directus-app {
  position: relative;
}

.vue-directus-app[data-busy='true'] {
  opacity: 0.5;
  pointer-events: none;
}

.vue-directus-app__controls {
  bottom: 20px;
  position: fixed;
  right: 20px;
}
</style>
