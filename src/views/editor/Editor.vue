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
          <v-btn text color="blue dark-4">添加组件</v-btn>
        </v-card-actions>
        <div
          v-if="componentList && componentList.length > 0"
          class="component-list"
        >
          <v-card
            v-for="item in componentList"
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
  </div>
</template>

<script>
import { getPage } from '@/api'

export default {
  data() {
    return {
      iframeUrl: 'https://jituancaiyun.com/d/',
      pageDetail: {},
      error: {
        show: false,
        message: '',
      },
    }
  },

  computed: {
    componentList() {
      const { componentList, componentDetails } = this.pageDetail
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

  mounted() {
    const { pageId } = this.$route.params
    if (pageId) {
      getPage(pageId)
        .then(data => {
          console.log('data:', data)
          this.clearError()
          this.pageDetail = data
        })
        .catch(error => {
          this.error = {
            show: true,
            message: error.message,
          }
        })
    }
  },

  methods: {
    clearError() {
      this.error = {
        show: false,
        message: '',
      }
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

.options-card {
  flex: 1;
}
</style>
