<template>
  <div class="vue-directus-text">
    <div class="vue-directus-text__slot">
      <quill-editor :content="renderedText" :options="options" @change="change($event)" @ready="ready($event)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueDirectusText',

  props: {
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
    ready(quill) {
      this.rawText = quill.container.firstChild.innerHTML
    },
    change({ html, text }) {
      if (html !== this.rawText) {
        console.log('changed')
      } else {
        console.log('unchanged')
      }
    }
  }
}
</script>
