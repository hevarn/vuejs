<template lang="pug">
  v-app#app
    v-main
      navBar
      nuxt
      snackBar
    Footer
    v-fab-transition
      v-btn(
        fab
        fixed
        bottom
        right
        aria-label="btn_go_top"
        color='green white--text'
        @click="$vuetify.goTo(1, {duration: 2000})"
        v-scroll="onScroll"
        v-show="fab"
      )
        v-icon $mdi-menu-up
</template>

<script>
import NavBar from '@/components/navBar'
import '@/assets/fonts/AvenirNext.css'
import snackBar from '@/components/admin/utils/snackBar'
import Footer from '@/components/visitor/footer'
import app from '@/api'

export default {
  components: { NavBar, snackBar, Footer },
  middleware: ['authenticated'],
  data () {
    return {
      fab: false
    }
  },
  mounted () {
    app.hooks({
      error: {
        all: [
          context => {
            if (
              this.$store.state.auth.user &&
              context.error &&
              context.error.code === 401
            ) {
              this.$router.push('/')
              this.$store.commit('notif/sendInfo', 'Session Expirée, veuillez vous reconnecter')
              setTimeout(() => {
                this.$store.dispatch('auth/logout')
              }, 200)
            }
          }
        ]
      }
    })
    this.onScroll()
  },
  methods: {
    onScroll () {
      const top = window.pageYOffset || document.documentElement.offsetTop || 0
      this.fab = top > 250
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: AvenirNext, sans-serif;
}
</style>
