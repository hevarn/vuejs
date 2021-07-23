<template lang="pug">
div
  v-layout.backgroundImg(:style="fontSize.heightBackground")
    v-row.mt-12.md-6.ma-0
      v-col.mb-6(:style="fontSize.marginTop")
        v-card.mt-12.mx-auto(
            :style="fontSize.maxWidth"
            outlined)
          v-list-item(three-line)
            v-list-item-content
              v-list-item-title.headline.mb-1 Retrouvez votre compte
              v-list-item-subtitle
                v-form(
                  ref="form"
                  v-model="valid"
                  lazy-validation)
                  p Veuillez saisir votre adresse e-mail pour rechercher votre compte.
                  v-text-field(
                      outline
                      v-model="register.email"
                      :rules="register.emailRules"
                      label="E-mail"
                      type="text"
                      v-on:keyup.enter="userVerify"
                      required)
              v-row.mx-auto
                v-col(align="center")
                  v-btn.mx-auto(
                      :loading="loading"
                      :disabled="!valid"
                      color="success"
                      @click="userVerify()") Recherche
</template>
<script>
import { authManagementService } from '@/api'

export default {
  layout: 'visitor',
  data () {
    return {
      loading: false,
      valid: true,
      activeNavBar: false,
      register: {
        email: '',
        emailRules: [
          v => !!v || "L'adresse email est requise",
          v => /.+@.+\..+/.test(v) || "L'adresse email doit être valide"
        ]
      }
    }
  },
  head () {
    return {
      title: 'Forgot',
      meta: [
        { hid: 'description', name: 'description', content: 'Forgot Page ' },
        { hid: 'keywords', name: 'keywords', content: 'forgot' }
      ]
    }
  },
  computed: {
    fontSize () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.heightBackground = '581px'
          result.maxWidth = '287px'
          result.marginTop = '74px'
          break
        case 'sm':
          result.heightBackground = '581px'
          result.maxWidth = '344px'
          result.marginTop = '74px'
          break
        case 'md':
          result.heightBackground = '681px'
          result.maxWidth = '344px'
          result.marginTop = '114px'
          break
        default:
          result.heightBackground = '681px'
          result.maxWidth = '344px'
          result.marginTop = '114px'
          break
      }
      return {
        heightBackground: `height: ${result.heightBackground}`,
        maxWidth: `max-width: ${result.maxWidth}`,
        marginTop: `margin-top: ${result.marginTop}`
      }
    }
  },
  methods: {
    async userVerify () {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const email = this.register.email
          await authManagementService.create({
            action: 'sendResetPwd',
            value: { email }
          })
          this.$store.commit('notif/sendInfo', "Pour changer votre mot de passe, veuillez cliquer sur le lien inclus dans l'email.")
          this.loading = false
        } catch (e) {
          // gerer les erreurs pb de token par exemple
          this.loading = false
          this.$store.commit('notif/sendAlert', "L'adresse email que vous avez saisie n'a pas été trouvé. Vérifiez votre adresse e-mail")
        }
      }
    }
  }
}
</script>
<style scoped>
.backgroundImg {
  background-image: url('/register_login_image.jpg');
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover; /* Resize the background image to cover the entire container */
}

.v-card:not(.v-sheet--tile):not(.v-card--shaped) {
  border-radius: 15px;
}
</style>
