<template>
  <div class="editor">
    <div class="content">
      <v-card class="preview-card mr-2">
        <v-card-actions>
          <v-btn text color="blue dark-4">预览</v-btn>
        </v-card-actions>
        <div class="preview-outer">
          <div class="preview-inner">
            <iframe
              :src="iframeUrl"
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
          class="component-list"
        >
          <v-card
            v-for="item in localComponentList"
            :key="item._id"
            class="component-card mb-2"
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
          <v-btn text color="blue dark-4">保存并更新预览</v-btn>
        </v-card-actions>
        options
      </v-card>
    </div>
    <v-snackbar v-model="error.show" color="error" top>
      {{ error.message }}
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
import { getPage, getComponents, pageAddComponents } from '@/api'

export default {
  data() {
    return {
      iframeUrl: 'https://jituancaiyun.com/d/',
      pageId: '',
      pageData: {},
      localComponentList: [],
      globalComponents: [],
      error: {
        show: false,
        message: '',
      },
      addModal: {
        show: false,
        selectItem: null,
      },
    }
  },

  computed: {
    // componentList() {
    //   const { componentList, componentDetails } = this.pageData
    //   if (!componentList) {
    //     return []
    //   }

    //   const details = componentDetails || {}
    //   return componentList.map(item => ({
    //     ...item,
    //     detail: details[item.componentId],
    //   }))
    // },

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
    }

    getComponents().then(data => {
      this.globalComponents = data
    })
  },

  methods: {
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
