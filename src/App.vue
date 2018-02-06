<template>
  <div id="app">
    <vue-directus-app>
      <h1>Vue Directus Collection `projects`</h1>
      <vue-directus-collection table="projects" :sortable="true">
        <vue-directus-item v-for="project in items('projects')" table="projects" :id="project._id" :key="project._id">
          <vue-directus-text :html="true" :text="project.name" />
          <vue-directus-text :html="true" :text="project.description" />
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
