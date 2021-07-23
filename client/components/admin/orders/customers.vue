<template lang="pug">
  v-card.box-border
    v-card-title Commande Konsommateurs
      v-spacer
      v-text-field(
        v-model="search"
        append-icon="$mdi-magnify"
        label="Rechercher"
        single-line
        hide-details
      )
      v-spacer
      v-btn(right color="primary" @click="generateOrders" small :disabled="orders.length === 0" :loading="loading") Créer les reçus
    v-data-table(:headers='headers'
      :loading="loading"
      :items='orders' align='center' dense  no-data-text="Aucune commande en cours"
      single-select
      :search="search"
      v-model="selected"
      :items-per-page="orders.length"
      :footer-props={
        itemsPerPageText: 'Item par page',
        itemsPerPageOptions: [-1, 10, 25, 50],
        prevIcon: '$mdi-chevron-left',
        nextIcon: '$mdi-chevron-right'
      }
      @click:row='emitRowClicked'
      select-icon='$mdi-chevron-down'
      :header-props={
        sortIcon: '$mdi-arrow-up',
        sortByText:'Filtrer par'
      }
      show-select)
      template(v-slot:item.data-table-select="{ isSelected }")
        v-icon(v-if='isSelected' color='primary') $mdi-checkbox-marked-circle
        v-icon(v-else color='primary') $mdi-checkbox-blank-circle-outline
      template(v-slot:item.dateOrder="{ item }")
        span {{ new Date(item.created * 1000).toLocaleString()}}
      template(v-slot:item.providerUser="{ item }")
        span {{ showSiteName(item) }}
      template(v-slot:item.priceTotalTTC="{ item }")
        span {{ showPrice(item) }}
</template>

<script>
import { createInvoiceReceiptOrders } from '@/utils/invoice/receiptOrders'
import { orderInfoService } from '@/api'
export default {
  props: {
    orders: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      search: '',
      selected: [],
      headers: [
        {
          text: 'Nom Prénom',
          align: 'center',
          value: 'customer_name'
        },
        { text: 'Date de commande', value: 'dateOrder', align: 'center' },
        { text: 'Site', value: 'providerUser', align: 'center' },
        { text: 'Numéro de commande', value: 'number', align: 'center' },
        {
          text: 'Prix total de la commande (€)',
          value: 'priceTotalTTC',
          align: 'center'
        }
      ],
      loading: false
    }
  },
  methods: {
    emitRowClicked (row) {
      if (this.selected.length > 0 && row.id === this.selected[0].id) {
        this.selected = []
      } else {
        this.selected = [row]
      }
      this.$emit(
        'row-clicked',
        this.selected.length > 0 ? this.selected[0] : null
      )
    },
    showPrice (item) {
      let price = (item.amount_due / 100).toFixed(2)
      if (item.discount) {
        price += item.discount.coupon.percent_off
          ? ` (${item.discount.coupon.percent_off} % réduction)`
          : ` (${item.discount.coupon.amount_off} € réduction)`
      } else if (item.amount_due < item.total) {
        price += ` (avoir de ${(item.total - item.amount_due) / 100} €)`
      }
      return price
    },
    showSiteName (item) {
      let siteName = item.metadata.pdtProviderId
      if (item.custom_fields && item.custom_fields[0]) {
        siteName = item.custom_fields[0].value
      }
      return siteName
    },
    async generateOrders () {
      this.loading = true
      for (let index = 0; index < this.orders.length; index++) {
        const { lines, id } = this.orders[index]
        if (lines.total_count !== lines.data.length) {
          lines.data = await orderInfoService.get(id)
        }
      }
      const pdf = createInvoiceReceiptOrders(this.orders)
      pdf.open()
      this.loading = false
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
.box-boder:hover {
  cursor: pointer;
}
</style>
