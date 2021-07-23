<template lang="pug">
  v-card
    v-card-title Ajout des horaires de récupération pour {{market.name}}
    v-card-text(v-for="event in market.marketEvents" :key="event.id")
      v-card-title Site de récupération à {{event.pdt_provider.name}}
      span {{event.pdt_provider.adress}}
      AdmUtlsInfoMarket(:provider="event.pdtProviderId" :marketEvent="event")
    v-card-actions
      v-spacer
      v-btn(color="secondary" @click="() => $emit('previous-step')") Retour
      v-btn(color="primary" @click="() => $emit('next-step')") Terminer
</template>

<script>
export default {
  props: {
    market: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
