<template lang="pug">
  v-card.box-border
    v-card-title Commande fournisseurs
      v-spacer
      span(v-if="$store.state.admin.selectedMarket.ordered" class="secondary--text") Attention commande déja traitée !
      v-spacer
      v-btn(right color="primary" @click="createProviderOrder" small
        :disabled="orders.length === 0 || new Date() < new Date($store.state.admin.selectedMarket.closing)"
        :loading="loading" v-if="!$store.state.admin.selectedMarket.ordered") Créer les bons de commandes
      v-btn(right color="secondary" @click="regenerateOrder" small
        :disabled="orders.length === 0 || new Date() < new Date($store.state.admin.selectedMarket.closing)"
        :loading="loading" v-else) Supprimer les bons de commandes précédents et en regénérer
    v-data-table(
      :headers="headers"
      :items="$store.state.order.ordersProviders"
      :items-per-page="$store.state.order.ordersProviders.length"
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
    ).table
      template(v-slot:body="{ items }")
        tbody(v-for="order in items" :key="order.id")
          AdmOrdrProvider(:order="order")
</template>

<script>
import { createInvoiceProvider } from '@/utils/invoice/providerOrders'
import { orderProvidersService, marketService } from '@/api'

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
        { text: 'Références kanopée' },
        { text: 'Info références' },
        { text: 'Cdtnmt' },
        { text: 'Qté' },
        { text: 'Stock' },
        { text: 'Unité' },
        { text: 'Convertion en %' },
        { text: 'Prix (€)' },
        { text: 'Nombre de colis' },
        { text: 'Qté total' },
        { text: 'Prix total (€)' }
      ],
      loading: false,
      step: 1
    }
  },
  methods: {
    generateOrders () {
      this.loading = true
      const uniqueProvider = new Map()
      this.$store.state.order.ordersToGenerate.forEach(order => {
        if (uniqueProvider.has(order.reference.pdtProviderId)) {
          const orderSite = uniqueProvider.get(order.reference.pdtProviderId)
          orderSite.push(order)
        } else {
          uniqueProvider.set(order.reference.pdtProviderId, [order])
        }
      })
      uniqueProvider.forEach((orders, value) => {
        this.generatePDF(orders)
      })
    },
    generatePDF (orders) {
      const pdf = createInvoiceProvider(
        orders,
        this.$store.state.order.orderNum
      )
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
        for (
          let i = 0;
          i < this.$store.state.order.ordersToGenerate.length;
          i++
        ) {
          const order = this.$store.state.order.ordersToGenerate[i]
          await orderProvidersService.create({
            qty: order.qty,
            orderNum: this.$store.state.order.orderNum,
            buyPrice: order.price,
            pdtProviderId: order.reference.pdtProviderId,
            pdtReferenceId: order.reference.id,
            delivered: 0,
            marketId: this.$store.state.admin.selectedMarket.id
          })
        }
        await this.generateOrders()
        await this.updateStatusMarket()
        this.$store.commit(
          'order/newOrderNum',
          this.$store.state.order.orderNum
        )
        this.$router.push('/admin/products')
      } catch (error) {
        this.$store.commit('notif/sendAlert', "Une erreur est survenue lors de l'enregistrement de la commande")
      }
    },
    async regenerateOrder () {
      try {
        await orderProvidersService.remove(null, { query: { marketId: this.$store.state.admin.selectedMarket.id } })
        await this.createProviderOrder()
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async updateStatusMarket () {
      try {
        await marketService.patch(this.$store.state.admin.selectedMarket.id, { ordered: true })
      } catch (e) {
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
.table {
  border-radius: $table-admin-border-radius !important;
}
</style>
