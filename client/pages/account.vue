<template lang="pug">
  v-container
    v-row
      v-col.col-xs-12.col-md-4
        v-card(outlined shaped).elevation-10
          v-img(src="/Carousel5.png" height="250")
          v-card-title
            v-icon.mb-2.mr-2(x-large) $mdi-barn
            | {{ $store.state.auth.user.pdt_provider.name }}
          v-card-text
            v-icon(color="primary").mb-2.mr-2 $mdi-home
            span {{$store.state.auth.user.pdt_provider.adress}}
            span </br>
            v-icon(color="primary").mb-2.mr-2 $mdi-cart-plus
            span Prochaine distribution le : {{ market.distri.day }} à {{ market.distri.hour.start }}
            span </br>
            v-icon(color="primary").mb-2.mr-2 $mdi-account-tie-voice-outline
            span Kulteur référent : {{ $store.state.auth.user.pdt_provider.nameKultor }}
          v-card-actions
            v-img(src='./traitperma.png' width="80%")
      v-col.col-xs-12.col-sm-6.col-md-4
        v-card(outlined shaped).elevation-10
          v-card-title
            v-icon.mb-2.mr-2(x-large) $mdi-account
            | Bonjour {{ fullname }}
          v-card-subtitle
            a(:href='stripeURL') Mes informations de paiment
          v-card-text
            v-form(ref="user")
              v-text-field(
                :disabled="!editUser"
                label="Nom de famille"
                :rules="[rules.required, rules.length]"
                v-model="user.lastname"
                required
              )
              v-text-field(
                :disabled="!editUser"
                label="Prénom"
                :rules ="[rules.required, rules.length]"
                v-model="user.firstname"
                required
              )
              v-text-field(
                :disabled="!editUser"
                label="Adresse mail"
                :rules="[rules.required, rules.emailValidation]"
                v-model="user.email"
                required
              )
              v-text-field(
                :disabled="!editUser"
                label="Téléphone"
                :rules="[rules.required, rules.telLength]"
                v-model="user.tel"
                required
              )
              v-text-field(
                :disabled="!editUser"
                label="Nombre de personne dans votre foyer"
                :rules="[rules.required, rules.onlyNumber, rules.nbHomeLength]"
                v-model="user.nbHome"
                required
              )
          v-card-actions
            v-spacer
            v-btn(v-if='!editUser'
              color='primary'
              @click.stop="editUser = true"
            ) Modifier
            v-btn(v-else
              color='primary'
              :loading="loading"
              @click.stop="dialogProfile = true"
            ) Enregistrer
            v-spacer
          v-card-actions
            v-img(src='./traitperma.png' width="80%")
          v-dialog(v-model="dialogProfile" width=400)
            v-card
              v-card-title Confirmer les modifications
              v-card-text Êtes-vous sûr de vouloir modifier votre profil ?
              v-card-actions
                v-spacer
                v-btn(outlined color='secondary' @click="dialogProfile = false; editUser = false") Annuler
                v-btn(outlined color='primary' @click="updateProfile") OUI
      v-col.col-xs-12.col-sm-6.col-md-4
        v-card(outlined shaped).elevation-10
          v-card-title
            v-icon.mb-2.mr-2(x-large) $mdi-lock
            | Mot de passe
          v-card-text
            v-form(v-if="editPwd" ref="pwd")
              v-text-field(
                label="Ancien mot de passe"
                :rules="[rules.required, rules.passwordVerify]"
                v-model="register.oldPassword"
                :append-icon="show ? '$mdi-eye' : '$mdi-eye-off'"
                @click:append="show = !show"
                :type="show ? 'text' : 'password'"
                required
              )
              v-text-field(
                label="Nouveau mot de passe"
                v-model="register.newPassword"
                :rules="[rules.required, rules.passwordVerify]"
                :append-icon="show1 ? '$mdi-eye' : '$mdi-eye-off'"
                @click:append="show1 = !show1"
                :type="show1 ? 'text' : 'password'"
                required
              )
              v-text-field(
                label="Confirmation du nouveau mot de passe"
                v-model="confirmPassword"
                :rules="[rules.required, pwdConfirmationRule]"
                :append-icon="show2 ? '$mdi-eye' : '$mdi-eye-off'"
                @click:append="show2 = !show2"
                :type="show2 ? 'text' : 'password'"
                required
              )
          v-card-actions
            v-spacer
            v-btn(v-if='!editPwd'
              color='primary'
              @click.stop="editPwd = true"
            ) Modifier
            v-btn.btn_actions(v-else
              color='primary'
              @click.stop="dialogPwd = true"
            ) Enregistrer
            v-spacer
          v-card-actions
            v-img(src='./traitperma.png' width="80%")
          v-dialog(v-model="dialogPwd" width=400)
            v-card
              v-card-title Confirmer les modifications
              v-card-text Êtes-vous sûr de vouloir modifier votre mot de passe ?
              v-card-actions
                v-spacer
                v-btn(outlined color='secondary' @click="dialogPwd = false; editPwd = false") Annuler
                v-btn(outlined color='primary' @click="updatePassword") OUI
