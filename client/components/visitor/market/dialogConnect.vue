<template lang="pug">
  v-dialog(v-model="isOpenModal" :max-width="$vuetify.breakpoint.name === 'lg' ? '30vw' : '65vw'")
    v-card
      v-card-title.word-break-normal Vous devez être identifié pour pouvoir profiter {{goTo}}
      v-card-text Voulez-vous créer votre compte Kanopé ?
      v-card-actions
        v-spacer
        v-btn.ma-2(outlined color="secondary" @click="$emit('close-modal')") Non
        v-btn.ma-2(outlined color="primary" to="/register" @click="$emit('close-modal')") Oui
        v-btn.ma-2(outlined color="primary" to='/login' @click="$emit('close-modal')") J'en ai un !
</template>

<script>
export default {
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    },
    goTo: {
      type: String,
      default: 'du marché'
    }
  },
  data () {
    return {
      // displayDialog: true
    }
  }
}
</script>
