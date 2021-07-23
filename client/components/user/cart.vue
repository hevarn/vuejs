<template lang="pug">
  v-card.cart(max-height="80%")
    div.alertCart {{ $store.state.auth.user.timeMarketClosing}}
    v-row.mt-2(dense)
      v-col.col-2(align="center")
        span &nbsp;
      v-col.col-2(align="center")
        u Article
      v-col.col-2.px-0(align="center")
        u Quantité
      v-col.col-2(align="center")
        u PU
      v-col.col-2(align="center")
        u Total
      v-col.col-1(align="left")
        span &nbsp;
    .cartScroll
      v-row(v-for="(item, index) in cart" :key="index" dense)
        UserProductsCart(:item="item")
    v-divider
    v-row(justify="center" v-if="$store.state.cart.coupon")
      span(v-if="$store.state.cart.coupon.amount_off") Bon de réduction de: {{($store.state.cart.coupon.amount_off * 0.01).toFixed(2)}} €
      span(v-else) Bon de réduction de: {{$store.state.cart.coupon.percent_off}} %
      v-btn.ml-2(icon x-small color="primary" @click="removeCoupon")
        v-icon $mdi-close
    v-row(v-else justify="center")
      v-col.col-8
        v-text-field.ml-2(dense v-model="coupon" label="Bon de réduction")
      v-col.col-2(align-self="center")
        v-btn.mr-5(rounded small color="primary" @click="validCoupon" :loading="loadingCoupon" :disabled="coupon.length < 3") Ok
    v-divider
    h4(v-if="$store.state.cart.coupon") Montant avant réduction : {{ priceBeforeCoupon.toFixed(2) }} €
    h4.title Prix total TTC : {{ totalPrice.toFixed(2) }} €
    v-layout.mb-2(column align-center)
      v-row
        slot(name='bottom')
    div.alertCart A récupérer {{receptionProducts}} prochain
</template>

<script>
import { couponsStripeService } from '@/api'

export default {
  data () {
    return {
      coupon: '',
      loadingCoupon: false
    }
  },
  computed: {
    cart () {
      return this.$store.state.cart.cart
    },
    receptionProducts () {
      return new Date(
        this.$store.state.auth.user.openingDelivery
      ).toLocaleDateString('fr-FR', { weekday: 'long' })
    },
    isPaiementAvailable () {
      return this.$store.getters['cart/isPaiementAvailable']
    },
    priceBeforeCoupon () {
      return this.$store.getters['cart/priceBeforeCoupon']
    },
    totalPrice () {
      return this.$store.getters['cart/totalPrice']
    }
  },
  methods: {
    async removeCoupon () {
      try {
        await couponsStripeService.update(this.$store.state.cart.coupon.id, {
          coupon: null
        })
        this.$store.commit('cart/removeCoupon')
      } catch (e) {
        this.$store.commit('notif/sendAlert', "Le bon de réduction n'a pas pu être supprimé")
      }
    },
    async validCoupon () {
      this.loadingCoupon = true
      try {
        const response = await couponsStripeService.get(this.coupon)
        this.$store.commit('cart/addCoupon', response)
        this.$store.commit('notif/sendSuccess', 'Le bon de réduction a bien été pris en compte.')
      } catch (error) {
        this.$store.commit('notif/sendAlert', "Le bon de réduction entré n'est pas valide.")
      }
      this.loadingCoupon = false
      this.coupon = ''
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, .5);
  scrollbar-color: auto;
}

.rounded {
  border-radius: 30px !important;
}
.cartScroll {
  max-height: 500;
  overflow-x: hidden;
}
.cart {
  position: absolute;
  right: 0px;
  top: 100px;
  width: 40%;
  border: 2px solid #316827 !important;
  border-radius: 10px !important;
  background-color: white !important;
}

.alertCart {
  text-align: center;
  background-color: #316827;
  color: white;
  height: 30px;
  font-size: 1.1em;
  padding: 4px;
}

h4,
h1 {
  text-align: center;
}

@media screen and (max-width: 1100px) {
  .cart {
    position: fixed;
    margin: auto;
    top: 60px;
    width: 95%;
    left: 1%;
  }
  u {
    font-size: 0.8em;
  }
}
</style>
