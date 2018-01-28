<template>
  <div class="vue-directus-text">
    <quill-editor :content="content" :options="options" @change="changed($event)" />
  </div>
</template>

<script>
export default {
  name: 'VueDirectusText',

  props: {
    content: {
      type: String,
      default: ''
    },
    column: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      initialContent: '',
      options: {
        theme: 'bubble',
        placeholder: 'Enter some text...',
        modules: {
          clipboard: {
            matchVisual: false
          },
          toolbar: [
            ['bold', 'italic'],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean']
          ]
        }
      }
    }
  },

  mounted() {
    this.initialContent = this.$props.content
  },

  methods: {
    changed({ html }) {
      if (html !== this.initialContent) {
        this.$store.dispatch('VueDirectus/items/edit', {
          table: this.$parent.$props.table,
          id: this.$parent.$props.id,
          column: this.$props.column,
          content: html
        })
        this.$store.dispatch('VueDirectus/items/commit', {
          table: this.$parent.$props.table,
          id: this.$parent.$props.id
        })
      } else {
        this.$store.dispatch('VueDirectus/items/undo', {
          table: this.$parent.$props.table,
          id: this.$parent.$props.id
        })
      }
    }
  }
}
</script>

<style>
.quill-editor {
  min-width: 200px;
}
</style>
