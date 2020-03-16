<template>
  <div class="editor">
    <div class="content">
      <v-card class="preview-card mr-2">
        <v-card-actions>
          <v-btn text color="blue dark-4" @click="onPagePreview">预览</v-btn>
        </v-card-actions>
        <div class="preview-outer">
          <div class="preview-inner">
            <iframe
              :src="preview.url"
              title="preview"
              frame-border="0"
              :style="{ width: '100%', height: '100%' }"
            />
          </div>
        </div>
      </v-card>
      <v-card class="list-card mr-2">
        <v-card-actions>
          <v-btn text color="blue dark-4" @click="addModal.show = true">
            添加组件
          </v-btn>
        </v-card-actions>
        <div
          v-if="localComponentList && localComponentList.length > 0"
          class="component-list py-1"
        >
          <v-card
            v-for="item in localComponentList"
            :key="item._id"
            class="component-card mb-2"
            @click="onComponentClick(item)"
          >
            <v-img class="align-end" height="80px" src="">
              <v-card-title>{{ item.detail.title }}</v-card-title>
            </v-img>
            <v-card-text class="pa-2">{{ item._id }}</v-card-text>
          </v-card>
        </div>
        <div v-else class="component-add">添加组件</div>
      </v-card>
      <v-card class="options-card">
        <v-card-actions>
          <v-btn text color="blue dark-4" @click="onComponentOptionsSave"
            >保存并更新预览</v-btn
          >
        </v-card-actions>
        <JsonEditor
          :schema="editor.schemaData && editor.schemaData.schema"
          :options="editor.schemaData && editor.schemaData.options"
          @change="onEditorChange"
        />
      </v-card>
    </div>
    <v-snackbar v-model="error.show" color="error" top>
      {{ error.message }}
    </v-snackbar>
    <v-snackbar v-model="success.show" color="success" top>
      {{ success.message }}
    </v-snackbar>
    <v-dialog v-model="addModal.show" width="800">
      <v-card>
        <v-card-title>添加组件</v-card-title>
        <v-container fluid>
          <v-row dense class="px-2">
            <v-col v-for="item in computedComponents" :key="item._id" cols="4">
              <v-card
                class="add-component-card"
                hover
                :dark="item.selected"
                :outlined="item.selected"
                @click="addComponentSelect(item)"
              >
                <v-img class="align-end" height="100px" src="">
                  <v-card-title>{{ item.title }}</v-card-title>
                </v-img>
                <v-card-subtitle>{{ item.description }}</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" @click="addModal.show = false">取消</v-btn>
          <v-btn color="primary" @click="addComponentOk">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  getPage,
  getComponents,
  pageAddComponents,
  getComponentSchema,
  previewPage,
  updateComponentData,
} from '@/api'

import JsonEditor from '@/components/JsonEditor'

export default {
  components: {
    JsonEditor,
  },

  data() {
    return {
      pageId: '',
      pageData: {},

      localComponentList: [],
      globalComponents: [],

      error: {
        show: false,
        message: '',
      },
      success: {
        show: false,
        message: '',
      },

      addModal: {
        show: false,
        selectItem: null,
      },

      preview: {
        loading: false,
        url: '',
      },

      editor: {
        loading: false,
        schemaData: {
          schema: null,
          options: null,
        },
        localOptions: null,
      },

      activeComponent: null,
    }
  },

  computed: {
    computedComponents() {
      const { selectItem } = this.addModal

      return this.globalComponents.map(item => ({
        ...item,
        selected: selectItem && selectItem._id === item._id,
      }))
    },
  },

  watch: {
    'addModal.show': function(val) {
      if (!val) {
        this.addModal.selectItem = null
      }
    },
  },

  mounted() {
    const { pageId } = this.$route.params
    if (pageId) {
      this.pageId = pageId
      this.initPage(pageId)
      this.$nextTick(() => {
        this.onPagePreview()
      })
    }

    getComponents().then(data => {
      this.globalComponents = data
    })
  },

  methods: {
    addComponentSelect(selectItem) {
      this.addModal.selectItem = selectItem
    },

    addComponentOk() {
      const { selectItem } = this.addModal

      if (!selectItem) {
        return
      }

      const addParams = {
        pageId: this.pageId,
        addComponents: [
          {
            componentId: selectItem._id,
            version: selectItem.version,
          },
        ],
      }

      pageAddComponents(addParams)
        .then(data => {
          this.addModal.show = false
          this.initPage()
        })
        .catch(error => {
          this.addModal.show = false
        })
    },

    onComponentClick(item) {
      this.activeComponent = item

      const params = {
        name: item.detail.name,
        version: this.pageData.componentMap[item.componentId].version,
      }

      this.getComponentSchema(params)
    },

    onPagePreview() {
      const { pageId } = this
      if (!pageId) {
        return
      }

      this.preview.loading = true
      previewPage(pageId)
        .then(data => {
          this.preview.url = data.url || ''
        })
        .catch(error => {
          this.error = {
            show: true,
            message: error.message,
          }
        })
        .finally(() => {
          this.preview.loading = false
        })
    },

    onEditorChange(options) {
      this.editor.localOptions = options
    },

    onComponentOptionsSave() {
      const { pageId, activeComponent, editor } = this
      if (!pageId || !activeComponent) {
        return
      }

      updateComponentData({
        pageId,
        componentListId: activeComponent._id,
        options: editor.localOptions,
      }).then(() => {
        this.success = {
          show: true,
          message: '组件数据更新成功。',
        }

        this.initPage(pageId)

        this.onPagePreview()
      })
    },

    clearError() {
      this.error = {
        show: false,
        message: '',
      }
    },

    initPage(pageId) {
      const localPageId = pageId || this.pageId

      getPage(localPageId)
        .then(data => {
          this.clearError()
          this.pageData = data
          this.initLocalComponentList(data)
        })
        .catch(error => {
          this.error = {
            show: true,
            message: error.message,
          }
        })
    },

    initLocalComponentList(pageData) {
      const { componentList, componentDetails } = pageData

      this.localComponentList = this.getNormalizedComponentList({
        componentList,
        componentDetails,
      })
    },

    getNormalizedComponentList({ componentList, componentDetails }) {
      if (!componentList) {
        return []
      }

      const details = componentDetails || {}
      return componentList.map(item => ({
        ...item,
        detail: details[item.componentId],
      }))
    },

    getComponentSchema({ name, version }) {
      this.editor.loading = true

      const { activeComponent } = this

      getComponentSchema({
        name,
        version,
      })
        .then(data => {
          const schemaData = {
            schema: data.schema,
            options: data.options,
          }
          if (activeComponent && activeComponent.options) {
            schemaData.options = activeComponent.options
          }
          this.editor.schemaData = schemaData
        })
        .catch(error => {
          this.error = {
            show: true,
            message: error.message,
          }
        })
        .finally(() => {
          this.editor.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.editor {
  height: 100%;
}

.content {
  display: flex;
  padding: 16px 30px;
  background: #f0f2f5;
}

.preview-card {
  .preview-outer {
    width: calc(375px * 0.8);
    height: calc(667px * 0.8);
  }

  .preview-inner {
    width: 375px;
    height: 667px;
    transform: scale(0.8);
    transform-origin: 0 0;
  }
}

.list-card {
  min-width: 200px;
}

.options-card {
  flex: 1;
}
</style>