</template>

<script>
import client, { userService, paymentMethodsService } from '@/api'

export default {
  data () {
    return {
      editUser: false,
      editPwd: false,
      user: {
        lastname: '',
        firstname: '',
        tel: '',
        email: '',
        nbHome: ''
      },
      register: {
        oldPassword: '',
        newPassword: ''
      },
      market: {
        distri: { hour: {} }
      },
      dialogProfile: false,
      dialogPwd: false,
      dialogCard: false,
      deleteCard: {},
      loading: false,
      message: '',
      confirmPassword: '',
      show: false,
      show1: false,
      show2: false,
      paymentMethods: [],
      loadingRemove: false,
      loadingDefault: false,
      stripeURL: '',
      rules: {
        required: value => !!value || value === 0 || 'Champ obligatoire',
        emailValidation: v =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "L'e-mail n'est pas valide",
        length: v =>
          (v && v.length >= 2) ||
          'Le champ doit comporter 2 caractères minimums',
        telLength: v =>
          !v ||
          /^(0|\+33)[1-9]([-.: ]?[0-9]{2}){4}$/.test(v) ||
          "Le numéro de téléphone n'est pas valide",
        onlyNumber: v =>
          !v || /^[0-9]*$/.test(v) || 'Seuls les chiffres sont compris',
        nbHomeLength: v =>
          !v || /^[0-9]{0,2}$/.test(v) || 'Vous ne pouvez pas rentrer plus de 2 chiffres',
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
    fullname () {
      return `${this.$store.state.auth.user.firstname}`
    },
    pwdConfirmationRule () {
      return () =>
        this.register.newPassword === this.confirmPassword ||
        'Mot de passe non identique'
    },
    hide () {
      return this.$vuetify.breakpoint.name === 'xs'
    }
  },
  async mounted () {
    this.user.lastname = this.$store.state.auth.user.lastname
    this.user.firstname = this.$store.state.auth.user.firstname
    this.user.email = this.$store.state.auth.user.email
    this.user.tel = this.$store.state.auth.user.tel
    this.user.nbHome = this.$store.state.auth.user.nbHome
    this.user.userId = this.$store.state.auth.user.userId
    this.setInfoReceptionOpen(this.$store.state.auth.user.pdt_provider)
    await this.genStripe()
  },
  methods: {
    async genStripe () {
      try {
        const { url } = await paymentMethodsService.get(window.location.origin)
        this.stripeURL = url
      } catch (e) {
      }
    },
    async updatePassword () {
      if (
        this.register.newPassword === this.confirmPassword &&
        this.$refs.pwd.validate()
      ) {
        try {
          const { user } = await client.authenticate({
            strategy: 'local',
            email: this.user.email,
            password: this.register.oldPassword
          })
          user.password = this.register.newPassword
          await userService.update(user.userId, user)
          this.editPwd = false
          this.dialogPwd = false
          this.$store.commit('notif/sendSuccess', 'Le mot de passe a bien été modifié')
        } catch (e) {
          e.message = "L'ancien mot de passe ne correspond pas"
        }
      }
    },
    async updateProfile () {
      if (this.$refs.user.validate()) {
        try {
          await userService.patch(this.user.userId, this.user)
          this.editUser = false
          this.dialogProfile = false
          this.$store.dispatch('auth/authenticate')
          this.$store.commit('notif/sendSuccess', 'Votre profil a bien été modifié')
        } catch (e) {
          this.loading = false
          this.$store.commit('notif/sendAlert', 'Une erreur est survenue. Veuillez réessayer plus tard.')
        }
      }
    },
    minutesWithZero (dt) {
      return (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes()
    },
    getDayName (day) {
      const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
      return days[day]
    },
    getMonthName (month) {
      const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
        'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
      return months[month]
    },
    setInfoReceptionOpen (infos) {
      const dateDistriOpen = new Date(infos.receptionOpen)
      this.market.distri.day = `${this.getDayName(dateDistriOpen.getDay())} ${dateDistriOpen.getDate()} ${this.getMonthName(dateDistriOpen.getMonth())}`
      this.market.distri.hour.start = `${dateDistriOpen.getHours()}:${this.minutesWithZero(dateDistriOpen)}`
    }
  }
}
</script>

<style lang="scss" scoped>

h3 {
  font-size: 22px;
}
</style>
