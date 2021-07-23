<template lang="pug">
  v-row(dense justify-center)
    v-col.col-2(align-self="center" align="center")
      v-avatar(v-if='item.isBio')
        v-img(:src="item.picture")
      v-tooltip(bottom v-else)
        template(v-slot:activator="{ on }")
          v-badge(overlap avatar color='white')
            template(v-slot:badge)
              v-icon(small color='error') $mdi-alarm
            v-avatar( v-on="on")
              v-img(:src="item.picture")
        span Ce produit a un stock limité, n'oubliez pas de valider votre panier pour le réserver
    v-col.col-2(align="center" align-self="center")
      p(:style="textBody") {{item.kind}} {{item.variety}}
    v-col.col-1(align="center" align-self="center")
      span {{ qty }}
    v-col.col-1(align="center" align-self="center")
      v-btn(text outlined x-small @click='setQuantity(+1)' :loading='loadingAdd' :disabled='loadingAdd') +
      v-btn(text outlined x-small @click='setQuantity(-1)' :loading='loadingAdd' :disabled='loadingAdd') -
    v-col.col-2(align="center" align-self="center")
      span(:style="textBody") {{item.lastSellPrice}}€ /
      span(:style="textBody")   {{ item.sellUnity ? item.sellUnity : item.unity }}
    v-col.col-2(align="center" align-self="center")
      span(:style="textBody") {{item.priceTotalTTC}}€
    v-col.col-1(align="center" align-self="center")
      v-btn(fab icon color="primary" @click="removeItem(item)" :loading="loadingRemove")
        v-icon $mdi-trash-can-outline
</template>

<script>
import { textSize } from '@/utils/style'

export default {
  name: 'Products',
  props: {
    item: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    }
  },
  data () {
    return {
      loadingAdd: false,
      loadingRemove: false
    }
  },
  computed: {
    qty () {
      return this.item.qty
    },
    textBody () {
      return `font-size: ${textSize(this.$vuetify.breakpoint.name).body}em;`
    }
  },
  mounted () {
    if (!this.item.isBio && this.item.stock) {
      this.max = this.item.stock
    }
  },
  methods: {
    async setQuantity (quantityToAdd) {
      this.loadingAdd = true
      try {
        await this.$store.dispatch('cart/addProduct', {
          product: this.item,
          quantityToAdd
        })
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.loadingAdd = false
    },
    async removeItem (item) {
      this.loadingRemove = true
      try {
        await this.$store.dispatch('cart/removeProduct', item)
      } catch (error) {
        this.$store.commit('notif/sendAlert', "Erreur lors de la suppression du produit, si le problème persiste, veuillez contacter l'administrateur")
      }
      this.loadingRemove = false
    }
  }
}
</script>
