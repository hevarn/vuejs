<template lang="pug">
    v-row(align="center" justify="center").backgroundImg
      v-card(
          :style="fontSize.maxWidth"
          outlined)
        v-card-title.headline Connexion
        v-card-text
          v-form(
              ref="form"
              v-model="valid"
              lazy-validation)
            v-text-field(
                v-model="register.email"
                :rules="register.emailRules"
                placeholder="E-mail"
                )

            v-text-field(
                outline
                v-model="register.password"
                :rules="register.passwordRules"
                placeholder="Mot de passe"
                id="password"
                type="password"
                autocomplete="off"
                :append-icon="show ? '$mdi-eye' : '$mdi-eye-off'"
                @click:append="show = !show"
                :type="show ? 'text' : 'password'"
                @keyup.enter="connection"
                )
          v-row.mx-auto
            v-col(align="center")
              v-btn.mx-auto(
                  :loading="loading"
                  :disabled="!valid"
                  color="success"
                  @click="connection()") Connexion
              GoogleAuth
          v-row.mx-auto
            v-col(align="center")
              a(@click="$router.push('forgot')" color='primary') Mot de passe oublié ?
          v-row.mx-auto
            v-col(align="center")
              v-btn(outlined :style="fontSize.btnRegister" @click="$router.push('register')" color='primary') Créez-vous un compte !
</template>

<script>
import GoogleAuth from '@/components/googleAuth'
export default {
  components: {
    GoogleAuth
  },
  layout: 'visitor',
  data () {
    return {
      loading: false,
      valid: true,
      show: false,
      register: {
        email: '',
        emailRules: [
          v => !!v || "L'e-mail est requis",
          v => /.+@.+\..+/.test(v) || "L'e-mail doit être valide"
        ],
        password: '',
        passwordRules: [v => !!v || 'Le mot de passe est requis']
      }
    }
  },
  head () {
    return {
      title: 'Login',
      meta: [
        { hid: 'description', name: 'description', content: 'Login Page ' },
        { hid: 'keywords', name: 'keywords', content: 'login' }
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
          result.marginTop = '24px'
          result.btnRegister = '13px'
          break
        case 'sm':
          result.heightBackground = '581px'
          result.maxWidth = '344px'
          result.marginTop = '24px'
          result.btnRegister = '16px'
          break
        case 'md':
          result.heightBackground = '681px'
          result.maxWidth = '344px'
          result.marginTop = '64px'
          result.btnRegister = '16px'
          break
        default:
          result.heightBackground = '681px'
          result.maxWidth = '344px'
          result.marginTop = '64px'
          result.btnRegister = '16px'
          break
      }
      return {
        heightBackground: `height: ${result.heightBackground}`,
        maxWidth: `max-width: ${result.maxWidth}`,
        marginTop: `margin-top: ${result.marginTop}`,
        btnRegister: `font-size: ${result.btnRegister}`
      }
    }
  },
  methods: {
    async connection () {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const auth = await this.$store.dispatch('auth/authenticate', {
            strategy: 'local',
            email: this.register.email,
            password: this.register.password
          })
          if (auth.user.isVerified) {
            const routeRedirect = this.$store.state.auth.user.redirectUser
            this.$router.push(routeRedirect)
          } else {
            this.loading = false
            this.$store.commit(
              'notif/sendInfo',
              "Vous n'avez pas validé votre email, pour finaliser votre inscription, veuillez cliquer sur le lien de confirmation inclus dans l'email."
            )
          }
        } catch (e) {
          this.loading = false
          this.$store.commit(
            'notif/sendAlert',
            'Connexion impossible : e-mail ou mot de passe invalide.'
          )
        }
      }
    }
  }
}
</script>

<style scoped>
.backgroundImg {
  background-image: url('/register_login_image.jpg');
  background-size: cover; /* Resize the background image to cover the entire container */
  width: 100vw;
  min-height: 75vh;
}

.v-card:not(.v-sheet--tile):not(.v-card--shaped) {
  border-radius: 15px;
}
</style>
