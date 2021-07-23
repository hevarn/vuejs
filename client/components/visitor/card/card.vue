<template lang="pug">
  v-container(fluid class="ma-0")
    v-row(:style="reverseStyle")
      v-col.col-sm-12.col-md-6(v-show="!$vuetify.breakpoint.xs" align="center" justify="center" align-self="center")
        transition(name="slide-fade")
          v-img.img_card(:src="card.image" :style="fontSize.image" :lazy-src="card.image")
            template(v-slot:placeholder)
              v-row(class="fill-height ma-0" align="center" justify="center")
              v-progress-circular(indeterminate color="grey lighten-5")
      v-col.col-sm-12.col-md-6(align-self="center" justify-content="center")
        v-col.col-md-8.offset-md-2
          h1.text-sm-center.text-md-left(align="start" class='accent--text' :style="fontSize.title") {{ card.title }}
          p.content(v-html="card.content" :style="fontSize.paragraph")
          v-row(align="end")
            v-col(align="center" justify="center" class="ma-0")
              v-btn(v-if="card.link" @click="redirectToInsitutional()" :style="fontSize.button" color='primary') {{card.link}}
              img.mt-2(:src="card.logo" width="100%")

</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    },
    reverseStyle: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    },
    content: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    fontSize () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.title = '34px'
          result.paragraph = '18px'
          result.button = '16px'
          break
        case 'sm':
          result.title = '34px'
          result.paragraph = '18px'
          result.button = '18px'
          result.image = '90vw'
          break
        case 'lg':
          result.title = '26px'
          result.paragraph = '14px'
          result.button = '14px'
          result.image = '50vw'
          break
        case 'xl':
          result.title = '26px'
          result.paragraph = '16px'
          result.button = '14px'
          result.image = '70vw'
          break
        default:
          result.title = '24px'
          result.paragraph = '12px'
          result.button = '12px'
          result.image = '50vw'
          break
      }
      return {
        title: `font-size: ${result.title}`,
        paragraph: `font-size: ${result.paragraph}`,
        button: `font-size: ${result.button}`,
        image: result.image
      }
    }
  },
  mounted () {
    this.fetchUser()
  },
  methods: {
    fetchUser () {
      try {
        if (this.$store.state.auth.user.isVerified) {
          this.auth = false
        }
      } catch (e) {
        this.auth = true
      }
    },
    redirectToInsitutional () {
      if (!this.auth) {
        if (this.card.link === 'Je rejoins la Kommunauté') {
          this.$router.push('/user/community')
        } else if (this.card.link === "M'inscrire à un atelier") {
          this.$router.push('/user/workshops')
        } else if (this.card.link === 'Faire son marché') {
          this.$router.push('/user/items')
        } else {
          this.$store.commit('visitorNavbar/clickBouton')
          this.$vuetify.goTo(0, { duration: 1500 })
        }
      } else {
        if (this.card.link === 'En apprendre davantage') {
          this.$store.commit('visitorNavbar/clickBouton')
          this.$vuetify.goTo(0, { duration: 1500 })
        } else {
          this.$router.push('/login')
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.img_card {
  height: 300px;
}

h1 {
  line-height: 1;
  margin-bottom: 20px;
}

.content {
  ::v-deep .wordSelect {
    color: $dark-green;
    font-weight: bold;
  }
}
</style>
