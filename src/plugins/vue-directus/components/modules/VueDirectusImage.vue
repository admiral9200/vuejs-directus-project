<template>
  <div class="vue-directus-image" v-if="img" :class="{ 'is-cropping': isCropping }">
    <div class="vue-directus-image__img" @click="init">
      <img ref="img" :src="src">
    </div>
    <div class="vue-directus-image__croppie">
      <vue-croppie ref="croppie" :boundary="dimensions" :viewport="dimensions" :enable-resize="false" :mouse-wheel-zoom="false" />
    </div>
    <div class="vue-directus-image__controls">
      <button @click="upload">
        <svg fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
        </svg>
        <input type="file" ref="file" @change="uploaded">
      </button>
      <button @click="save">
        <svg fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8zM7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueCroppie from 'vue-croppie'

Vue.use(VueCroppie)

export default {
  name: 'VueDirectusImage',

  props: {
    img: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      isCropping: false,
      src: this.img ? `http://192.168.33.6/storage/uploads/${this.img.data.name}` : undefined,
      dimensions: {
        height: 'auto',
        width: '100%'
      }
    }
  },

  mounted() {
    if (this.img) {
      this.$refs.img.onload = () => {
        this.dimensions = {
          height: this.$refs.img.clientHeight,
          width: this.$refs.img.clientWidth
        }
      }
    }
  },

  methods: {
    init() {
      this.update()
      this.isCropping = true
    },

    update() {
      this.$refs.croppie.refresh()
      this.$refs.croppie.bind({ url: this.src })
    },

    async save() {
      this.src = await this.$refs.croppie.result({ type: 'base64' })
      this.isCropping = false
    },

    upload() {
      this.$refs.file.click()
    },

    uploaded($event) {
      const files = $event.target.files || $event.dataTransfer.files
      const reader = new FileReader()

      if (!files.length) {
        return
      }

      reader.readAsDataURL(files[0])

      reader.onload = () => {
        this.src = reader.result
        this.update()
      }
    }
  }
}
</script>

<style lang="postcss">
.vue-directus-image {
  position: relative;

  &__croppie,
  &__controls {
    display: none;
  }

  &.is-cropping &__croppie,
  &.is-cropping &__controls {
    display: block;
  }

  &.is-cropping &__img {
    display: none;
  }

  &__img {
    cursor: pointer;
    position: relative;

    img {
      vertical-align: middle;
      width: 100%;
    }
  }

  &__croppie {
    .cr-viewport,
    .cr-resizer {
      border: 0;
      box-shadow: none;
    }

    .cr-slider-wrap {
      background: rgba(255, 255, 255, 0.5);
      bottom: 0;
      margin: 0;
      padding: 10px 0;
      position: absolute;
      width: 100%;
      z-index: 9;
    }
  }

  &__controls {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 99;

    input[type='file'] {
      display: none;
    }
  }
}
</style>
