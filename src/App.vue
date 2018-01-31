<template>
  <div id="app">
    <vue-directus-app>
      <h1>Vue Directus Collection `projects`</h1>
      <vue-directus-collection>
        <vue-directus-item v-for="project in items('projects')" :key="project.id">
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
      settings: 'VueDirectus/settings/all',
      items: 'VueDirectus/items/table'
    })
  },

  created() {
    this.fetchSettings()
    this.fetchItems('projects')
  },

  methods: {
    ...mapActions({
      fetchSettings: 'VueDirectus/settings/fetch',
      fetchItems: 'VueDirectus/items/fetch'
    })
  }
}
</script>

<style>
@import 'reset-css/reset.css';
</style>
