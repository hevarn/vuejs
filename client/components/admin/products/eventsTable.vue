<template lang="pug">
  v-row
    v-col.col-12
      v-data-table(loader-height="10" dense :headers="headers" :items="events"
            :footer-props={
              itemsPerPageText: 'Créneaux par page :',
              firstIcon: '$mdi-arrow-up',
              prevIcon: '$mdi-chevron-left',
              nextIcon: '$mdi-chevron-right'
            }
            :header-props={
              sortIcon: '$mdi-arrow-up',
              sortByText:'Filtrer par'
            })
        template(v-slot:item.startAt="{ item }")
          span {{new Date(item.startAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}}
        template(v-slot:item.endAt="{ item }")
          span {{new Date(item.endAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}}
        template(v-slot:item.actions="{ item }")
          v-btn(small icon)
            v-icon(color="secondary" @click="selectEvent = item; confirmRemove = true" :disabled="item.userCurrent > 0 ? true : false") $mdi-trash-can-outline
          v-btn(small icon @click="selectEvent = item; confirmUpdate = true")
            v-icon(color="primary") $mdi-pencil-outline
    v-col.col-12.py-0
      v-card(elevation=0)
        v-card-actions.py-0
          v-spacer
          v-btn(color="secondary" @click="confirmRemoveAllEvents = true" :disabled="userParticipationInEvent") Supprimer tous les créneaux horaires disponibles
          v-tooltip(top v-if="userParticipationInEvent")
            template(v-slot:activator="{ on, attrs }")
              v-btn.pb-3(icon small v-on="on" v-bind="attrs")
                v-icon(color='green') $mdi-information-outline
            span Vous ne pouvez pas supprimer les créneaux horaires lorsqu'une personne c'est déjà inscrit.

    v-dialog(v-model="confirmRemove" max-width=400)
      v-card
        v-card-title ATTENTION
        v-card-text Vous êtes sur le point de supprimer un créneau horaire. Les horaires pour la récupération du panier ne changerons pas, ni les autres créneaux présents. Seul le créneau sélectionné sera définitivement supprimé.
        v-card-actions
          v-spacer
          v-btn(outlined color="secondary" @click="confirmRemove = false") Annuler
          v-btn(outlined color="primary" @click="removeEvent" :loading="loadingRemoveEvent") Confirmer
        v-card-actions
          v-img(src='/traitperma.png')
    v-dialog(v-model="confirmRemoveAllEvents" max-width=400)
      v-card
        v-card-title ATTENTION
        v-card-text Vous êtes sur le point de supprimer tous les créneaux horaires existants. Les horaires pour la récupération du panier ne changerons pas.
        v-card-actions
          v-spacer
          v-btn(outlined color="secondary" @click="confirmRemoveAllEvents = false") Annuler
          v-btn(outlined color="primary" @click="removeAllEvents" :loading="loadingRemoveAllEvents") Confirmer
        v-card-actions
          v-img(src='/traitperma.png')
    v-dialog(v-model="confirmUpdate" max-width=700)
      v-card
        v-card-title ATTENTION
        v-card-text Vous êtes sur le point de modifier le créneau horaire existant. Les autres créneaux horaires ne seront pas impactés ni les horaires pour la réception des paniers. Si un participant a déjà sélectionné ce créneau, seul le nombre maximum de participant reste modifiable.
        v-card-actions
          v-container
            v-row
              v-col.col-12.col-sm-6.col-md-3
                v-menu(v-model="dateMenu" :close-on-content-click="false" :nudge-right="40"  transition="scale-transition"  offset-y min-width="290px" :disabled="selectEvent.userCurrent > 0 ? true : false")
                  template(v-slot:activator="{ on }")
                    v-text-field(v-model="date" label="Date de récupération" readonly v-on="on" )
                  v-date-picker(v-model="date" @input="dateMenu = false" locale="fr-fr" landscape)
              v-col.col-12.col-sm-6.col-md-3
                v-menu(v-model="menuStartTime" :close-on-content-click="false" :nudge-right="40"  transition="scale-transition" offset-y min-width="290px"  ref="menu" :return-value.sync="startTime" :disabled="selectEvent.userCurrent > 0 ? true : false")
                  template(v-slot:activator="{ on, attrs }")
                    v-text-field(v-model="startTime" label="De" readonly v-on="on" v-bind="attrs")
                  v-time-picker(v-model="startTime" v-if="menuStartTime" @click:minute="$refs.menu.save(startTime)" format="24hr")
              v-col.col-12.col-sm-6.col-md-3
                v-menu(v-model="menuEndTime" :close-on-content-click="false" :nudge-right="40"  transition="scale-transition" offset-y min-width="290px"  ref="menu2" :return-value.sync="endTime" :disabled="selectEvent.userCurrent > 0 ? true : false")
                  template(v-slot:activator="{ on, attrs }")
                    v-text-field(v-model="endTime" label="A" readonly v-on="on" v-bind="attrs")
                  v-time-picker(v-model="endTime" v-if="menuEndTime" @click:minute="$refs.menu2.save(endTime)" format="24hr")
              v-col.col-12.col-sm-6.col-md-3
                v-text-field(v-model="userMax" label="Nombre de paniers à retirer" type='number')
        v-card-text La modification de ce créneau peux chevaucher sur un autre créneau.
        v-card-actions
          v-spacer
          v-btn(outlined color="secondary" @click="confirmUpdate = false") Annuler
          v-btn(outlined color="primary" @click="updateEvent" :loading="loadingUpdateEvent") Confirmer
        v-card-actions
          v-img(src='/traitperma.png')
</template>
<script>
import { eventsService } from '@/api'

export default {
  props: {
    events: {
      type: Array,
      default: () => []
    },
    userParticipationInEvent: {
      type: Boolean,
      default: false
    },
    marketEvent: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      headers: [
        { text: 'Début des créneaux', value: 'startAt', align: 'center' },
        { text: 'Fin des créneaux', value: 'endAt', align: 'center' },
        { text: 'Personnes inscrites', value: 'userCurrent', align: 'center' },
        { text: 'Personnes maximums', value: 'userMax', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ],
      confirmRemove: false,
      loadingRemoveEvent: false,
      confirmRemoveAllEvents: false,
      loadingRemoveAllEvents: false,
      confirmUpdate: false,
      loadingUpdateEvent: false,
      selectEvent: {},
      dateMenu: false,
      date: '',
      menuStartTime: false,
      startTime: '00:00',
      menuEndTime: false,
      endTime: '00:00',
      userMax: 0
    }
  },
  watch: {
    selectEvent () {
      this.date = new Date(this.selectEvent.startAt)
        .toISOString()
        .substring(0, 10)
      this.startTime = new Date(this.selectEvent.startAt).toLocaleTimeString(
        'fr-FR',
        {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          minute: '2-digit'
        }
      )
      this.endTime = new Date(this.selectEvent.endAt).toLocaleTimeString(
        'fr-FR',
        {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          minute: '2-digit'
        }
      )
      this.userMax = this.selectEvent.userMax
    }
  },
  methods: {
    async removeEvent () {
      this.loadingRemoveEvent = true
      try {
        await eventsService.remove(this.selectEvent.eventId)
        this.$store.commit('notif/sendSuccess', 'Le créneau a bien été supprimé')
      } catch (error) {
        this.$store.commit('notif/sendAlert')
      }
      this.loadingRemoveEvent = false
      this.confirmRemove = false
      this.$emit('fetch-events')
    },
    async removeAllEvents () {
      this.loadingRemoveAllEvents = true
      try {
        await eventsService.remove(null, {
          query: { marketEventId: this.marketEvent.id }
        })
      } catch (error) {
        this.$store.commit('notif/sendAlert')
      }
      this.confirmRemoveAllEvents = false
      this.loadingRemoveAllEvents = false
      this.$emit('fetch-events')
    },
    async updateEvent () {
      this.loadingUpdateEvent = true
      try {
        await eventsService.patch(this.selectEvent.eventId, {
          startAt: new Date(this.computeTs(this.date, this.startTime)),
          endAt: new Date(this.computeTs(this.date, this.endTime)),
          userMax: this.userMax
        })
        this.$store.commit('notif/sendSuccess', 'Le créneau a bien été modifié')
      } catch (error) {
        this.$store.commit('notif/sendAlert')
      }
      this.loadingUpdateEvent = false
      this.confirmUpdate = false
      this.$emit('fetch-events')
    },
    computeTs (date, time) {
      return Date.parse(`${date}T${time}:00.000`)
    }
  }
}
</script>
