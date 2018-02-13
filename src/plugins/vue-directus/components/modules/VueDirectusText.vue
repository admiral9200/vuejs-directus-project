<template>
  <div class="vue-directus-text">
    <quill-editor :content="text" :options="options" @change="change" />
  </div>
</template>

<script>
import Vue from 'vue'
import VueQuillEditor, { Quill } from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'
import { ImageDrop } from 'quill-image-drop-module'

const Clipboard = Quill.import('modules/clipboard')
const Delta = Quill.import('delta')

class PlainClipboard extends Clipboard {
  convert(html = null) {
    if (typeof html === 'string') {
      this.container.innerHTML = html
    }

    let text = this.container.innerText.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '')

    this.container.innerHTML = ''
    return new Delta().insert(text)
  }
}

Quill.register('modules/clipboard', PlainClipboard)
Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/imageDrop', ImageDrop)

Vue.use(VueQuillEditor)

export default {
  name: 'VueDirectusText',

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

  methods: {
    change({ html, text }) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      this.timeout = setTimeout(() => {
        console.log(html, text)
      }, 500)
    }
  }
}
</script>

<style lang="postcss">
@import '../../assets/css/lib/quill.core.css';
@import '../../assets/css/lib/quill.theme.css';

.vue-directus-text {
  position: relative;
}
</style>
