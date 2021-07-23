<template lang="pug">
    v-container.container(fluid v-show="!$vuetify.breakpoint.sm && !$vuetify.breakpoint.xs")
      v-expand-transition
        v-card.elevation-10
          v-card-title(style="justify-content:space-around")
            h1 On travaille ensemble :
          v-row.img_partner
            v-img(v-for="(link,index) in listPartenaire" :key="index" :lazy-src="link" :src="link" width=30 contain)
              template(v-slot:placeholder)
                v-row(class="fill-height ma-0" align="center" justify="center")
                  v-progress-circular(indeterminate color="grey lighten-5")
</template>

<script>
export default {
  data () {
    return {
      listPartenaire: [
        '/logoAdeme.png',
        '/logo-region.png',
        '/logo-AFAUP.png',
        '/logo-airbus.png',
        '/logo-eticoop.png',
        '/logo-frenchtech.png',
        '/logo-odeys.png',
        '/logo-technowest.png'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  top: 60px;
}

.img_partner {
  margin: 0 auto;
  justify-content: space-evenly;
}
</style>
