<template lang="pug">
v-container
  v-sheet(height="64")
    v-toolbar(flat, color="white")
      v-btn.mr-4(outlined, color="grey darken-2", @click="setToday") Aujourd'hui
      v-btn(fab, text, small, color="black", @click="prev")
        v-icon(small) $mdi-chevron-left
      v-btn(fab, text, small, color="grey darken-2", @click="next")
        v-icon(small) $mdi-chevron-right
      v-toolbar-title(v-if="isCalendar") {{ $refs.calendar.title }}
      v-spacer
      v-menu(bottom, right)
        template(v-slot:activator="{ on, attrs }")
          v-btn(outlined, color="grey darken-2", v-bind="attrs", v-on="on")
            span {{ typeToLabel[type] }}
            v-icon(right) $mdi-chevron-down
        v-list
          v-list-item(@click="type = 'day'")
            v-list-item-title Jour
          v-list-item(@click="type = 'week'")
            v-list-item-title Semaine
          v-list-item(@click="type = 'month'")
            v-list-item-title Mois
          v-list-item(@click="type = '4day'")
            v-list-item-title 4 Jours
  v-sheet(height="600")
    v-calendar(
      ref="calendar",
      event-more-text="Voir plus",
      v-model="focus",
      @click:more="viewDay",
      @click:event="showEvent",
      :event-color="getEventColor",
      @click:date="viewDay",
      @change='fetchEvents'
      locale="fr-FR",
      :events="events",
      :type="type"
    )
    v-menu(
      v-model="selectedOpen",
      :close-on-content-click="true",
      :activator="selectedElement",
      offset-x
    )
      v-card(color="grey lighten-4", min-width="350px", flat)
        v-toolbar(:color="selectedEvent.color", dark)
          v-toolbar-title
            span {{ selectedEvent.name }} - {{ selectedEvent.provider }}
        v-card-text.pb-0(v-if="selectedEvent.isWorkshop")
          .title {{ selectedEvent.fullEvent.workshop.description }}
        v-card-text.pb-0(v-if="$store.state.auth.user.isUser && selectedEvent.fullEvent && selectedEvent.pastAttendee")
          span Lien du cours : {{ selectedEvent.fullEvent.workshop.userSupport }}
        v-card-text.pb-0
          .title {{ selectedEvent.nbParticipant }} inscrit{{ selectedEvent.nbParticipant > 1 ? 's' : '' }} sur {{ selectedEvent.nbMax }} places
        v-card-text(v-if="selectedEvent.isWorkshop")
          span Prix : {{ selectedEvent.price }}€
        v-card-text(v-if="selectedEvent.isWorkshop")
          span Lieu : {{ selectedEvent.provider }}
        v-card-actions
          v-btn(text, color="secondary", @click="selectedOpen = false") Fermer
          v-spacer
          v-btn(
            color="primary",
            v-if="isUSer && !selectedEvent.isRegistred && selectedEvent.isWorkshop && new Date(selectedEvent.start) >= new Date()",
            @click="$emit('subscribe', selectedEvent)",
            :disabled="selectedEvent.nbParticipant >= selectedEvent.nbMax"
          ) S'inscrire
          v-btn(
            color="primary",
            v-if="isAdmin",
            @click="dialogFormEventUpdate = !dialogFormEventUpdate"
          ) Modifier
          v-btn(
            color="primary",
            v-if="isAdmin",
            @click="openParticipantsList(selectedEvent)"
          ) Participants
    AdmPlangEventForm(
      v-if="dialogFormEventUpdate"
      isUpdate
      :event="selectedEvent"
      @close-event-form="closeEventForm()"
    )
  v-row.pt-2(v-if="isAdmin")
    v-btn.mx-2(
      bottom,
      dark,
      color="primary",
      @click="dialogFormEventAdd = !dialogFormEventAdd"
    ) Ajouter un Evenement
  v-row.pt-2(justify="center")
    v-avatar(size="24", color="blue")
    span Distribution
    v-avatar.ml-2(size="24", color="primary")
    span Ateliers
    v-avatar.ml-2(size="24", color="secondary")
    span Culture
  AdmPlangEventForm(
    v-if="dialogFormEventAdd"
    isNewEvent
    @close-event-form="closeEventForm()"
  )
  AdmPlangParticipantsList(:isOpenparticipantList="isOpenparticipantList" :participants="participants" @close-modal="isOpenparticipantList = false")
