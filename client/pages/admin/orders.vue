<template lang="pug">
  v-container(fluid).silver
    v-row(justify="center")
      v-col.col-12.col-sm-6.col-md-6.col-lg-3(align-self="center")
        AdmUtlsSelectGroup(fromOrdersPage)
    v-row(justify="center" v-if="$store.state.admin.group.id")
      v-col.col-12.col-sm-6.col-md-6.col-lg-3(align-self="center")
        AdmUtlsSelectMarket(@fetch-orders="fetchOrders(); fetchLastOrders()" fetchOrders fetchIgnoreNextMarket)
    SmallLoading.mb-2(v-if="loading")
    v-row(justify="center")
      v-col.col-12.col-md-7
        AdmOrdrCustomers(:orders="clientOrders" @row-clicked='setInvoiceDetail')
      v-col.col-12.col-md-5(v-if='invoiceDetails.length > 0')
        v-card.box-border
          v-card-title
          v-data-table(:items='invoiceDetails' dense
            :loading='loadingDetails'
            :items-per-page="invoiceDetails.length"
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
            :headers='headersLines')
            template(v-slot:item.imageURL="{ item }").mt-3
              v-avatar(size=38)
                v-img(:src="item.metadata.imageURL")
            template(v-slot:item.quantity="{ item }")
              span {{item.quantity}} {{item.metadata.packaging}}
            template(v-slot:item.unitPrice="{ item }")
              span {{(item.price.unit_amount / 100).toFixed(2) }}
            template(v-slot:item.totalPrice="{ item }")
              span  {{(item.price.unit_amount * item.quantity / 100).toFixed(2) }}
    v-row(justify="center")
      v-btn.ma-2(@click="generateOrders" color="primary" :disabled="clientOrders.length === 0" :loading='loading') Générer les commandes
    v-row(justify="center" v-if='$store.state.order.ordersKulteur.length > 0 || $store.state.order.ordersProviders.length > 0')
      v-col.col-12.col-md-11
        AdmOrdrKulteurs(:orders="$store.state.order.ordersKulteur")
    v-row(justify="center" v-if='$store.state.order.ordersKulteur.length > 0 || $store.state.order.ordersProviders.length > 0')
      v-col.col-12.col-md-11
        AdmOrdrProviders(:orders="$store.state.order.ordersProviders")
    v-row(justify="center")
      v-col.col-12.col-md-11
        AdmOrdrProvidersOrders(:orders="lastOrders")
</template>

<script>
import { orderProvidersService, paymentService, orderInfoService } from '@/api'
import { formatDate } from '@/utils/date'

export default {
  data () {
    return {
      lastOrders: [],
      clientOrders: [],
      loading: false,
      headersLines: [
        { text: '', value: 'imageURL', align: 'start', sortable: false },
        { text: 'Nom du produit', value: 'description', align: 'center', sortable: false },
        { text: 'Qté commandée', value: 'quantity', align: 'center' },
        { text: 'PU (€)', value: 'unitPrice', align: 'center' },
        { text: 'Total (€)', value: 'totalPrice', align: 'center' }
      ],
      invoiceDetails: [],
      loadingDetails: false
    }
  },
  mounted () {
    // this.fetchOrders()
    this.fetchLastOrders()
  },
  methods: {
    async generateOrders () {
      this.loading = true
      await this.$store.dispatch('order/generateOrders', {
        gte: new Date(this.$store.state.admin.selectedMarket.opening).getTime() / 1000,
        lte: new Date(this.$store.state.admin.selectedMarket.closing).getTime() / 1000
      })
      this.loading = false
    },
    async setInvoiceDetail (item) {
      this.loadingDetails = true
      if (item) {
        const { id, lines } = item
        if (lines.total_count !== lines.data.length) {
          this.invoiceDetails = await orderInfoService.get(id)
        } else {
          this.invoiceDetails = lines.data
        }
        this.loadingDetails = false
      } else {
        this.invoiceDetails = []
      }
      this.loadingDetails = false
    },
    async fetchOrders () {
      this.loading = true
      if (this.$store.state.admin.group.id && this.$store.state.admin.selectedMarket) {
        try {
          this.clientOrders = await paymentService.find({
            query: {
              status: 'paid',
              created: {
                gte: new Date(this.$store.state.admin.selectedMarket.opening).getTime() / 1000,
                lte: new Date(this.$store.state.admin.selectedMarket.closing).getTime() / 1000
              },
              marketId: this.$store.state.admin.selectedMarket.id
            }
          })
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      }
      this.loading = false
    },
    async fetchLastOrders () {
      try {
        const { data } = await orderProvidersService.find({ query: { $sort: { orderNum: -1 }, full: true } })
        if (data.length > 0) {
          this.lastOrders = this.changeDate(data)
          this.$store.commit('order/newOrderNum', data[0].orderNum)
        }
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    changeDate (data) {
      return data.map(order => {
        order.date = formatDate(order.createdAt)
        return order
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .silver {
    background-color: $background-color-table
  }
  .box-border{
    border: 2px $dark-green solid;
    border-radius: $table-admin-border-radius !important;
    padding: 1px;
  }
</style>
