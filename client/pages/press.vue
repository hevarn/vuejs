<template lang="pug">
  v-container.logo(fluid)
    v-row.imgPress
    v-container
      v-row
        v-col
          v-card(outlined dense).mt-3
            v-card-title.pa-2
              h2 Ils parlent de nous
    v-container(v-if="loading")
      v-row(justify='center').backgroundTransparent
        v-col(v-for="p in 8" :key="p").col-10.col-sm-5.col-md-4.col-lg-3.col-xl-2
          v-skeleton-loader(type='card')
    v-row.imgTree(v-if="!loading" :style="specialSize.background")
      v-container
        v-row(justify="center" align="center")
          v-col(v-for="press in data" :key="press.id" justify="center" align="center").col-10.col-sm-5.col-md-4.col-lg-3.col-xl-2
            v-card(hover width="275" outlined shaped).elevation-10
              v-card-title.title.pb-0 {{ press.source }}
              v-card-title.subtitle-1.font-italic.pt-0 {{ press.date }}
              v-img(height="110" :src='press.img')
              v-card-text.sizeText {{ press.title }}
              v-card-actions.mt-5
                v-spacer
                v-btn(@click="goToSite(press.link)" color="primary") en savoir plus
                v-spacer
              v-card-actions
                v-img(src='./traitperma.png' width="80%")
</template>

<script>
import { pressService } from '@/api'

export default {
  layout: 'visitor',
  data () {
    return {
      loading: false,
      data: ''
    }
  },
  computed: {
    specialSize () {
      let result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.height = '300'
          result.width = '300'
          result.background = '0%'
          break
        case 'sm':
          result.height = '300'
          result.width = '300'
          result.background = '85%'
          break
        case 'md':
          result.height = '350'
          result.width = '350'
          result.background = '45%'
          break
        case 'lg':
          result.height = '350'
          result.width = '350'
          result.background = '30%'
          break
        case 'xl':
          result.height = '350'
          result.width = '350'
          result.background = '12%'
          break
        default:
          result = '5em'
          result.background = '30%'
          break
      }
      return {
        xSmall: `font-size: ${result.xSmall}`,
        small: `font-size: ${result.small}`,
        medium: `font-size: ${result.medium}`,
        large: `font-size: ${result.large}`,
        xLarge: `font-size: ${result.xLarge}`,
        minus: `font-size: ${result.minus}`,
        plus: `font-size: ${result.plus}`,
        background: `background-size: ${result.background}`,
        isLogo: result.isLogo,
        picture: result.picture,
        button: result.button,
        screen: result.screen
      }
    }
  },
  async mounted () {
    await this.fetchPress()
  },
  methods: {
    goToSite (url) {
      window.open(url, '_blank')
    },
    async fetchPress () {
      try {
        this.loading = true
        const { data } = await pressService.find()
        this.data = data
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
        this.data.forEach(press => {
          press.date = new Date(press.date)
            .toLocaleDateString('fr-FR', options)
            .substring(5)
        })
        this.loading = false
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    }
  }
}
</script>

<style scoped>
.sizeText {
  height: 100px;
}

.backgroundTransparent {
  background: transparent;
}

.imgTree {
  background: url('/arbreFruitier.png') no-repeat right;
}

.imgPress {
  background: url('/home_koncept.jpg') no-repeat center;
  background-size: 100% 135%;
  height: 500px;
  margin-top: -200px;
  align-items: center;
}

@media screen and (max-width: 458px) {
  .imgPress {
    background: url('/home_koncept.jpg') no-repeat center;
    background-size: 100% 135%;
    height: 230px;
    margin-top: 0px;
    align-items: center;
  }
}
</style>
