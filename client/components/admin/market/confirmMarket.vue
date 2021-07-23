<template lang="pug">
  v-dialog(v-model="isConfirmDialog" width=600 @click:outside="$emit('close-confirm-dialog')")
    v-card
      v-card-title Gestion du marché {{market.name}}
      v-container(v-if="isClosingMarket")
        v-card-text(v-if="market.isOpen") Voulez-vous ouvrir le marché  #[strong {{market.name}}] ?
        v-card-text(v-else) Voulez-vous fermer le marché pour le site #[strong {{market.name}}] ?
      v-container(v-if="isDeletingMarket")
        v-card-text Voulez-vous supprimer le marché  #[strong {{market.name}}] ?
      v-card-actions
        v-spacer
        v-btn(outlined color='secondary' @click="cancelAction") Annuler
        v-btn(outlined color='primary' @click="confirmAction") Oui
</template>

<script>
export default {
  props: {
    isConfirmDialog: {
      type: Boolean,
      default: false
    },
    market: {
      type: Object,
      default: () => {}
    },
    isClosingMarket: {
      type: Boolean,
      default: false
    },
    isDeletingMarket: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    confirmAction () {
      if (this.isClosingMarket) {
        this.$emit('close-market')
      }
      if (this.isDeletingMarket) {
        this.$emit('delete-market')
      }
      this.$emit('close-confirm-dialog')
    },
    cancelAction () {
      if (this.isClosingMarket) {
        this.$emit('cancel-update-status')
      }
      this.$emit('close-confirm-dialog')
    }
  }
}
</script>
