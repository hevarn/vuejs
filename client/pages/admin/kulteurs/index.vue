<template lang="pug">
  v-container(fluid)
    v-card
      v-row(justify="center")
        v-card-title(:style="fontSize.titleSize" @click="display = 0")
          h3 Bienvenue dans votre espace de gestion Kulteur
    v-row
      v-col(cols="12" lg="4")
        v-card(v-for="(theme, index) in menu" hover :key="index")
          v-card-title(@click="() => display = theme.id" :style="fontSize.titleSize2" color="primary")
            h5 {{theme.title}}
      v-col(cols="12" lg="8")
        v-img(src="/logoKnoir.png" v-if="display === 0").logo
        AdmKultCheckDeliveryProviders(@close-window="display = 0" v-if="display === 1")
        AdmKultCheckDeliveryKonsommateur(@close-window="display = 0" v-if="display === 2")
        AdmKultCheckMyReference(@close-window="display = 0" v-if="display === 3")
        AdmKultInventorying(@close-window="display = 0" v-if="display === 4")
</template>

<script>
export default {
  data () {
    return {
      menu: [
        { title: 'Pointer une livraison fournisseur', id: 1 },
        { title: 'Valider une distribution konsommateur', id: 2 },
        { title: 'Administrer mes kultures', id: 3 },
        { title: 'Gestion des stocks AB', id: 4 }
      ],
      display: 0
    }
  },
  computed: {
    fontSize () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.titleSize = '1.2em'
          result.titleSize2 = '1.2em'
          break
        case 'sm':
          result.titleSize = '16px'
          break
        case 'md':
          result.titleSize = '16px'
          break
        case 'lg':
          result.titleSize = '17px'
          break
        case 'xl':
          result.titleSize = '22px'
          break
        default:
          result.titleSize = '16px'
          break
      }
      return {
        titleSize: `font-size: ${result.titleSize}`,
        titleSize2: `font-size: ${result.titleSize2}`
      }
    }
  },
  async mounted () {
    try {
      await this.$store.dispatch('admin/fetchSettings', 3)
    } catch (e) {
      this.$store.commit('notif/sendAlert')
    }
  }
}
</script>

<style scoped>
.logo {
  opacity: 0.5;
}
</style>
