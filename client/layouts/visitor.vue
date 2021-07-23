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
import NavBar from '@/components/visitor/navbar/navbar'
import '@/assets/fonts/AvenirNext.css'
import snackBar from '@/components/admin/utils/snackBar'
import Footer from '../components/visitor/footer'

export default {
  components: { NavBar, snackBar, Footer },
  middleware: ['authenticated'],
  data () {
    return {
      fab: false,
      isNavbar: false
    }
  },
  mounted () {
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
