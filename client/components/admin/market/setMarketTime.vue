<template lang="pug">
  v-card
    v-card-title Création des horaires pour le marché {{market.name}}
      v-spacer
      v-text-field(v-model="market.minAmount" label="montant minimum d'achats en euros" type="number" min="0")
    v-card-text
      v-row
        v-col(cols="6")
          v-menu(
            v-model="menuStartDate"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y min-width="290px")
            template(v-slot:activator="{ on }")
              v-text-field(v-model="time.top" label="Date d'ouverture" readonly v-on="on" )
            v-date-picker(v-model="time.top" @input="menuStartDate = false, menuStartHours = true" locale="fr-fr" landscape)
        v-col(cols="6")
          v-menu(
            v-model="menuStartHours"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y min-width="290px"
            ref="menu"
            :return-value.sync="time.hTop")
            template(v-slot:activator="{ on }")
              v-text-field(v-model="time.hTop" label="Heure d'ouverture" readonly v-on="on" )
            v-time-picker(v-model="time.hTop" v-if="menuStartHours" @click:minute="$refs.menu.save(time.hTop)" format="24hr")
        v-col(cols="6")
          v-menu(
            v-model="menuEndDate"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y min-width="290px")
            template(v-slot:activator="{ on }")
              v-text-field(v-model="time.end" label="Date de fermeture" readonly v-on="on" )
            v-date-picker(v-model="time.end" @input="menuEndDate = false, menuEndHours = true" locale="fr-fr" landscape :min="time.top")
        v-col(cols="6")
          v-menu(
            v-model="menuEndHours"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y min-width="290px"
            ref="menu2"
            :return-value.sync="time.hEnd")
            template(v-slot:activator="{ on }")
              v-text-field(v-model="time.hEnd" label="Heure de fermerture" readonly v-on="on" )
            v-time-picker(v-model="time.hEnd" v-if="menuEndHours" @click:minute="$refs.menu2.save(time.hEnd)" format="24hr" :min="time.top === time.end ? time.hTop : ''")
    v-card-actions
      v-spacer
      v-btn(color="secondary" @click="() => $emit('previous-step')") Retour
      v-btn(color="primary" @click="updateDate") Valider mon marché

</template>

<script>
export default {
  props: {
    market: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      menuStartDate: false,
      menuStartHours: false,
      menuEndHours: false,
      menuEndDate: false
    }
  },
  computed: {
    time () {
      let result = {
        top: new Date().toISOString().substring(0, 10),
        end: new Date().toISOString().substring(0, 10),
        hTop: '11:00',
        hEnd: '23:00'
      }
      if (this.market.opening && this.market.closing) {
        const opening = new Date(this.market.opening)
        const closing = new Date(this.market.closing)
        result = {
          top: opening.toISOString().substring(0, 10),
          end: closing.toISOString().substring(0, 10),
          hTop: opening.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          hEnd: closing.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }
      }
      return result
    }
  },
  methods: {
    computeTs (date, time) {
      return Date.parse(`${date}T${time}:00.000`)
    },
    updateDate () {
      const opening = this.computeTs(this.time.top, this.time.hTop)
      const closing = this.computeTs(this.time.end, this.time.hEnd)
      const updatedMarket = this.market
      Object.assign(updatedMarket, {
        opening,
        closing,
        pdtSiteGroupingId: this.$store.state.admin.group.id
      })
      this.$emit('next-step', updatedMarket)
    }

  }
}
</script>
