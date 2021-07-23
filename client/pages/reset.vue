<template lang="pug">
div
  v-layout.backgroundImg(:style="fontSize.heightBackground")
    v-row.mt-12.md-6.ma-0
      v-col.mb-6(:style="fontSize.marginTop")
        v-card.containerCard.mt-12.mx-auto(
          :style="fontSize.maxWidth",
          outlined
        )
          v-list-item(three-line)
            v-list-item-content
              v-list-item-title.headline.mb-1(:style="fontSize.headlineSize") Modification de Mot de passe
              v-list-item-subtitle
                v-form(ref="form", v-model="valid", lazy-validation)
                  p Veuillez saisir votre nouveau mot de passe.

                  v-text-field(
                    label="Nouveau mot de passe",
                    type="password",
                    v-model="newPassword",
                    :rules="[rules.required, rules.passwordVerify]",
                    :append-icon="show ? '$mdi-eye' : '$mdi-eye-off'",
                    @click:append="show = !show",
                    :type="show ? 'text' : 'password'",
                    required
                  )

                  v-text-field(
                    label="Confirmation du nouveau mot de passe",
                    type="password",
                    v-model="confirmPassword",
                    :rules="[rules.required, pwdConfirmationRule]",
                    :append-icon="show1 ? '$mdi-eye' : '$mdi-eye-off'",
                    @click:append="show1 = !show1",
                    :type="show1 ? 'text' : 'password'",
                    @keyup.enter="updatePassword",
                    required
                  )

              v-row.mx-auto
                v-col(align="center")
                  v-btn.mx-auto(
                    :loading="loading",
                    :disabled="!valid",
                    color="success",
                    @click="updatePassword"
                  ) Confirmer
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
      newPassword: '',
      confirmPassword: '',
      show: false,
      show1: false,
      rules: {
        required: v => !!v || 'Le mot de passe est requis',
        passwordVerify: v =>
          !v ||
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            v
          ) ||
          'Au moins 8 caractères, une lettre majuscule, une lettre minuscule,un chiffre et un caractère spécial(@,$,!,%,*,?,&)'
      }
    }
  },
  computed: {
    // Match Password
    pwdConfirmationRule () {
      return () =>
        this.newPassword === this.confirmPassword ||
        'Mot de passe non identique'
    },
    fontSize () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.heightBackground = '581px'
          result.maxWidth = '287px'
          result.marginTop = '44px'
          result.headlineSize = '1.13rem !important'
          break
        case 'sm':
          result.heightBackground = '581px'
          result.maxWidth = '344px'
          result.marginTop = '44px'
          result.headlineSize = '1.13rem !important'
          break
        case 'md':
          result.heightBackground = '681px'
          result.maxWidth = '344px'
          result.marginTop = '84px'
          result.headlineSize = '1.13rem !important'
          break
        default:
          result.heightBackground = '681px'
          result.maxWidth = '344px'
          result.marginTop = '84px'
          result.headlineSize = '1.43rem !important'
          break
      }
      return {
        heightBackground: `height: ${result.heightBackground}`,
        maxWidth: `max-width: ${result.maxWidth}`,
        marginTop: `margin-top: ${result.marginTop}`,
        headlineSize: `font-size: ${result.headlineSize}`
      }
    }
  },
  methods: {
    async updatePassword () {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const token = this.$route.query.token
          const password = this.newPassword
          await authManagementService.create({
            action: 'resetPwdLong',
            value: {
              token: token,
              password
            }
          })
          this.$store.commit('notif/sendSuccess', 'Votre mot de passe a bien été changé. Un email vient de vous être envoyé.')
          this.loading = false
          setTimeout(() => this.$router.push('/login'), 6000)
        } catch (e) {
          this.loading = false
          this.$store.commit('notif/sendAlert', 'Le lien a expiré ou vous avez déjà modifié votre mot de passe.')
          setTimeout(() => this.$router.push('/forgot'), 6000)
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
