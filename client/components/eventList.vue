<template lang="pug">
v-container
  v-row(justify="center")
    v-btn-toggle(
      v-model="toggleUser",
      rounded,
      class='primary--text'
    )
      v-btn Passées
      v-btn à venir
  v-row(justify="center" v-if="$store.state.auth.user.isUser && toggleUser==1")
    v-switch(v-model="switchBool" :label="switchText")
  v-row(dense, justify="center")
    v-col(cols="12", sm="6", md="8")
      v-card.mb-5(
        color="grey lighten-4",
        min-width="50px",
        flat,
        v-for="e in filteredList",
        :key="e.eventId"
      )
        v-toolbar(:color="e.color", dark, height="40px")
          v-toolbar-title(v-html="e.name")
        v-card-title(v-if="e.isWorkshop") {{ e.fullEvent.workshop.description }}
        v-card-text.pb-0(v-if="e.isWorkshop && e.fullEvent.role === 'Atelier' && !e.isRegistred")
          span Prix : {{ e.price }}€
        v-card-text.pb-0(v-if="e.isWorkshop && e.fullEvent.role === 'Atelier' && !e.isRegistred")
          span Lieu : {{ e.provider }}
        v-card-text.pb-0
          span Le {{ new Date(e.start).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }}
        v-card-text.pb-0
          span(v-if="e.fullEvent.role === 'Atelier'") {{ e.nbParticipant }} inscrit{{ e.nbParticipant > 1 ? 's' : '' }} sur {{ e.nbMax }} places
        v-row
          v-col.pb-0(cols="12", md="6")
            v-simple-table.ml-2(
              v-if="e.isWorkshop && e.fullEvent.workshop.pdfLink && (e.isRegistred || $store.state.auth.user.isKulteur || $store.state.auth.user.isAdmin)"
            )
              template(v-slot:default)
                thead
                  tr
                    th.text-left(style="height:25px") Liens Utiles
                tbody
                  tr(v-for="item in myMiscLink(e.fullEvent.workshop.pdfLink)")
                    td(style="height:15px" @click="goToSite(item)") {{ item }}
        v-card-actions
          v-btn(
            color="primary",
            v-if="$store.state.auth.user.isAdmin && new Date() <= new Date(e.start)",
            @click="(selectedEvent = e), (dialogFormEventUpdate = !dialogFormEventUpdate)"
          ) Modifier
          v-btn(
            color="primary",
            v-if="$store.state.auth.user.isUser && e.isWorkshop && new Date(e.start) >= new Date() && !e.isRegistred",
            @click="$emit('subscribe', e)",
            :disabled="e.nbParticipant >= e.nbMax"
          ) S'inscrire

          v-btn.pa-1.mx-2(
            color="primary",
            v-if="e.isWorkshop && ($store.state.auth.user.isKulteur || $store.state.auth.user.isAdmin)",
            @click="goToPDF(e.fullEvent.workshop.kulteurSupport)"
          ) Support PDF
          v-btn.pa-1.mx-2(
            color="primary",
            v-if="$store.state.auth.user.isUser && e.isWorkshop && e.isRegistred",
            @click="goToPDF(e.fullEvent.workshop.userSupport)"
          ) Support PDF
          v-btn.pa-1.mx-2(
            color="primary",
            v-if="$store.state.auth.user.isKulteur || $store.state.auth.user.isAdmin",
            @click="openParticipantsList(e)"
          ) Participants
          v-spacer
          v-img.hidden-md-and-down(max-width="400px" src="/traitperma.png")
  AdmPlangParticipantsList(:isOpenparticipantList="isOpenparticipantList" :participants="participants" @close-modal="isOpenparticipantList = false")

  AdmPlangEventForm(
    v-if="dialogFormEventUpdate",
    isUpdate,
    :event="selectedEvent",
    @close-event-form="closeEventForm()"
  )
</template>

<script>
export default {
  props: {
    events: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data: () => ({
    toggleUser: 1,
    miscLinks: [],
    dialogFormEventUpdate: false,
    selectedEvent: {},
    switchText: 'Événements où je suis inscrit',
    switchBool: false,
    isOpenparticipantList: false,
    participants: []

  }),
  computed: {
    filteredList () {
      return this.events.filter(item => {
        switch (this.toggleUser) {
          case 0: // evenement user passé
            if (this.$store.state.auth.user.isUser) {
              return item.isRegistred && new Date(item.start) < new Date()
            } else {
              return new Date(item.start) < new Date() && item.fullEvent.role
                .toLowerCase()
                .match(/atelier|entretien|culture/g)
            }
          case 1: // tout les evenement user à venir
            if (this.$store.state.auth.user.isUser && this.switchBool) {
              return new Date(item.start) >= new Date() && item.isRegistred
            } else if (this.$store.state.auth.user.isUser && !this.switchBool) {
              return (new Date(item.start) >= new Date() &&
                (item.fullEvent.role.toLowerCase().match('atelier') ||
                  item.isRegistred))
            } else {
              return new Date(item.start) >= new Date() && item.fullEvent.role
                .toLowerCase()
                .match(/atelier|entretien|culture/g)
            }
          default:
            // evenement user inscrit à venir
            return new Date(item.start) >= new Date() && item.isRegistred
        }
      })
    }
  },
  methods: {
    myMiscLink (item) {
      if (item) {
        return item.split(';')
      }
      return {}
    },
    goToPDF (link) {
      window.open(link, '_blank')
    },
    goToSite (link) {
      if (link.startsWith('http://')) {
        window.open(link, '_blank')
      } else {
        window.open(`http://${link}`, '_blank')
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
    openParticipantsList (e) {
      this.participants = e.participations
      this.isOpenparticipantList = true
    }
  }
}
</script>
