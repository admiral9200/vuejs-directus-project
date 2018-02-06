<template>
  <div class="vue-directus-text">
    <div class="vue-directus-text__slot">
      <quill-editor :content="renderedText" :options="options" @change="change($event)" @ready="ready($event)" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'VueDirectusText',

  props: {
    column: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    html: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      rawText: '',
      renderedText: '',
      options: {
        theme: 'bubble',
        placeholder: 'Enter some text...',
        modules: {
          imageDrop: true,
          imageResize: {
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
          clipboard: {
            matchVisual: false
          },
          toolbar: this.html
            ? [
                [{ header: [1, 2, false] }],
                ['bold', 'italic'],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                ['link', 'image'],
                ['clean']
              ]
            : false
        }
      }
    }
  },

  created() {
    this.renderedText = this.text
  },

  methods: {
    ...mapActions({
      edit: 'VueDirectus/items/edit'
    }),
    ready(quill) {
      this.rawText = quill.container.firstChild.innerHTML
    },
    change({ html, text }) {
      this.edit({
        table: this.$parent.table,
        id: this.$parent.id,
        column: this.column,
        value: this.html ? html : text
      })
    }
  }
}
</script>
