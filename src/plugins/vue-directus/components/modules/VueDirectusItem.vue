<template>
  <div class="vue-directus-item">
    <div class="vue-directus-item__slot">
      <slot />
    </div>
    <div class="vue-directus-item__controls">
      <button data-drag-handle="true">
        <svg fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </button>
      <button @click="removeItem({ table, id })">
        <svg fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'VueDirectusItem',

  props: {
    id: {
      type: String,
      default: undefined
    },
    table: {
      type: String,
      default: undefined
    }
  },

  methods: {
    ...mapActions({
      removeItem: 'VueDirectus/items/remove'
    })
  }
}
</script>

<style lang="postcss">
.vue-directus-item {
  position: relative;

  &__slot {
    position: relative;
  }

  &__controls {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
