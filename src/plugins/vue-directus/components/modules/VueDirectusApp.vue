<template>
  <div class="vue-directus-app">
    <div class="vue-directus-app__slot">
      <slot />
    </div>
    <div class="vue-directus-app__controls">
      vue-directus-app__controls
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueDirectusApp'
}
</script>

<style>
.vue-directus-app__controls {
  bottom: 20px;
  position: fixed;
  right: 20px;
}
</style>
