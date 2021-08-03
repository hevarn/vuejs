<template lang="pug">
div
  v-layout(class="backgroundImg").mt-10
    v-row.signup-wrapper.mt-5.ma-0
      v-col.signup-center
        v-col.signup-content
          v-col.content-white.pa-5(class="elevation-5")
            h1(:style="fontSize.title") Créez un compte
            v-form(
              ref="form"
              v-model="valid"
              lazy-validation
            )

              v-col.pa-0
                v-text-field(
                  v-model='lastname'
                  type="text"
                  placeholder="Nom"
                  :rules="[rules.required, rules.length]"
                  required
                  dense
                )

              v-col.pa-0
                v-text-field(
                  placeholder="Prénom"
                  v-model='firstname'
                  type="text"
                  :rules="[rules.required, rules.length]"
                  required
                  dense
                )

              v-col.pa-0
                v-text-field(
                  v-model='email'
                  type="email"
                  placeholder="E-mail"
                  :rules="[rules.required, rules.emailValidation]"
                  required
                  dense
                )

              v-col.pa-0
                  v-text-field(
                    v-model="password"
                    type="password"
                    placeholder="Mot de passe"
                    :rules="[rules.required,rules.passwordVerify]"
                    :append-icon="show ? '$mdi-eye' : '$mdi-eye-off'"
                    @click:append="show = !show"
                    :type="show ? 'text' : 'password'"
                    required
                    dense
                  )

              v-col.pa-0
                v-text-field(
                  v-model="confirmPwd"
                  type="password"
                  placeholder="Confirmation du mot de passe"
                  :rules="[rules.required,pwdConfirmationRule]"
                  :append-icon="show1 ? '$mdi-eye' : '$mdi-eye-off'"
                  @click:append="show1 = !show1"
                  :type="show1 ? 'text' : 'password'"
                  required
                  dense
                )

              v-col.pa-0
                v-text-field(
                  placeholder="Téléphone"
                  v-model='tel'
                  type="tel"
                  :rules="[rules.required, rules.telLength]"
                  required
                  dense
                )

              v-col.pa-0
                v-text-field(
                  v-model='postalCode'
                  type="text"
                  placeholder="Code postal"
                  :rules="[rules.required, rules.postalCodeLength]"
                  required
                  dense
                )

              v-col.pa-0
                v-text-field(
                  v-model='nbHome'
                  type="text"
                  placeholder="Nombre de personne par foyer"
                  :rules="[rules.required, rules.onlyNumber, rules.nbHomeLength]"
                  required
                  dense
                )

              v-col.py-3.px-0
                p(v-html="infoSite")
                v-select(
                  placeholder="Je choisis mon site"
                  v-model="selectedSite"
                  :items="allSite"
                  item-text="name"
                  item-value="name"
                  :rules="[rules.required]"
                  return-object
                  dense
                  @keyup.enter="registerUser"
                  append-icon="$mdi-chevron-down"
                )
                  template(v-slot:item="item")
                    p(
                      :class="item.item.isPrivate ?  'orange--text' :'accent--text' "
                    ) {{item.item.name}}

              v-col(align="center" justify="center")
                v-btn(
                  medium
                  :loading="loading"
                  @click="registerUser()"
                  color='primary') M'inscrire
</template>

