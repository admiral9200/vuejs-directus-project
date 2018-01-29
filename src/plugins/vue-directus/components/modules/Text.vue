<template>
  <div class="vue-directus-text">
    <quill-editor :content="renderedContent" :options="options" @change="changed($event)" @ready="ready($event)" />
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
      renderedContent: '',
      options: {
        theme: 'bubble',
        placeholder: 'Enter some text...',
        modules: {
          imageResize: {
            modules: ['Resize', 'DisplaySize', 'Toolbar']
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

  created() {
    this.renderedContent = this.setImagePaths(this.content)
  },

  methods: {
    ready(quill) {
      this.initialContent = quill.container.firstChild.innerHTML
    },
    changed({ html, text }) {
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
