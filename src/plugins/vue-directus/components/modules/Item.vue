<template>
  <div class="vue-directus-item" :disabled="status === 'PUSHING' || status === 'PUSHED'">
    <div class="vue-directus-item__slot">
      <slot />
    </div>
    <div class="vue-directus-item__controls">
      <button class="dragula-handle" v-if="$parent.$props.sortable">M</button>
      <button @click="remove">X</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'VueDirectusItem',

  props: {
    table: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: undefined
    }
  },

  computed: {
    ...mapGetters({
      status: 'VueDirectus/items/status'
    })
  },

  methods: {
    remove() {
      this.$store.dispatch('VueDirectus/items/remove', {
        table: this.$props.table,
        id: this.$props.id
      })
    }
  }
}
</script>

<style>
.vue-directus-item {
  display: inline-block;
  position: relative;
}

.vue-directus-item[disabled] {
  opacity: 0.5;
  pointer-events: none;
}

.vue-directus-item__slot {
  display: inline-block;
}

.vue-directus-item__controls {
  position: absolute;
  right: 50px;
  top: 0;
}
</style>
