<template>
  <div class="vue-directus-collection">
    <div class="vue-directus-collection__slot">
      <slot />
    </div>
    <div class="vue-directus-collection__controls">
      <button @click="addItem(table)">
        <svg fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z" />
        </svg>
      </button>
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
      default: undefined
    }
  },

  methods: {
    ...mapActions({
      addItem: 'VueDirectus/items/add'
    })
  }
}
</script>

<style lang="postcss">
:root {
  --controls-position: -20px;
}

.vue-directus-collection {
  position: relative;

  &__slot {
    position: relative;
  }

  &__controls {
    bottom: var(--controls-position);
    text-align: center;
    position: absolute;
    width: 100%;
  }
}
</style>
