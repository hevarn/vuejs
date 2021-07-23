<template lang="pug">
  v-container(fluid style="background-color: #316827")
    v-row.mt-md-6
      v-col.col-6.col-sm-6.col-md-2.offset-md-1
        v-row(:style="fontSize.link")
          v-col.col-12.col-sm-12.col-md-12
            strong
              p.text-sm-center.text-md-left.text-center(style="color:white") NOS SERVICES
          v-col.col-12.col-sm-12.col-md-12.text-sm-center.text-md-left.text-center
            a.link(href="/" ) Pour les particuliers <br>
            a.link(@click="goToServices()") Pour les entreprises,<br>promoteurs, <br>collectivités...
      v-col.col-6.col-sm-6.col-md-2.offset-md-1
        v-row(:style="fontSize.link")
          v-col.col-12.col-sm-12.col-md-12
            strong
              p.text-sm-center.text-md-left.text-center(:style="fontSize.link" style="color:white") RESSOURCES
          v-col.col-12.col-sm-12.col-md-12.text-sm-center.text-md-left.text-center
            a.link(href="/cgv" :style="fontSize.link") CGV-CGU <br>
            a.link(href="/press" :style="fontSize.link") Vu dans la presse
      v-col.col-6.col-sm-6.col-md-2.offset-md-1
        v-row(:style="fontSize.link")
          v-col.col-12.col-sm-12.col-md-12
            strong
              p.text-sm-center.text-md-left.text-center(style="color:white") PARLONS-NOUS :)
          v-col.col-12.col-sm-12.col-md-12.text-sm-center.text-md-left.text-center
            a.link(href="/contact") N'hésitez pas à nous contacter <br> pour en savoir davantage
      v-col.col-6.col-sm-6.col-md-2
        v-row.pa-0(align="center" justify="center")
          div.mt-2
            v-col.col-12.col-sm-12.pt-0.pb-2.ma-1.text-center
              v-btn(icon large color='#3b5998' href="https://www.facebook.com/kanopeekoncept/" target="_blank" ).white.mr-3
                v-icon $mdi-facebook
              v-btn(icon large color='#00acee' href="https://twitter.com/kanopeekoncept?lang=fr" target="_blank" ).white
                v-icon $mdi-twitter
            v-col.col-sm-12.pa-0.ma-1.text-center
              v-btn(icon large color='#0e76a8' href="https://www.linkedin.com/company/kanop%C3%A9e-koncept/" target="_blank" ).white.mr-3
                v-icon $mdi-linkedin
              v-btn(icon color='black' large href="https://www.instagram.com/kanopeekoncept/?hl=fr" target="_blank" ).white
                v-icon $mdi-instagram
    v-row(justify="center")
      div.line
    v-row
      v-col.col-md-3.offset-md-8.copyright(align="end" :style="fontSize.copyright" style="color:white")
        strong
          p.text-center.text-sm-right © 2020 KanopeeKoncept. All Rights Reserved
          p.text-center.text-sm-right Powered By AKEROS.
</template>

<script>
export default {
  computed: {
    fontSize () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.link = '18px'
          result.copyright = '14px'
          break
        case 'sm':
          result.link = '18px'
          result.copyright = '14px'
          break
        case 'md':
          result.link = '14px'
          result.copyright = '12px'
          break
        case 'lg':
          result.link = '14px'
          result.copyright = '12px'
          break
        case 'xl':
          result.link = '18px'
          result.copyright = '16px'
          break
        default:
          result.link = '14px'
          result.copyright = '12px'
          break
      }
      return {
        link: `font-size: ${result.link}`,
        copyright: `font-size: ${result.copyright}`
      }
    }
  },
  methods: {
    goToServices () {
      this.$router.push('/')
      this.$store.commit('visitorNavbar/clickButton')
      this.$vuetify.goTo(0, { duration: 1500 })
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
.v-application a {
  color: darkgray;
}

.line {
  border: 0.5px solid darkgray;
  border-radius: 20px;
  width: 82%;
  margin: 0 auto;
}
</style>
