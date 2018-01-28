<template>
  <div class="vue-directus-app">
    <div class="vue-directus-app__slot">
      <slot />
    </div>
    <div class="vue-directus-app__controls">
      <button @click="save" v-if="status" :disabled="status === 'PUSHING' || status === 'PUSHED'">
        <span v-if="status === 'COMMITED'">
          SAVE
        </span>
        <span v-else-if="status === 'PUSHING'">
          SAVING...
        </span>
        <span v-else-if="status === 'PUSHED'">
          SAVED!
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'VueDirectusApp',

  computed: {
    ...mapGetters({
      status: 'VueDirectus/items/status'
    })
  },

  methods: {
    save() {
      this.$store.dispatch('VueDirectus/items/push')
    }
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
