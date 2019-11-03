<template>
  <v-app-bar color="primary" dark app>
    <v-app-bar-nav-icon @click="handleDrawerToggle" />
    <v-spacer />
    <v-toolbar-items>
      <v-btn icon href="https://github.com/tookit/vue-material-admin">
        <v-icon class="fa-2x">fa-github</v-icon>
      </v-btn>
      <v-btn icon @click="handleFullScreen()">
        <v-icon>fullscreen</v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>
<script>
import Util from '@/util'
export default {
  name: 'AppToolbar',
  data() {
    return {
      items: [
        {
          icon: 'account_circle',
          href: '#',
          title: 'Profile',
          click: this.handleProfile,
        },
        {
          icon: 'settings',
          href: '#',
          title: 'Settings',
          click: this.handleSetting,
        },
        {
          icon: 'fullscreen_exit',
          href: '#',
          title: 'Logout',
          click: this.handleLogut,
        },
      ],
    }
  },
  computed: {
    toolbarColor() {
      return this.$vuetify.options.extra.mainNav
    },
  },
  methods: {
    handleDrawerToggle() {
      this.$emit('side-icon-click')
    },
    handleFullScreen() {
      Util.toggleFullScreen()
    },
    handleLogut() {
      this.$router.push('/auth/login')
    },
    handleSetting() {},
    handleProfile() {},
  },
  created() {},
}
</script>

<style lang="sass" scoped></style>
