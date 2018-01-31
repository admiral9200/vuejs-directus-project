<template>
  <div id="app">
    <vue-directus-app>
      <h1>Vue Directus Collection `projects`</h1>
      <vue-directus-collection>
        <vue-directus-item v-for="project in itemsByTable('projects')" :key="project.id">
          <h2>{{ project.name }}</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam quis molestie ipsum.</p>
        </vue-directus-item>
      </vue-directus-collection>
    </vue-directus-app>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',

  computed: {
    ...mapGetters({
      itemsByTable: 'VueDirectus/items/itemsByTable'
    })
  },

  created() {
    this.fetch('projects')
  },

  methods: {
    ...mapActions({
      fetch: 'VueDirectus/items/fetch'
    })
  }
}
</script>

<style>
@import 'reset-css/reset.css';
</style>
