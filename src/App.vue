<template>
  <div id="app">
    <vue-directus-app>
      <vue-directus-collection table="projects" :items="itemsByTable('projects')">
        <vue-directus-item v-for="item in itemsByTable('projects')" table="projects" :id="item._id" :key="item._id">
          <vue-directus-text column="name" placeholder="Enter a name..." :text="item.name" />
          <vue-directus-text column="description" :rich="true" placeholder="Enter a description..." :text="item.description" />
          <vue-directus-image column="image" :img="item.image" v-if="item.image" />
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
      itemsByTable: 'VueDirectus/items/byTable'
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
@import 'normalize.css';

* {
  box-sizing: border-box;
}

#app {
  height: 100vh;
  margin: auto;
  padding: 20px 0;
  width: 80vh;
}
</style>
