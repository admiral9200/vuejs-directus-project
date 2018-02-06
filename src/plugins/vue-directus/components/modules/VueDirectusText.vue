<template>
  <div class="vue-directus-text">
    <div class="vue-directus-text__slot">
      <div v-html="text" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueDirectusText',

  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
