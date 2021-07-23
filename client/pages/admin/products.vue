<template lang="pug">
  v-container(fluid).silver
    AdmPdctProducts
</template>

<script>
export default {
  async mounted () {
    try {
      await this.$store.dispatch('admin/fetchSettings', 3)
    } catch (e) {
      this.$store.commit('notif/sendAlert')
    }
  }
}
</script>

<style lang="scss" scoped>
.silver {
  background-color: $background-color-table;
}
</style>
