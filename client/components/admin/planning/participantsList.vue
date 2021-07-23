<template lang="pug">
  v-dialog(v-model="isOpenparticipantList" @click:outside="$emit('close-modal')")
    v-card
      v-card-title Liste des participants à l'atelier
      v-card-text
        v-data-table(
          :headers="headers",
          :items="participants"
          loader-height="50"
          color="#010101"
          :items-per-page="participants.length"
          :footer-props={
            itemsPerPageText: 'Participants par page',
            itemsPerPageOptions: [-1, 10, 25, 50],
            prevIcon: '$mdi-chevron-left',
            nextIcon: '$mdi-chevron-right'
          }
          :header-props={
            sortIcon: '$mdi-arrow-up',
            sortByText:'Filtrer par'
          }
        )
          template(v-slot:item.isPresent="{ item }")
            v-simple-checkbox(
              v-model="item.isPresent"
              off-icon= '$mdi-checkbox-blank-outline'
              on-icon= '$mdi-checkbox-marked'
              color="primary"
            )
      v-card-actions
        v-spacer
        v-btn(color="secondary" @click="$emit('close-modal')") Annuler
        v-btn(color="primary" @click="sortParticipants") Valider
</template>

<script>
import { participationsService } from '@/api'
export default {
  props: {
    isOpenparticipantList: {
      type: Boolean,
      default: false
    },
    participants: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      headers: [
        { text: 'Prénom', value: 'user.firstname' },
        { text: 'Nom', value: 'user.lastname' },
        { text: 'Mail', value: 'user.email' },
        { text: 'Tel', value: 'user.tel' },
        { text: 'Présent', value: 'isPresent' }
      ]
    }
  },
  methods: {
    async udpdatePresentsList (participantsID, isPresent) {
      if (participantsID.length) {
        try {
          await participationsService.patch(
            null,
            { isPresent },
            { query: { participationId: { $in: participantsID } } }
          )
          this.$store.commit('notif/sendSuccess', 'Liste mise à jour.')
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      }
      this.$emit('close-modal')
    },
    sortParticipants () {
      this.udpdatePresentsList(this.participants.filter(({ isPresent }) => isPresent).map(x => x.participationId), true)
      this.udpdatePresentsList(this.participants.filter(({ isPresent }) => !isPresent).map(x => x.participationId), false)
    }
  }
}
</script>
