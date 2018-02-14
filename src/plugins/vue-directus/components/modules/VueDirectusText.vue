<template>
  <div class="vue-directus-text">
    <vue-editor v-model="content" :id="`${id}_${column}`" :editor-options="options" :custom-modules="modules" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { VueEditor } from 'vue2-editor'
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'

export default {
  name: 'VueDirectusText',

  components: {
    VueEditor
  },

  props: {
    column: {
      type: String,
      default: undefined
    },
    text: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: undefined
    },
    rich: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      timeout: undefined,
      table: this.$parent.table,
      id: this.$parent.id,
      modules: [
        { alias: 'imageDrop', module: ImageDrop },
        { alias: 'imageResize', module: ImageResize }
      ],
      options: {
        theme: 'bubble',
        placeholder: this.placeholder || 'Enter some text...',
        modules: {
          imageDrop: this.rich,
          imageResize: this.rich
            ? {
                modules: ['Resize', 'Toolbar']
              }
            : false,
          clipboard: {
            matchVisual: false
          },
          toolbar: this.rich
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

  computed: {
    content: {
      get: function() {
        return this.text
      },
      set: function(payload) {
        const content = this.rich ? payload : payload.replace(/(<([^>]+)>)/gi, '')

        // Ignore events where content didnt change
        // This happens on page load when first setting the content
        // and when changes are undone via the `undo` function
        if (content === this.text) {
          return
        }

        if (this.timeout) {
          clearTimeout(this.timeout)
        }

        this.timeout = setTimeout(() => {
          this.edit({
            table: this.table,
            id: this.id,
            column: this.column,
            value: content
          })
        }, 500)
      }
    }
  },

  methods: {
    ...mapActions({
      edit: 'VueDirectus/items/edit'
    })
  }
}
</script>

<style lang="postcss">
@import '../../assets/css/lib/quill.theme.css';

.vue-directus-text {
  position: relative;
}
</style>
