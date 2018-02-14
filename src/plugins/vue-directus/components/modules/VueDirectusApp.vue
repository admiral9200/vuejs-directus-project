<template>
  <div class="vue-directus-app" :data-is-busy="isBusy">
    <div class="vue-directus-app__status">
      <div class="vue-directus-app__status--busy" v-if="isBusy">
        <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="42" height="42" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
          <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
            <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
    </div>
    <div class="vue-directus-app__slot">
      <slot />
    </div>
    <div class="vue-directus-app__controls">
      <button @click="save" v-if="hasDiff">
        <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
        </svg>
      </button>
      <button @click="undo" v-if="hasDiff">
        <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'VueDirectusApp',

  computed: {
    ...mapGetters({
      isBusy: 'VueDirectus/isBusy',
      hasDiff: 'VueDirectus/items/hasDiff'
    })
  },

  methods: {
    ...mapActions({
      undo: 'VueDirectus/undo',
      save: 'VueDirectus/items/save'
    })
  }
}
</script>

<style lang="postcss">
:root {
  --offset: 20px;
}

.vue-directus-app {
  height: 100%;
  position: relative;

  & button {
    cursor: pointer;
    user-select: none;
  }

  &[data-is-busy] {
    opacity: 0.5;
    pointer-events: none;
  }

  &__status {
    position: fixed;
    right: var(--offset);
    top: var(--offset);
  }

  &__slot {
    height: 100%;
    position: relative;
  }

  &__controls {
    bottom: var(--offset);
    position: fixed;
    right: var(--offset);
  }
}
</style>
