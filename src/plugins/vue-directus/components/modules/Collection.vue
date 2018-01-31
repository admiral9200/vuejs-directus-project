<template>
  <div class="vue-directus-collection">
    <div class="vue-directus-collection__slot" v-dragula="items(table)" :bag="table">
      <slot />
    </div>
    <div class="vue-directus-collection__controls">
      <button @click="add">+</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  name: 'VueDirectusCollection',

  props: {
    table: {
      type: String,
      default: ''
    },
    payload: {
      type: Object,
      default: () => {}
    },
    sortable: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      items: 'VueDirectus/items/items'
    })
  },

  created() {
    Vue.vueDragula.options('projects', {
      moves: (el, container, handle) =>
        this.$props.sortable && handle.classList.contains('dragula-handle')
    })

    Vue.vueDragula.eventBus.$on('dropModel', args => {
      this.$store.dispatch('VueDirectus/items/sort', {
        table: this.$props.table
      })
    })
  },

  methods: {
    add() {
      this.$store.dispatch('VueDirectus/items/add', {
        table: this.$props.table,
        payload: this.$props.payload
      })
    }
  }
}
</script>

<style>
.vue-directus-collection {
  position: relative;
}

.vue-directus-collection__controls {
  bottom: -50px;
  position: absolute;
  text-align: center;
  width: 100%;
}
</style>
