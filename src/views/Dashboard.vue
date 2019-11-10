<template>
  <div class="page--dash">
    <v-container grid-list-xl fluid> </v-container>
  </div>
</template>

<script>
import Material from 'vuetify/es5/util/colors'

export default {
  data: () => ({
    color: Material,
    selectedTab: 'tab-1',
  }),
}
</script>
