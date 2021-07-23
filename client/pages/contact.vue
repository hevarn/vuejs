<template lang="pug">
  v-container(fluid).mt-12
    v-row.mt-1
      v-col.col-12.col-md-6.ma-0.pa-0
        VisitCarto
      v-col.col-sm-12.col-md-6
        v-card(outlined dense).mt-3
          v-card-title.pa-2
            h2 Contactez-nous
          v-card-subtitle.pa-2
            v-icon.mb-2(x-large color='primary') $mdi-email
            span(style="text-decoration: underline; font-size:18px; font-weight:bold") contact@kanopeekoncept.com
        v-col
          v-form(
            ref="form"
            v-model="valid"
            lazy-validation
          )
            v-row
              v-col
                v-text-field(label="Nom" type="text" :rules="[rules.required, rules.nameLenght]" v-model="user.lastname" required)
                v-text-field(label="Adresse mail" type="text" :rules="[rules.required, rules.validEmail]" v-model="user.email" required)
              v-col
                v-text-field(label="Prénom" type="email" :rules="[rules.required, rules.nameLenght]" v-model="user.firstname" required)
                v-text-field(label="Téléphone" type="text" :rules="[rules.required, rules.telLenght]" v-model="user.tel" required)
            v-row
              v-col
                v-textarea(label="Message" :rules="[rules.required]" v-model="user.message" required)
            v-row
              v-col(style="text-align-last:center")
                v-btn(color='primary' :loading="loading" :disabled="!valid" @click="sendContact" :style="fontSize.title") Envoyez votre Message
</template>

<script>
import { mailerService } from '@/api'

export default {
  layout: 'visitor',
  data () {
    return {
      user: {},
      loading: false,
      valid: false,
      rules: {
        required: v => !!v || 'Champ obligatoire',
        nameLenght: v =>
          (v && v.length <= 25) ||
          'Vous ne pouvez pas entrer plus que 25 caractères',
        telLenght: v =>
          (v && v.length >= 10) || 'Vous devez avoir au moins 10 chiffres',
        validEmail: value =>
          /\S+@\S+\.\S+/.test(value) || "Votre e-mail n'est pas valide"
      }
    }
  },
  computed: {
    fontSize () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.title = '12px'
          break
        case 'sm':
          result.title = '18px'
          break
        case 'md':
          result.title = '12px'
          break
        default:
          result.title = '12px'
          break
      }
      return {
        title: `font-size: ${result.title}`
      }
    }
  },
  methods: {
    async sendContact () {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const sendEmail = {
            to: [{ email: 'contact@kanopeekoncept.com' }],
            subject: `Prise de contact avec ${this.user.firstname} ${this.user.lastname}`,
            htmlContent: `
                <link href="https://fonts.googleapis.com/css?family=Muli" rel='stylesheet' type='text/css'>
                <style type="text/css">
                  * {font-family: 'Muli' !important;}
                </style>
                <div style="background-color: lightgray; font-family:Muli">
                  <div style="margin: 0 auto;width: 675px">
                    <img src="https://zupimages.net/up/20/16/zw9v.png" style="width:200px; background-color:lightgray" alt="logo Kanopée Koncept">
                  </div>
                  <div style="margin: 0 auto;padding: 20px; background-color:white; width: 600px">
                    <p style="font-size:18px"><span style="text-decoration: underline">Prénom :</span> ${this.user.firstname}</p>
                    <p style="font-size:18px"><span style="text-decoration: underline">Nom :</span> ${this.user.lastname}</p>
                    <p style="font-size:18px"><span style="text-decoration: underline">Email :</span> ${this.user.email} <span style="text-decoration: underline; margin-left: 20px">Téléphone :</span> ${this.user.tel}</p>
                    <p style="font-size:18px; text-decoration: underline">Message :</p>
                    <div style="text-align: center; margin: 30px 0">
                      <p style="font-size:18px">${this.user.message}</p>
                    </div>
                    <hr>
                    <div style="text-align:center">
                      <p style="font-size:18px">Vous avez des questions?</p>
                      <p style="font-size:18px">Notre <a style="color:#316827" href="https://kanopeekoncept.fr/user/support">page d'aide</a> est là pour vous </p>
                    </div>
                  </div>
                  <div style="margin: 0 auto ;padding: 40px 0; width: 600px; background-color: lightgray; text-align:center">
                    <a style="text-decoration:none" href="https://www.facebook.com/kanopeekoncept/">
                      <img style="width:45px" src="https://zupimages.net/up/20/22/yk1i.png">
                    </a>
                    <a style="text-decoration:none" href="https://twitter.com/kanopeekoncept?lang=fr">
                      <img style="width:40px" src="https://zupimages.net/up/20/22/pnkl.png">
                    </a>
                    <a style="text-decoration:none" href="https://www.linkedin.com/company/kanop%C3%A9e-koncept/">
                      <img style="width:40px" src="https://zupimages.net/up/20/22/gl2a.png">
                    </a>
                    <a style="text-decoration:none" href="https://www.instagram.com/kanopeekoncept/?hl=fr">
                      <img style="width:40px" src="https://zupimages.net/up/20/22/6bon.png">
                    </a>
                    <br>
                    <p style="font-size:18px"><a href="https://kanopeekoncept.fr/" style="text-decoration: underline; color: black">Kanopée Koncept</a>, permaculture urbaine</p>
                    <p style="font-size:18px">60 place de la république, Saint Médard, 33140</p>
                  </div>
                </div>
              `
          }
          await mailerService.create(sendEmail)
          this.loading = false
          this.$store.commit('notif/sendSuccess', 'Votre message a bien été envoyé. Nous vous répondrons dans les meilleures délais.')
          setTimeout(() => this.$router.push('/'), 6000)
        } catch (e) {
          this.loading = false
          this.$store.commit('notif/sendAlert', 'Une erreur est survenue. Veuillez réessayer plus tard')
        }
      }
    }
  }
}
</script>
