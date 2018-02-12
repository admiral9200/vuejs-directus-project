<template>
  <div class="vue-directus-image">
    <div class="vue-directus-image__image" v-images-loaded="imageLoaded">
      <img :src="src" ref="img">
      <vue-croppie ref="croppie" :boundary="dimensions" :viewport="{ width: '100%', height: '100%' }" :enable-resize="false" :mouse-wheel-zoom="false" />
    </div>
    <div class="vue-directus-image__controls">
      <button @click="save">CROP</button>
    </div>
  </div>
</template>

<script>
// FIXME: when clonging an item we must base64 the cloned img first
import Vue from 'vue'
import VueCroppie from 'vue-croppie'
import imagesLoaded from 'vue-images-loaded'
import { mapGetters, mapActions } from 'vuex'

Vue.use(VueCroppie)

export default {
  name: 'VueDirectusImage',

  directives: {
    imagesLoaded
  },

  props: {
    name: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      hasLoaded: false,
      dimensions: {}
    }
  },

  computed: {
    ...mapGetters({
      image: 'VueDirectus/items/image'
    }),
    src() {
      return this.image(this.$parent.table, this.$parent.id, this.name)
    }
  },

  methods: {
    ...mapActions({
      edit: 'VueDirectus/items/edit'
    }),

    imageLoaded() {
      // Dimension are set on first load only
      if (!this.hasLoaded) {
        this.dimensions = {
          height: this.$refs.img.clientHeight,
          width: '100%'
        }
      }

      this.$refs.croppie.bind({ url: this.src })
      this.hasLoaded = true
    },

    async crop() {
      return this.$refs.croppie.result({ type: 'base64' })
    },

    async save() {
      const output = await this.crop()

      this.edit({
        table: this.$parent.table,
        id: this.$parent.id,
        column: 'image',
        value: {
          name: 'image.png',
          type: 'image/png',
          data: output
        }
      })
    }
  }
}
</script>

<style>
.vue-directus-image {
  overflow: hidden;
  position: relative;
}

.vue-directus-image__image {
  position: relative;
}

.vue-directus-image__image img {
  display: block;
  width: 100%;
}

.vue-directus-image__image .croppie-container {
  position: absolute;
  top: 0;
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
  box-shadow: none;
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
