<template>
  <div class="vue-directus-image">
    vue-directus-image
  </div>
</template>

<script>
import Vue from 'vue'
import VueCroppie from 'vue-croppie'
import imagesLoaded from 'vue-images-loaded'

Vue.use(VueCroppie)

export default {
  name: 'VueDirectusImage',

  directives: {
    imagesLoaded
  }
}
</script>

<style>
.vue-directus-image {
  overflow: hidden;
  position: relative;
}

.vue-directus-image__image img {
  display: block;
  max-width: 100%;
}

.vue-directus-image.is-cropping .vue-directus-image__image {
  display: none;
}

.vue-directus-image .vue-directus-image__cropping {
  display: none;
}

.vue-directus-image.is-cropping .vue-directus-image__cropping {
  display: block;
}

.vue-directus-image__controls {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99;
}

.croppie-container .cr-viewport,
.croppie-container .cr-resizer {
  border: 0;
}

.croppie-container .cr-slider-wrap {
  background: rgba(255, 255, 255, 0.5);
  bottom: 0;
  margin: 0;
  padding: 10px 0;
  position: absolute;
  width: 100%;
  z-index: 9;
}
</style>
