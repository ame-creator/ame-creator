<template>
  <div class="json-editor-container">
    <div ref="editor" class="json-editor"></div>
  </div>
</template>

<script>
import '@json-editor/json-editor'

export default {
  props: {
    schema: {
      type: Object,
      default() {
        return {}
      },
    },

    options: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {}
  },

  watch: {
    schema() {
      this.$nextTick(() => {
        this.refresh()
      })
    },

    options() {
      this.$nextTick(() => {
        this.refresh()
      })
    },
  },

  mounted() {
    this.refresh()
  },

  methods: {
    refresh() {
      const editorRef = this.$refs.editor
      if (!editorRef) {
        return
      }

      this.destory()

      const { schema, options } = this
      if (!schema) {
        return
      }

      const editorOptions = {
        theme: 'bootstrap4',
        iconlib: 'fontawesome4',
        disable_array_delete_all_rows: true,
        disable_array_delete_last_row: true,
        keep_oneof_values: false,
        prompt_before_delete: false,
        ajax: true,
        schema,
      }

      if (options) {
        editorOptions.startval = options
      }

      const editor = new window.JSONEditor(editorRef, editorOptions)

      editor.on('change', () => {
        this.$emit('change', editor.getValue())
      })

      this.editor = editor
    },

    destory() {
      if (this.editor) {
        this.editor.destroy()
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