<script>
import { userService, providersService } from '@/api'
export default {
  layout: 'visitor',
  data () {
    return {
      loading: false,
      valid: null,
      firstname: '',
      lastname: '',
      tel: '',
      postalCode: '',
      email: '',
      password: '',
      confirmPwd: '',
      selectedSite: '',
      nbHome: '',
      show: false,
      show1: false,
      rules: {
        required: value => !!value || 'Champ obligatoire',
        length: v =>
          (v && v.length >= 2) ||
          'Le champ doit comporter 2 caractères minimums',
        nbHomeLength: v =>
          !v ||
          /^[0-9]{0,2}$/.test(v) ||
          'Vous ne pouvez pas rentrer plus de 2 chiffres',
        telLength: v =>
          !v ||
          /^(0|\+33)[1-9]([-.: ]?[0-9]{2}){4}$/.test(v) ||
          "Le numéro de téléphone n'est pas valide",
        postalCodeLength: v =>
          !v || /^[0-9]{5}$/.test(v) || 'Vous devez avoir au moins 5 chiffres',
        onlyNumber: v =>
          !v || /^[0-9]*$/.test(v) || 'Seuls les chiffres sont compris',
        emailValidation: v =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "L'email n'est pas valide",
        passwordVerify: v =>
          !v ||
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            v
          ) ||
          'Au moins 8 caractères, une lettre majuscule, une lettre minuscule,un chiffre et un caractère spécial(@,$,!,%,*,?,&)'
      },
      allSite: [],
      infoSite:
        '<p>Les sites écrits en <b><span style="color:orange">orange</span></b> sont soumis à l\'autorisation des entreprises ou résidences concernées. Les sites en <b><span style="color:#316827">vert</span></b> sont ouverts à tous, bienvenus!</p>'
    }
  },
  head () {
    return {
      title: 'Register',
      meta: [
        { hid: 'description', name: 'description', content: 'Register Page ' },
        { hid: 'keywords', name: 'keywords', content: 'register' }
      ]
    }
  },
  computed: {
    // Match Password
    pwdConfirmationRule () {
      return () =>
        this.password === this.confirmPwd || 'Mot de passe non identique'
    },
    fontSize () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.title = '34px'
          break
        case 'sm':
          result.title = '34px'
          break
        case 'md':
          result.title = '24px'
          break
        default:
          result.title = '24px'
          break
      }
      return {
        title: `font-size: ${result.title}`
      }
    }
  },
  async mounted () {
    try {
      const { data } = await providersService.find({ query: { isSite: 1 } })
      this.allSite = data.filter(x => x.pdtSiteGroupingId !== 5) // must be change 5 === Hidden group
    } catch (e) {
      alert('Problème de réseau, Veuillez recharger la page')
    }
  },

  methods: {
    // Submit regiter's form for users
    async registerUser () {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          await userService.create({
            lastname: this.lastname,
            firstname: this.firstname,
            email: this.email,
            password: this.password,
            tel: this.tel,
            postalCode: this.postalCode,
            nbHome: this.nbHome,
            pdtProviderId: this.selectedSite.id
          })
          if (this.$fb) {
            this.$fb.track('CompleteRegistration')
          }
          this.$store.commit('notif/sendSuccess', 'Pour finaliser la création de votre compte, merci de cliquer sur le lien reçu par email. Si vous ne recevez rien dans votre boîte de réception, veuillez vérifier votre dossier de courrier indésirable. ')
        } catch (e) {
          this.$store.commit('notif/sendAlert', 'Le compte existe déjà')
        }
        this.$refs.form.reset()
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.signup-wrapper {
  background: url('/register_login_image.jpg') no-repeat center;
  background-size: cover;
  position: relative;
}

.signup-center {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 25px 0px;
}

.signup-content {
  position: relative;
  float: right;
  width: 100%;
  max-width: 500px;
}

h1 {
  line-height: 50px;
  padding-bottom: 10px;
}

p {
  ::v-deep p {
    font-style: italic;
    font-size: 12px;
  }
}

.content-white {
  background: #f9fcfe;
  box-sizing: border-box;
  border-radius: 15px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.06);
}

/* Tablette */
@media screen and (min-width: 600px) and (max-width: 960px) {
  .signup-center {
    padding-bottom: 10px;
  }

  .signup-content {
    max-width: 100%;
    margin-bottom: $register-margin-bottom;
    position: initial;
  }
}

/* Mobile  */
@media screen and (max-width: 600px) {
  .signup-center {
    padding-top: 50px;
  }
  .signup-content {
    max-width: 100%;
    margin-bottom: $register-margin-bottom;
  }

  p {
    ::v-deep p {
      margin-left: 10px;
      margin-right: 10px;
    }
  }
}
</style>