</template>

<script>
import { eventsService, participationsService } from '@/api'
import { setEventsFromRaw } from '@/utils/planningHandler'
export default {
  data: () => ({
    type: 'month',
    typeToLabel: {
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      '4day': '4 Jour'
    },
    dialogFormEventUpdate: false,
    dialogFormEventAdd: false,
    focus: '',
    isCalendar: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    participants: [],
    isOpenparticipantList: false,
    events: []
  }),
  computed: {
    isUSer () {
      if (this.$store.state.auth.user.rank === 'user') {
        return true
      }
      return false
    },
    isKulteur () {
      if (this.$store.state.auth.user.rank === 'kulteur') {
        return true
      }
      return false
    },
    isAdmin () {
      if (this.$store.state.auth.user.rank === 'admin') {
        return true
      }
      return false
    }
  },
  async mounted () {
    this.$refs.calendar.checkChange()
    if (this.$refs.calendar) {
      this.isCalendar = true
    }
  },
  methods: {
    async fetchEvents ({ start, end }) {
      const firstDay = new Date(start.date)
      const lastDay = new Date(end.date)
      if (this.type === 'day') {
        firstDay.setDate(firstDay.getDate() - 1)
      }
      const query = { $limit: 300, startAt: { $gte: firstDay, $lte: lastDay } } // TODO add infinite loader for viewing more results
      if (this.$store.state.auth.user.isAdmin) {
        Object.assign(query, {
          pdtProviderId: this.$store.state.admin.providers.filter(
            ({ isSite }) => isSite
          ).map(x => x.id)
        })
      } else if (this.$store.state.auth.user.isKulteur) {
        Object.assign(query, { pdtProviderId: this.$store.state.auth.user.pdtProviderId })
      } else if (this.$store.state.auth.user.isUser) {
        Object.assign(query, { pdtProviderId: this.$store.state.auth.user.pdtProviderId, role: ['Reception', 'Atelier'] })
      }
      const { data } = await eventsService.find({ query })
      this.events = setEventsFromRaw(data, this.$store.state.auth.user.userId, this.$store.state.auth.user.rank)
    },
    async updateAttendee (item) {
      try {
        await participationsService.patch(item.participationId, { emargement: !item.emargement })
        item.emargement = !item.emargement
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    closeEventForm () {
      if (this.dialogFormEventUpdate) {
        this.dialogFormEventUpdate = !this.dialogFormEventUpdate
      }
      if (this.dialogFormEventAdd) {
        this.dialogFormEventAdd = !this.dialogFormEventAdd
      }
      this.$emit('update-events')
    },
    getEventColor (event) {
      if (event && event.color) {
        return event.color
      }
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
      this.$refs.calendar.scrollToTime('08:00')
    },
    setToday () {
      this.focus = ''
      this.type = 'day'
      this.$refs.calendar.scrollToTime('08:00')
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          this.selectedOpen = true
        }, 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    updateShowEvent () {
      if (this.selectedElement) {
        const newSelected = this.events.filter(
          item =>
            item.fullEvent.eventId === this.selectedEvent.fullEvent.eventId
        )
        if (newSelected.length > 0) {
          this.selectedEvent = newSelected[0]
        } else {
          this.selectedOpen = false
        }
      }
    },
    openParticipantsList (e) {
      this.participants = e.participations
      this.isOpenparticipantList = true
    }
  }
}
</script>
