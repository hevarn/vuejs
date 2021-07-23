<template lang="pug">
  v-card
    v-card-title
      span.headline Paiement
    v-card-text
      v-spacer
      span Si vous n'êtes pas redirigé(e) automatiquement, cliquez ci-dessous
    v-card-actions
      v-spacer
      v-btn(text outlined color='grey' @click='$emit("close")').white--text Fermer
      v-btn(text outlined color="green" :href="href" target="_blank").confirm
        span Payer
      v-spacer
    v-card-actions
      v-img(src='/traitperma.png')
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.confirm.theme--light.v-btn.v-btn--outlined.v-btn--text {
  border-color: green;
}
</style>
