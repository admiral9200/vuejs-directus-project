<template>
  <div class="vue-directus-item">
    <div class="vue-directus-item__slot">
      <slot />
    </div>
    <div class="vue-directus-item__controls">
      <button>M</button>
      <button>X</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueDirectusItem'
}
</script>

<style>
.vue-directus-item {
  position: relative;
}

.vue-directus-item__controls {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
