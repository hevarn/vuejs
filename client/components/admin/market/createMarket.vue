<template lang="pug">
  v-card
    v-card-title Création des Groupements de marchés
    v-card-text Liste des derniers marchés
      v-row
        v-col(cols="12" sm="6" md="4" lg="3" xl="2" v-for="market in marketsList" :key="market.id" elevation="8")
          v-card(elevation="8" height="400px")
            v-card-title(class="primary--text accent") {{market.name}}
              v-spacer
              v-icon(:color="statusMarket(market).color" :title="statusMarket(market).value") $mdi-circle
            v-card-text
              p {{market.description}}
              p Du {{new Date (market.opening).toLocaleString()}}
              p Au {{new Date (market.closing).toLocaleString()}}
              v-row
                v-card(height="154px" elevation="0")
                  v-card-text
                    h5 Sites :
                    span(v-for="{pdt_provider} in market.marketEvents") {{pdt_provider.name}} -
            v-card-Actions(class="grey")
              v-btn(icon color="primary" @click="confirmDelete(market)")
                v-icon $mdi-trash-can-outline
              v-btn(icon color="secondary" @click="() => $emit('next-step', market)")
                v-icon $mdi-pencil-outline
              v-spacer
              div.switcher
                v-switch(color="primary" inset dense title='Le marché ne doit être fermé uniquement en cas de problème !'
                v-model="market.isOpen" @click="confirmChangeStatus(market)")
        v-col(cols="12" sm="6" md="4" lg="3" xl="2")
          v-card(elevation="8" height="400px")
            v-card-title(class="primary--text accent") Ajouter un marché
            v-card-text
              p Créer mon prochain marché
              v-text-field(v-model="newMarket.name" label="nom du marché")
              v-text-field(v-model="newMarket.description" label="description du marché")
            v-card-Actions.mt-2
              v-spacer
              v-btn(icon x-large color="accent" elevation="8" fab @click="() => $emit('next-step', newMarket)" :disabled="!newMarket.description && !newMarket.name")
                v-icon $mdi-pencil-outline
            v-card-Actions(class="grey")
              v-btn(icon color="primary" disabled)
                v-icon $mdi-trash-can-outline
              v-btn(icon color="secondary" disabled)
                v-icon $mdi-pencil-outline
              v-spacer
              div.switcher
                v-switch(color="primary" inset dense)
    AdmMarkConfirmMarket(
      :isConfirmDialog="isConfirmDialog"
      @close-confirm-dialog="isConfirmDialog = false, isDeletingMarket = false, isClosingMarket = false"
      :market="selectedMarket"
      :isClosingMarket="isClosingMarket"
      :isDeletingMarket="isDeletingMarket"
      @delete-market="$emit('delete-market', selectedMarket.id)"
      @close-market="$emit('change-status', selectedMarket)"
      @cancel-update-status="selectedMarket.isOpen = !selectedMarket.isOpen"
    )
</template>

<script>
export default {
  props: {
    marketsList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      newMarket: {
        name: '',
        description: '',
        isOpen: true,
        minAmount: 15
      },
      isConfirmDialog: false,
      selectedMarket: {},
      isClosingMarket: false,
      isDeletingMarket: false
    }
  },
  methods: {
    statusMarket ({ opening, closing, isOpen }) {
      const status = {
        color: 'white',
        value: 'Ouverture prochaine'
      }
      const thisDay = new Date()
      if (new Date(opening) < thisDay && thisDay < new Date(closing) && isOpen) {
        status.color = 'green'
        status.value = 'en cours'
      } else if (thisDay > new Date(closing)) {
        status.color = 'red'
        status.value = 'terminé'
      } else if (!isOpen) {
        status.color = 'red'
        status.value = 'fermé par l\'administrateur'
      }
      return status
    },
    confirmChangeStatus (market) {
      this.selectedMarket = market
      this.isConfirmDialog = true
      this.isClosingMarket = true
    // this.$emit('change-status', market)
    },
    confirmDelete (market) {
      this.selectedMarket = market
      this.isDeletingMarket = true
      this.isConfirmDialog = true
    }
  }
}
</script>

<style scoped>
  .switcher {
    height: 36px;
  }
  .v-input--selection-controls {
    margin: 4px;
  }
</style>
