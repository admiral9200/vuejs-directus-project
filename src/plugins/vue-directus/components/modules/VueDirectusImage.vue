<template>
  <div class="vue-directus-image">
    <div class="vue-directus-image__slot">
      <vue-croppie ref="croppie" :mouse-wheel-zoom="false" :viewport="viewport" :boundary="boundary" />
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
    name: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    }
  },

  data() {
    return {
      cropped: null,
      boundary: { width: this.width, height: this.height },
      viewport: { width: this.width - 10, height: this.height - 10 }
    }
  },

  mounted() {
    this.$refs.croppie.bind({
      url: `http://192.168.33.6/storage/uploads/${this.name}`
    })
  }
}
</script>
