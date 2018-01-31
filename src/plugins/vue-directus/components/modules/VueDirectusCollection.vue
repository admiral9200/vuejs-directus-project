<template>
  <div class="vue-directus-collection">
    <div class="vue-directus-collection__slot">
      <slot />
    </div>
    <div class="vue-directus-collection__controls">
      <button @click="addItem(table)">+</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'VueDirectusCollection',

  props: {
    table: {
      type: String,
      default: ''
    }
  },

  methods: {
    ...mapActions({
      addItem: 'VueDirectus/items/add'
    })
  }
}
</script>

<style>
.vue-directus-collection {
  position: relative;
}

.vue-directus-collection__controls {
  padding-top: 20px;
  position: absolute;
  text-align: center;
  width: 100%;
}
</style>
