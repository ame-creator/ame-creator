<template>
  <v-app :dark="true">
    <router-view></router-view>
    <!-- global snackbar -->
    <v-snackbar
      :timeout="3000"
      bottom
      right
      :color="snackbar.color"
      v-model="snackbar.show"
    >
      {{ snackbar.text }}
      <v-btn dark text @click.native="snackbar.show = false" icon>
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      rightDrawer: false,
      snackbar: {
        show: false,
        text: '',
        color: '',
      },
    }
  },

  mounted() {},
  created() {
    // add app events
  },
}
</script>

<style lang="sass" scoped>
.setting-fab
  top: 50% !important
  right: 0
  border-radius: 0
</style>
