<template lang="pug">
v-container(fluid class="overflow-y-auto" class='overFlow'  style="overflow-y: scroll; -webkit-overflow-scrolling: touch;")
  v-row(dense v-if='$store.state.cart.cart.length > 0')
    v-col(cols="12")
      v-card(rounded outlined v-for='(item, i) in $store.state.cart.cart' :key='i').elevation-1.mb-1
        div(class="d-flex flex-no-wrap justify-space-between")
          div
            v-card-title(class="subtitle-1").text-left.capitalize #[strong {{ item.kind }} {{ item.variety }} ]
            v-card-subtitle.text-left {{ item.lastSellPrice}} € /  {{ item.unity }}
          v-avatar(v-if='item.isBio' size="80"  class="ma-3" )
            v-img(:src="item.picture" contain)
          v-tooltip(bottom v-else  class="ma-3" )
            template(v-slot:activator="{ on }")
              v-badge(overlap avatar color='white' offset-x=30 offset-y=25)
                template(v-slot:badge)
                  v-icon(small color='error') $mdi-alarm
                v-avatar( v-on="on" class="ma-3" size="80")
                  v-img(:src="item.picture" contain)
            span Ce produit a un stock limité, n'oubliez pas de valider votre panier pour le réserver
        v-card-actions
          v-card(flat outlined)
            v-btn(text small @click='setQuantity(item, -1)' :loading='loadingAdd' :disabled='loadingAdd').title -
            span {{ item.qty }}
            v-btn(text small @click='setQuantity(item, +1)' :loading='loadingAdd' :disabled='loadingAdd').title +
          v-spacer
          span {{item.priceTotalTTC}} €
          v-spacer
          v-btn(fab small icon color="primary" @click="removeItem(item)" :loading="loadingRemove")
            v-icon $mdi-trash-can-outline
  v-row(v-else)
    v-col(cols="12")
      h1 Votre panier est vide...
    v-col(cols="12")
      v-img(src='/sadplant.png' height='250px' contain)
    v-col(cols="12")
      v-btn(v-if='$route.path.includes("/user/items")' to='/user/orders' text class='primary' rounded) Anciennes commandes
      v-btn(v-else to='/user/items' text class='primary' rounded) Faire mon marché
</template>

<script>

export default {
  data () {
    return {
      loadingAdd: false,
      loadingRemove: false
    }
  },
  methods: {
    async setQuantity (product, quantityToAdd) {
      this.loadingAdd = true
      try {
        await this.$store.dispatch('cart/addProduct', {
          product,
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

<style scoped>
.capitalize {
  text-transform: capitalize;
  word-break: normal;
}
.overFlow::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 8px;
}

.overFlow::-webkit-scrollbar-track {
  background-color: rgba(57, 57, 57, 0.6);
  border-radius: 8px;
}

.overFlow::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(156, 156, 156, 0.6);
}
</style>
