<template lang="pug">
v-container.pa-0(fluid)
  v-row
    v-col.pa-1.col-12.col-sm-6.col-md-3
      v-menu(
        v-model='menuStartDate',
        :close-on-content-click='false',
        :nudge-right='40',
        transition='scale-transition',
        offset-y,
        min-width='290px'
      )
        template(v-slot:activator='{ on }')
          v-text-field(
            v-model='time.top',
            :label='provider ? "Récupération du " : "Ouverture du marché"',
            readonly,
            v-on='on'
          )
        v-date-picker(
          v-model='time.top',
          :min='provider ? this.$store.state.admin.group.closing : ""',
          @input='menuStartDate = false',
          locale='fr-fr',
          landscape
        )
    v-col.pa-1.col-12.col-sm-6.col-md-3
      v-menu(
        v-model='menuStartHours',
        :close-on-content-click='false',
        :nudge-right='40',
        transition='scale-transition',
        offset-y,
        min-width='290px',
        ref='menu',
        :return-value.sync='time.hTop'
      )
        template(v-slot:activator='{ on }')
          v-text-field(v-model='time.hTop', label='De', readonly, v-on='on')
        v-time-picker(
          v-model='time.hTop',
          v-if='menuStartHours',
          @click:minute='$refs.menu.save(time.hTop)',
          format='24hr'
        )
    v-col.pa-1.col-12.col-sm-6.col-md-3(v-if='!provider')
      v-menu(
        v-model='menuEndDate',
        :close-on-content-click='false',
        :nudge-right='40',
        transition='scale-transition',
        offset-y,
        min-width='290px'
      )
        template(v-slot:activator='{ on }')
          v-text-field(
            v-model='time.end',
            :label='provider ? "Récupération du " : "Fermeture du marché"',
            readonly,
            v-on='on'
          )
        v-date-picker(
          v-model='time.end',
          :min='time.top',
          @input='menuEndDate = false',
          locale='fr-fr',
          landscape
        )
    v-col.pa-1.col-12.col-sm-6.col-md-3
      v-menu(
        v-model='menuEndHours',
        :close-on-content-click='false',
        transition='scale-transition',
        :nudge-right='40',
        offset-y,
        min-width='290px',
        ref='menu2',
        :return-value.sync='time.hEnd'
      )
        template(v-slot:activator='{ on }')
          v-text-field(v-model='time.hEnd', label='A', readonly, v-on='on')
        v-time-picker(
          v-model='time.hEnd',
          :min='provider ? time.hTop : "00:00"',
          v-if='menuEndHours',
          @click:minute='$refs.menu2.save(time.hEnd)',
          format='24hr'
        )
  v-row(v-if='provider')
    v-col.col-4.offset-4
      v-text-field(
        v-model='intervalDuration',
        label='Durée d\'un créneau de récupération de paniers (en minutes)',
        type='number',
        @input='updateNbEventText'
      )
    v-col.col-4
      v-text-field(
        v-model='nbParticipant',
        label='Nombre de paniers à retirer par créneaux',
        type='number',
        @input='updateNbEventText'
      )
  v-row
    span {{ nbEventText }}
    v-spacer
    v-btn.mr-3(
      color='primary',
      @click.stop='openPopupTime = true',
      :loading='loading'
    ) valider les changements
  v-row(v-if='provider && events.length === 0')
    span Auncun créneau horaire n'a été trouvé.
  v-row(v-if='events.length > 0')
    v-col.col-12(v-if='!fromOrder')
      AdmPdctEventsTable(
        :events='events',
        :marketEvent="marketEvent",
        :userParticipationInEvent='userParticipationInEvent.length > 0 ? true : false',
        @fetch-events='fetchEvents'
      )
  v-row
    v-spacer
    v-col.text-center.text-md-right
    v-dialog(v-model='openPopupTime', width=400)
      v-card
        v-card-title Modification des horaires
        v-card-text(v-if='marketEvent.id') Voulez-vous modifier les créneaux horaires pour le site #[strong {{ marketEvent.pdt_provider.name }}] ? <br>
          span Récupération des paniers le #[strong {{ new Date(computeTs(time.top, time.hTop)).toLocaleString("fr-FR", { timeZone: "Europe/Paris", weekday: "long", year: "numeric", month: "long", day: "numeric" }) }}] de #[strong {{ new Date(computeTs(time.top, time.hTop)).toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour: "numeric", minute: "numeric" }) }}] à #[strong {{ new Date(computeTs(time.top, time.hEnd)).toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour: "numeric", minute: "numeric" }) }}].
        v-card-text(v-else) Voulez-vous modifier les horaires pour le groupement de site : #[strong {{ $store.state.admin.group.name }}] ? <br>
          span Ouverture le : #[strong {{ new Date(computeTs(time.top, time.hTop)).toLocaleString() }}]. <br>
          span Fermeture le : #[strong {{ new Date(computeTs(time.end, time.hEnd)).toLocaleString() }}].
        v-card-actions
          v-spacer
          v-btn.ma-2(
            outlined,
            color='secondary',
            @click='openPopupTime = false'
          ) Annuler
          v-btn.ma-2(
            outlined,
            color='primary',
            @click='updateDate',
            :loading='loading'
          ) Oui
</template>

