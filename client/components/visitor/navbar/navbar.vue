<template lang="pug">
  v-app-bar.app(
    fixed
    height="60px"
    :color='color'
    :elevation="!this.isMarketPage || !this.activeNavContact ? 0 : 5"
    v-scroll="changeOnScroll"
    dark)
    transition(name="slide-fade")
      v-avatar(v-if="toolbarMode")
        v-img(src='/navLogo.png' contain @click='$router.push("/")' style="cursor: pointer")
    v-spacer
    div.hidden-sm-and-down(v-if="this.activeNavContact")
      v-btn(outlined :color="indicatorColorMenu" @click="goToParticular").mr-2 PARTICULIER
      v-btn(outlined :color="indicatorColorMenu" @click="goToProfessional").mr-2 PROFESSIONNEL
      v-btn(outlined :color="indicatorColorMenu" @click="$router.push('/market')").mr-2 Le Marché
    div.hidden-sm-and-down(v-else)
      v-btn(outlined :color="indicatorColorMenu" @click="$router.push('/')").mr-2 Accueil
      v-btn(v-if="isMarketPage" outlined :color="indicatorColorMenu" @click="isOpenModal = true").mr-2 Atelier
      v-btn(v-if="isMarketPage" outlined :color="indicatorColorMenu" @click="isOpenModal = true").mr-2 Kommunauté
    div.hidden-sm-and-down
      v-btn(v-if="isAuth" :to="redirectUser()" icon :loading='loadingLogin' :disabled='loadingLogin')
        v-icon(:color='indicatorColorMenu' x-large) $mdi-account-circle
      v-btn(v-else color='primary' to="/login") Connexion
    div.hidden-md-and-up
      div.d-flex
        v-btn.mr-2(v-if="isAuth" :to="redirectUser()" icon :loading='loadingLogin' :disabled='loadingLogin')
          v-icon(:color="indicatorColorMenu" x-large ) $mdi-account-circle
        v-btn.mr-2(v-else to="/login" icon)
          v-icon(:color="indicatorColorMenu" x-large) $mdi-login
        v-menu(
          bottom
          origin="center center"
          transition="scale-transition"
          offset-y
        )
          template(v-slot:activator="{ on }")
            v-app-bar-nav-icon(:color="indicatorColorMenu" v-on="on")
              v-icon $mdi-menu
          v-list(v-if="activeNavContact")
            v-list-item( @click="goToParticular" :style="indicatorColorMenu")
              v-list-item-icon
                v-icon(color='accent') $mdi-sprout-outline
              v-list-item-title Particulier
            v-list-item(@click="goToProfessional" :style="indicatorColorMenu")
              v-list-item-icon
                v-icon(color='accent') $mdi-barn
              v-list-item-title Professionnel
            v-list-item(@click="$router.push('/market')" :style="indicatorColorMenu")
              v-list-item-icon
                v-icon(color='accent') $mdi-barn
              v-list-item-title Le Marché
          v-list(v-else)
            v-list-item( @click="$router.push('/')")
              v-list-item-icon
                v-icon(color='accent') $mdi-home
              v-list-item-title Accueil
            v-list-item( @click="isOpenModal = true")
              v-list-item-icon
                v-icon(color='accent') $mdi-home
              v-list-item-title Atelier
            v-list-item( @click="isOpenModal = true")
              v-list-item-icon
                v-icon(color='accent') $mdi-home
              v-list-item-title Kommunauté
    dialogConnect(@close-modal="isOpenModal = false" :isOpenModal="isOpenModal" goTo="des ateliers et de la Kommunauté")
</template>

<script>
import dialogConnect from '@/components/visitor/market/dialogConnect'
export default {
  components: { dialogConnect },
  data () {
    return {
      toolbarMode: true,
      color: 'white',
      activeMenu: true,
      auth: true,
      visitor: false,
      loadingLogin: true,
      isOpenModal: false
    }
  },
  computed: {
    isAuth () {
      return (
        this.$store.state.auth &&
        this.$store.state.auth.user &&
        this.$store.state.auth.user.isVerified
      )
    },
    indicatorColorMenu () {
      if (this.toolbarMode) {
        return '#aecd6b'
      } else {
        return 'white'
      }
    },
    activeNavContact () {
      return this.$route.name === 'index'
    },
    isMarketPage () {
      return this.$route.name === 'market'
    }
  },
  watch: {
    $route () {
      this.toolbarMode = true
      this.color = 'white'
      this.changeOnScroll()
    }
  },
  mounted () {
    this.changeOnScroll()
    setTimeout(() => {
      this.loadingLogin = false
    }, 1000)
  },
  methods: {
    changeOnScroll () {
      if (this.activeNavContact || this.isMarketPage) {
        const top =
          window.pageYOffset ||
          document.documentElement.offsetTop ||
          window.scrollY ||
          0
        if (top < 300) {
          this.color = 'transparent'
          this.toolbarMode = false
        } else {
          this.color = 'white'
          this.toolbarMode = true
        }
      }
    },
    goToProfessional () {
      this.$store.commit('visitorNavbar/clickButton')
      this.$vuetify.goTo(0, { duration: 1500 })
    },
    goToParticular () {
      this.$store.commit('visitorNavbar/clickButtonFalse')
      this.$vuetify.goTo(0, { duration: 1500 })
    },
    redirectUser () {
      return this.$store.state.auth.user.redirectUser
    }
  }
}
</script>

<style lang="scss" scoped>
.app {
  z-index: 5000;
}
</style>
