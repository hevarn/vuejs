<template lang="pug">
  v-card
    v-card-title Ajout des sites aux groupement de marchés {{market.name}}
    v-card-text
      v-autocomplete(chips clearable multiple v-model="selectedSite" :items="providers" label='Ajouter un ou des site(s)'
      append-icon="$mdi-plus" item-value="id" item-text="name" color="primary")
    v-card-actions
      v-spacer
      v-btn(color="secondary" @click="() => $emit('previous-step')") Retour
      v-btn(color="primary" @click="addParticipations" :disabled='selectedSite.length === 0') Valider mon marché
</template>

<script>
import { marketEventsService } from '@/api'
export default {
  props: {
    market: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      selectedSite: [],
      lastParticipants: []
    }
  },
  computed: {
    providers () {
      return this.$store.state.admin.providersBG.filter(x => x.isSite)
    }
  },
  watch: {
    market () {
      if (this.market.marketEvents && this.market.marketEvents.length) {
        this.selectedSite = this.market.marketEvents.map(x => x.pdt_provider.id)
        this.lastParticipants = this.market.marketEvents
      }
    }
  },
  methods: {
    async addParticipations () {
      const participations = []
      if (this.selectedSite.length) {
        this.selectedSite.forEach(id => {
          if (!this.lastParticipants.find(x => x.pdt_provider.id === id)) {
            // remove doublons
            participations.push({
              pdtProviderId: id,
              marketId: this.market.id
            })
          }
        })
        try {
          await marketEventsService.create(participations)
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      }
      this.removeLastParticipations()
      this.$emit('next-step')
    },
    async removeLastParticipations () {
      if (this.lastParticipants.length) {
        this.lastParticipants.forEach(async participation => {
          if (!this.selectedSite.find(id => id === participation.pdtProviderId)) {
            try {
              await marketEventsService.remove(participation.id)
            } catch (e) {
              this.$store.commit('notif/sendAlert')
            }
          }
        })
      }
    }
  }
}
</script>
