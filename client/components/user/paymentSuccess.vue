<template lang="pug">
  v-card
    v-card-title
      v-spacer
      span.headline.text-center Merci {{ $store.state.auth.user.firstname }} !
      v-spacer
    v-card-text.text-center.mt-3
      .title.test Votre commande a bien été enregistrée.
      .title.test(v-if='paidWithRefund') Montant automatiquement payé grâce aux avoirs précédents.
    v-card-actions
      v-spacer
      v-btn(color='primary' small @click="$emit('close')" rounded) fermer
      v-spacer
    v-card-actions
      v-img(src='/traitperma.png')
</template>

<script>
export default {
  props: {
    paidWithRefund: {
      type: Boolean,
      default: false
    }
  }
}
</script>
