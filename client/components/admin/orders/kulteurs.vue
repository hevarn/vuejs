<template lang="pug">
v-card.box-border
  v-card-title Recolte Kanopee Kulteurs
    v-spacer
    v-card-actions
      v-btn(right color="primary" @click="generateOrders(); createProviderOrder()" small
        :disabled="orders.length === 0 || new Date() < new Date($store.state.admin.group.closing)"
        :loading="loading") Créer les bons de récoltes
      v-btn(right color="primary" @click="generateSummary()" small
        :disabled="new Date() < new Date($store.state.admin.group.closing)"
        :loading="loading") Créer les bons de préparation AB
  v-data-table(:headers="headers" :items="orders"
    :items-per-page="orders.length"
    dense no-data-text="Appuyer sur \"générer les commandes\" pour pouvoir créer votre bon de commande"
    :footer-props={
      itemsPerPageText: 'Item par page',
      itemsPerPageOptions: [-1, 10, 25, 50],
      prevIcon: '$mdi-chevron-left',
      nextIcon: '$mdi-chevron-right'
    }
    :header-props={
            sortIcon: '$mdi-arrow-up',
            sortByText:'Filtrer par'
          }
  )
</template>

<script>
import { createInvoiceKulteur } from '@/utils/invoice/harvestOrders'
import { orderProvidersService } from '@/api'

export default {
  props: {
    orders: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      headers: [
        {
          text: 'Site',
          align: 'start',
          value: 'siteName'
        },
        { text: 'Produits', value: 'description' },
        { text: 'Références kanopée', value: 'reference' },
        { text: 'Quantité', value: 'quantity' },
        { text: 'Unité', value: 'packaging' }
      ],
      loading: false
    }
  },
  methods: {
    generateOrders () {
      this.loading = true
      const uniqueSite = new Map()
      this.$store.state.order.ordersKulteur.forEach(order => {
        if (uniqueSite.has(order.idSite)) {
          const orderSite = uniqueSite.get(order.idSite)
          orderSite.push(order)
        } else {
          uniqueSite.set(order.idSite, [order])
        }
      })
      uniqueSite.forEach((orders, value) => {
        this.generatePDF(orders)
      })
    },
    generateSummary () {
      this.loading = true
      const uniqueSite = new Map()
      this.$store.state.order.providerProductSummary.forEach(order => {
        if (uniqueSite.has(order.idSite)) {
          const orderSite = uniqueSite.get(order.idSite)
          orderSite.push(order)
        } else {
          uniqueSite.set(order.idSite, [order])
        }
      })
      uniqueSite.forEach((orders, value) => {
        this.generatePDF(orders)
      })
    },
    generatePDF (orders) {
      const pdf = createInvoiceKulteur(orders)
      try {
        // Open PDF in new window blocked by browser
        pdf.open()
      } catch (e) {
        this.$store.commit('notif/sendAlert', "Votre navigateur bloque l'ouverture des popups. Merci d'autoriser l'ouverture de popup sur ce site")
      }
      this.loading = false
    },
    async createProviderOrder () {
      try {
        for (let i = 0; i < this.$store.state.order.ordersKulteur.length; i++) {
          const order = this.$store.state.order.ordersKulteur[i]
          await orderProvidersService.create({
            qty: order.quantity,
            orderNum: this.$store.state.order.orderNum,
            buyPrice: order.amount,
            pdtProviderId: Number(order.pdtProviderId),
            pdtReferenceId: order.favouriteRefId,
            delivered: 0,
            marketId: this.$store.state.admin.selectedMarket.id
          })
        }
        this.$store.commit(
          'order/newOrderNum',
          this.$store.state.order.orderNum
        )
      } catch (error) {
        this.$store.commit('notif/sendAlert')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-border {
  border: 2px $dark-green solid;
  border-radius: $table-admin-border-radius !important;
  padding: $table-admin-padding;
}
</style>
