<template>
  <div class="vue-directus-collection">
    <div class="vue-directus-collection__slot">
      <slot />
    </div>
    <div class="vue-directus-collection__controls">
      <button>+</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueDirectusCollection'
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
