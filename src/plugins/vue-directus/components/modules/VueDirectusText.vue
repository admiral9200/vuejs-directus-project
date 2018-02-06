<template>
  <div class="vue-directus-text">
    <div class="vue-directus-text__slot">
      <quill-editor :content="text" :options="options" @change="change" />
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
    placeholder: {
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
      timeout: null,
      options: {
        theme: 'bubble',
        placeholder: this.placeholder || 'Enter some text...',
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

  methods: {
    ...mapActions({
      edit: 'VueDirectus/items/edit'
    }),
    change({ html, text }) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      this.timeout = setTimeout(() => {
        this.edit({
          table: this.$parent.table,
          id: this.$parent.id,
          column: this.column,
          value: this.html ? html : text
        })
      }, 250)
    }
  }
}
</script>
