<template>
  <div class="vue-directus-item" :disabled="busy">
    <div class="vue-directus-item__slot">
      <slot />
    </div>
    <div class="vue-directus-item__controls">
      <button class="vue-directus-item__controls__move">M</button>
      <button class="vue-directus-item__controls__remove" @click="removeItem({ table, id })">X</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'VueDirectusItem',

  props: {
    table: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: undefined
    }
  },

  computed: {
    ...mapGetters({
      busy: 'VueDirectus/items/busy'
    })
  },

  methods: {
    ...mapActions({
      removeItem: 'VueDirectus/items/remove'
    })
  }
}
</script>

<style>
.vue-directus-item {
  position: relative;
}

.vue-directus-item[disabled] {
  opacity: 0.5;
  pointer-events: none;
}

.vue-directus-item__controls {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
