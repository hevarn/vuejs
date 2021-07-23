<template lang="pug">
  v-container
    v-card.col-6.col-sm-12.col-md-6(class="mx-auto" outlined)
      v-card-title Aide
      v-form(ref="form"  v-model="valid" lazy-validation  )
        v-select.pa-2(:items="options" v-model="optionSelected" :rules="[required]" label="Quel est votre problème ?" append-icon="$mdi-chevron-down")
        v-text-field.pa-2(v-if="optionSelected === '2'" :rules="[required]" v-model="orderNb" label="Numéro de commande")
        v-textarea.pa-2(v-model="text" label="N'hésitez pas à décrire votre problème (une description détaillée permet une résolution plus rapide !)")
      v-btn(absolute right color="accent" @click="sendContact") Envoyer
    v-dialog(v-model="showDialog" height=250 width=380)
      v-card
        v-card-title(class="justify-center") Votre Message a bien été envoyé
</template>
<script>
import { mailerService } from '@/api'

export default {
  data () {
    return {
      valid: false,
      message: '',
      showDialog: false,
      orderNb: '',
      optionSelected: 0,
      comment: '',
      text: '',
      required: v => !!v || 'Champ obligatoire',

      options: [
        { value: '0', text: "J'ai un problème avec mon compte" },
        { value: '1', text: "Je n'arrive pas à commander en ligne" },
        {
          value: '2',
          text: "J'ai un problème avec ma dernière commande"
        },
        { value: '3', text: "J'ai une autre question" }
      ]
    }
  },
  methods: {
    async sendContact () {
      if (this.$refs.form.validate()) {
        try {
          const email = {}
          email.to = [
            {
              email: 'contact@kanopeekoncept.com'
            }
          ]
          email.subject = `Problème remonté par ${this.$store.state.auth.user.firstname} ${this.$store.state.auth.user.lastname}`
          if (this.optionSelected === '2') {
            email.htmlContent = `
                <link href="https://fonts.googleapis.com/css?family=Muli" rel='stylesheet' type='text/css'>
                <style type="text/css">
                  * {font-family: 'Muli' !important;}
                </style>
                <div style="background-color: lightgray;font-family:Muli">
                  <div style="margin: 0 auto;width: 675px">
                    <img src="https://zupimages.net/up/20/16/zw9v.png" style="width:200px; background-color:lightgray" alt="logo Kanopée Koncept">
                  </div>
                  <div style="margin: 0 auto;padding: 20px; background-color:white; width: 600px">
                    <p style="font-size:18px"><span style="text-decoration: underline">Prénom :</span> ${
                      this.$store.state.auth.user.firstname
                    }</p>
                    <p style="font-size:18px"><span style="text-decoration: underline">Nom :</span> ${
                      this.$store.state.auth.user.lastname
                    }</p>
                    <p style="font-size:18px"><span style="text-decoration: underline">Email :</span> ${
                      this.$store.state.auth.user.email
                    } <span style="text-decoration: underline; margin-left: 20px">Téléphone :</span> ${
              this.$store.state.auth.user.tel
            }</p>
                    <p style="font-size:18px; text-decoration: underline">Problème remonté :</p>
                    <div style="text-align: center; margin: 30px 0">
                      <p style="font-size:18px">${
                        this.options[this.optionSelected].text
                      }</p>
                      <p style="font-size:18px"><span style="text-decoration: underline">Commande numéro :</span> ${
                        this.orderNb
                      } </p>
                    </div>
                    <p style="font-size:18px; text-decoration: underline">Message :</p>
                    <div style="text-align: center; margin: 30px 0">
                      <p style="font-size:18px">${this.text}</p>
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
          } else {
            email.htmlContent = `
                <link href="https://fonts.googleapis.com/css?family=Muli" rel='stylesheet' type='text/css'>
                <style type="text/css">
                  * {font-family: 'Muli' !important;}
                </style>
                <div style="background-color: lightgray;font-family:Muli">
                  <div style="margin: 0 auto;width: 675px">
                    <img src="https://zupimages.net/up/20/16/zw9v.png" style="width:200px; background-color:lightgray" alt="logo Kanopée Koncept">
                  </div>
                  <div style="margin: 0 auto;padding: 20px; background-color:white; width: 600px">
                    <p style="font-size:18px"><span style="text-decoration: underline">Prénom :</span> ${
                      this.$store.state.auth.user.firstname
                    }</p>
                    <p style="font-size:18px"><span style="text-decoration: underline">Nom :</span> ${
                      this.$store.state.auth.user.lastname
                    }</p>
                    <p style="font-size:18px"><span style="text-decoration: underline">Email :</span> ${
                      this.$store.state.auth.user.email
                    } <span style="text-decoration: underline; margin-left: 20px">Téléphone :</span> ${
              this.$store.state.auth.user.tel
            }</p>
                    <p style="font-size:18px; text-decoration: underline">Problème remonté :</p>
                    <div style="text-align: center; margin: 30px 0">
                      <p style="font-size:18px">${
                        this.options[this.optionSelected].text
                      }</p>
                    </div>
                    <p style="font-size:18px; text-decoration: underline">Message :</p>
                    <div style="text-align: center; margin: 30px 0">
                      <p style="font-size:18px">${this.text}</p>
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

          await mailerService.create(email)
          this.text = ''
          this.optionSelected = 0
          this.orderNb = ''
          this.showDialog = true
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      }
    }
  }
}
</script>
