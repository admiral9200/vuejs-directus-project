<template>
  <div class="vue-directus-collection">
    <div class="vue-directus-collection__slot" v-dragula="items(table)" :bag="table">
      <slot />
    </div>
    <div class="vue-directus-collection__controls">
      <button @click="add(table)">+</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueDragula from 'vue-dragula'
import { mapGetters, mapActions } from 'vuex'

Vue.use(VueDragula)

export default {
  name: 'VueDirectusCollection',

  props: {
    table: {
      type: String,
      default: ''
    },
    sortable: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      items: 'VueDirectus/items/table'
    })
  },

  created() {
    Vue.vueDragula.options(this.table, {
      moves: (el, container, handle) => this.canMove(handle)
    })
    Vue.vueDragula.eventBus.$on('dropModel', () => this.sort(this.table))
  },

  methods: {
    ...mapActions({
      add: 'VueDirectus/items/add',
      sort: 'VueDirectus/items/sort'
    }),
    canMove(handle) {
      return this.sortable && handle.classList.contains('vue-directus-item__controls__move')
    }
  }
}
</script>

<style>
@import 'dragula/dist/dragula.css';

.vue-directus-collection {
  position: relative;
}

.vue-directus-collection__controls {
  padding-top: 20px;
  position: absolute;
  text-align: center;
  width: 100%;
}
</style>