<script>
import { siteGroupingsService, eventsService, marketEventsService } from '@/api'
export default {
  props: {
    provider: {
      type: Number,
      default: 0
    },
    fromOrder: {
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
      menuStartDate: false,
      menuEndDate: false,
      menuStartHours: false,
      menuEndHours: false,
      intervalDuration: 0,
      nbParticipant: 0,
      openPopupTime: false,
      nbEventText: '',
      events: [],
      loading: false,
      userParticipationInEvent: []
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
      if (this.marketEvent.receptionOpen && this.marketEvent.receptionClose) {
        const opening = new Date(this.marketEvent.receptionOpen)
        const closing = new Date(this.marketEvent.receptionClose)
        result = {
          top: opening.toISOString().substring(0, 10),
          end: closing.toISOString().substring(0, 10),
          hTop: opening.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          hEnd: closing.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }
      }
      return result
    },
    resultInMinutes () {
      const startTime = this.computeTs(this.time.top, this.time.hTop)
      const endTime = this.computeTs(this.time.top, this.time.hEnd)
      const difference = endTime - startTime // This will give difference in milliseconds
      return Math.round(difference / 60000) // in minutes
    }
  },
  watch: {
    provider () {
      this.fetchEvents()
    }
  },
  mounted () {
    if (this.provider) {
      this.fetchEvents()
    }
  },
  methods: {
    updateNbEventText () {
      this.nbEventText = `Soit ${this.getNbEvent()} créneau${
        this.getNbEvent() > 1 ? 'x' : ''
      } pour un maximum de ${this.getNbMaxParticipants()} commande${
        this.getNbMaxParticipants() > 1 ? 's' : ''
      } à retirer ce jour.`
    },
    getNbEvent () {
      if (this.intervalDuration > 0) {
        return Math.round(this.resultInMinutes / this.intervalDuration)
      } else {
        return 0
      }
    },
    getNbMaxParticipants () {
      return (
        this.nbParticipant *
        Math.round(this.resultInMinutes / this.intervalDuration)
      )
    },
    async createEvents () {
      this.loading = true
      const events = []
      const startTime = new Date(this.computeTs(this.time.top, this.time.hTop))
      let endTime = new Date(this.computeTs(this.time.top, this.time.hTop))
      const intervalDuration = parseInt(this.intervalDuration) // disable weird behavior present without the parsing
      const nbEvents = this.getNbEvent()
      endTime.setMinutes(endTime.getMinutes() + intervalDuration)
      for (let i = 0; i < nbEvents; i++) {
        const newEvent = {
          role: 'Reception',
          pdtProviderId: this.marketEvent.pdtProviderId,
          startAt: startTime.toString(),
          endAt: endTime.toString(),
          userCurrent: 0,
          userMax: this.nbParticipant,
          description: 'Distribution',
          marketEventId: this.marketEvent.id
        }
        events.push(newEvent)
        startTime.setMinutes(startTime.getMinutes() + intervalDuration)
        endTime.setMinutes(endTime.getMinutes() + intervalDuration)
        if (endTime > new Date(this.computeTs(this.time.top, this.time.hEnd))) {
          endTime = new Date(this.computeTs(this.time.top, this.time.hEnd))
        }
      }
      if (events.length === this.events.length && !this.fromOrder) {
        for (let i = 0; i < this.events.length; i++) {
          const event = this.events[i]
          if (event.userCurrent === 0) {
            await eventsService.patch(event.eventId, {
              startAt: events[i].startAt,
              endAt: events[i].endAt,
              userMax: events[i].nbParticipant
            })
          }
        }
      } else {
        if (this.events.length > 0 && !this.fromOrder) {
          await eventsService.remove(null, {
            query: { eventId: this.events.map(({ eventId }) => eventId) }
          })
        }
        await eventsService.create(events)
      }
      this.loading = false
    },
    computeTs (date, time) {
      return Date.parse(`${date}T${time}:00.000`)
    },
    async updateDate () {
      this.loading = true
      const opening = this.computeTs(this.time.top, this.time.hTop)
      const closing = this.computeTs(this.time.top, this.time.hEnd)
      try {
        await marketEventsService.patch(this.marketEvent.id, {
          receptionOpen: opening,
          receptionClose: closing
        })
        this.createEvents()
        this.fetchEvents()
        this.loading = false
        this.openPopupTime = false
        this.$store.commit('notif/sendSuccess', 'Ajout des nouveaux horaires')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async fetchGroup () {
      try {
        const data = await siteGroupingsService.get(
          this.$store.state.admin.group.id
        )
        this.$store.commit('admin/updateGroup', data)
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async fetchEvents () {
      const { data } = await eventsService.find({
        query: {
          pdtProviderId: this.marketEvent.pdtProviderId,
          role: 'Reception',
          marketEventId: this.marketEvent.id
        }
      })
      this.events = data
      if (data.length > 0) {
        this.userParticipationInEvent = this.events.filter(
          ({ userCurrent }) => userCurrent > 0
        )
        this.messageNoSlot = false
        const startAt = Date.parse(new Date(data[0].startAt))
        const endAt = Date.parse(new Date(data[0].endAt))
        this.intervalDuration = (endAt - startAt) / 60000
        this.nbParticipant = data[0].userMax
      }
    }
  }
}
</script>
