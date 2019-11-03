<template>
  <div class="page--dash">
    <v-container grid-list-xl fluid> </v-container>
  </div>
</template>

<script>
import API from '@/api'

import Material from 'vuetify/es5/util/colors'

export default {
  data: () => ({
    color: Material,
    selectedTab: 'tab-1',
  }),
  computed: {
    activity() {
      return API.getActivity()
    },
    posts() {
      return API.getPost(3)
    },
    siteTrafficData() {
      return API.getMonthVisit
    },
    locationData() {
      return API.getLocation
    },
  },
}
</script>
