<template lang="pug">
tr
  td
    v-select(
      :items='order.pdt_references',
      v-model='provider',
      item-text='providerReference',
      return-object,
      @change='updtateOrdersProviders',
      dense,
      append-icon='$mdi-chevron-down',
      single-line
    )
      template(v-slot:selection='referencesProvider') {{ referencesProvider.item.kanopeeReference }} - {{ referencesProvider.item.providerReference }} -
        v-tooltip(right, max-width='300px')
          template(v-slot:activator='{ on }')
            v-icon(
              v-if='referencesProvider.item.pdt_buyHistories && needAlert(referencesProvider)',
              color='secondary',
              v-on='on'
            ) $mdi-shield-alert
          p Cette référence n'est plus à jour depuis le {{ getCreatedDated(referencesProvider).toLocaleDateString() }}
      template(v-slot:item='referencesProvider') {{ referencesProvider.item.kanopeeReference }} - {{ referencesProvider.item.providerReference }} -
        v-tooltip(right, max-width='300px')
          template(v-slot:activator='{ on }')
            v-icon(
              v-if='referencesProvider.item.pdt_buyHistories && needAlert(referencesProvider)',
              color='secondary',
              v-on='on'
            ) $mdi-shield-alert
          p Cette référence n'est plus à jour depuis le {{ getCreatedDated(referencesProvider).toLocaleDateString() }}
  td {{ provider.infoRef }}
  td {{ provider.package }}
  td {{ order.quantity }}
  td {{order.disassemble ? `${Math.floor(order.actualStock / (order.disassemble/100))} ${order.sellUnity.providerName} (${order.actualStock})` : order.actualStock}}
  td {{ order.buyUnity.name }} {{ order.sellUnity ? `/ ${order.sellUnity.name}` : "" }}
  td {{ order.disassemble }}
  td
    v-select(
      :items='prices',
      v-model='price',
      dense,
      append-icon='$mdi-chevron-down'
    )
  td
    v-text-field(v-model='package', type='number', min='0')
  td {{ totalQty }}
  td {{ totalPrice }}
</template>
<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    }
  },
  data () {
    return {
      provider: {
        providerReference: '',
        infoRef: '',
        package: 0,
        pdt_buyHistories: []
      },
      price: 0,
      package: 0
    }
  },
  computed: {
    prices () {
      if (this.provider.pdt_buyHistories.length > 0) {
        const arrayPrices = this.provider.pdt_buyHistories[
          this.provider.pdt_buyHistories.length - 1
        ]
        return [
          arrayPrices.buyPrice1,
          arrayPrices.buyPrice2,
          arrayPrices.buyPrice3,
          arrayPrices.buyPrice4,
          arrayPrices.buyPrice5
        ].filter(price => price != null)
      } else {
        return []
      }
    },
    packaging () {
      if (this.provider.pdt_provider) {
        return [
          this.provider.pdt_provider.packaging1,
          this.provider.pdt_provider.packaging2,
          this.provider.pdt_provider.packaging3,
          this.provider.pdt_provider.packaging4,
          this.provider.pdt_provider.packaging5
        ].filter(price => price != null)
      } else {
        return []
      }
    },
    totalPrice () {
      return (this.totalQty * this.price).toFixed(2)
    },
    totalQty () {
      return Number(this.provider.package) * this.package
    }
  },
  watch: {
    'provider.package' () {
      this.computePackage()
      this.computePrice()
    },
    'order.quantity' () {
      this.computePackage()
    },
    package () {
      this.computePrice()
    },
    totalQty () {
      this.updtateOrdersProviders()
    },
    totalPrice () {
      this.updtateOrdersProviders()
    },
    prices () {
      this.computePrice()
    }
  },
  async mounted () {
    this.provider = this.order.pdt_references.find(
      ({ id }) => id === this.order.favouriteRefId
    )
  },
  methods: {
    updtateOrdersProviders () {
      if (this.totalQty >= 0) {
        this.$store.commit('order/changeProvider', {
          id: this.order.id,
          reference: this.provider,
          qty: this.totalQty,
          unity: this.order.buyUnity.name,
          price: this.totalPrice,
          colis: this.package
        })
      }
    },
    computePrice () {
      this.price = this.prices[
        this.packaging.findIndex(numPackage => numPackage >= this.package)
      ]
      if (this.price === undefined) {
        this.price = this.prices[this.prices.length - 1]
      }
    },
    computePackage () {
      this.package =
        Math.ceil(
          (this.order.quantity - Number(this.order.actualStock)) /
            this.provider.package
        ) > 0
          ? Math.ceil(
              (this.order.quantity * (0 + this.order.disassemble / 100 || 1) -
                Number(this.order.actualStock)) /
                this.provider.package
            )
          : 0
    },
    needAlert (referencesProvider) {
      const msByDay = 86400 * 1000 // one day in milliseconds
      let needAlert = false
      const createdDate = this.getCreatedDated(referencesProvider)
      if (createdDate.getTime() < new Date().getTime() - msByDay) {
        needAlert = true
      }
      return needAlert
    },
    getCreatedDated (referencesProvider) {
      return new Date(
        referencesProvider.item.pdt_buyHistories
          .slice()
          .sort((a, b) => b.id - a.id)[0].createdAt
      )
    }
  }
}
</script>
<style scoped>
td {
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
.theme--light.v-select .v-select__selection--comma {
  font-size: 20px !important;
}
</style>
