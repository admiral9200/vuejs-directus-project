<template>
  <div id="app">
    <vue-directus-app>
      <section>
        <h1>Settings</h1>
        <p>
          Project name: {{ settings.global.project_name }}
        </p>
      </section>
      <section>
        <h1>Table `projects`</h1>
        <vue-directus-collection table="projects" :sortable="true" :payload="{ name: 'Enter a project name...', description: 'Enter a project description...', status: 1 }">
          <div v-for="project in items('projects')" :key="project.id">
            <vue-directus-item table="projects" :id="project.id">
              <vue-directus-text column="name" :content="project.name" />
              <vue-directus-text column="description" :content="project.description" :html="true" />
            </vue-directus-item>
          </div>
        </vue-directus-collection>
      </section>
    </vue-directus-app>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',

  computed: {
    ...mapGetters({
      settings: 'VueDirectus/settings/directus',
      items: 'VueDirectus/items/items'
    })
  },

  created() {
    this.$store.dispatch('VueDirectus/settings/fetch')
    this.$store.dispatch('VueDirectus/items/fetch', 'projects')
  }
}
</script>
