<template>
  <div class="vue-directus-collection">
    <div class="vue-directus-collection__slot">
      <slot />
    </div>
    <div class="vue-directus-collection__controls">
      <button @click="add">+</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueDirectusCollection',

  props: {
    table: {
      type: String,
      default: ''
    },
    payload: {
      type: Object,
      default: () => {}
    }
  },

  methods: {
    add() {
      this.$store.dispatch('VueDirectus/items/add', {
        table: this.$props.table,
        payload: this.$props.payload
      })
    }
  }
}
</script>

<style>
.vue-directus-collection {
  position: relative;
}

.vue-directus-collection__controls {
  bottom: -50px;
  position: absolute;
  text-align: center;
  width: 100%;
}
</style>
