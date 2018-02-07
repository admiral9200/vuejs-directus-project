<template>
  <div class="vue-directus-image" :class="{ 'is-cropping': isCropping }">
    <div class="vue-directus-image__image" v-images-loaded="initCrop">
      <img ref="image" :src="croppedSrc">
    </div>
    <div class="vue-directus-image__cropping">
      <vue-croppie ref="croppie" :boundary="dimensions" :viewport="{ width: '100%', height: '100%' }" :enable-resize="false" :mouse-wheel-zoom="false" />
    </div>
    <div class="vue-directus-image__controls">
      <div v-if="isCropping">
        <button @click="saveCrop">CROP</button>
        <button @click="hideCrop">HIDE</button>
        <button @click="resetCrop">RESET</button>
        <input type="file" @change="uploadCrop">
      </div>
      <div v-else>
        <button @click="showCrop">SHOW</button>
      </div>
    </div>
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
  },

  props: {
    src: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      isInitialized: false,
      isCropping: false,
      croppedSrc: this.src,
      dimensions: {}
    }
  },

  methods: {
    initCrop() {
      // Dont re-initialize when cropping changes the image
      if (this.isInitialized) {
        return
      }

      this.dimensions = {
        width: this.$refs.image.clientWidth,
        height: this.$refs.image.clientHeight
      }

      this.isInitialized = true
    },

    hideCrop() {
      this.isCropping = false
    },

    showCrop() {
      this.updateCrop()
      this.isCropping = true
    },

    updateCrop() {
      this.$refs.croppie.refresh()
      this.$refs.croppie.bind({ url: this.croppedSrc })
    },

    resetCrop() {
      this.croppedSrc = this.src
      this.isCropping = false
    },

    saveCrop() {
      this.$refs.croppie.result({ type: 'base64' }).then(output => {
        this.croppedSrc = output
        this.isCropping = false
        return true
      })
    },

    uploadCrop($event) {
      const files = $event.target.files || $event.dataTransfer.files
      const reader = new FileReader()

      if (!files.length) {
        return false
      }

      reader.readAsDataURL(files[0])

      reader.onload = e => {
        this.croppedSrc = e.target.result
        this.updateCrop()
      }
    }
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
