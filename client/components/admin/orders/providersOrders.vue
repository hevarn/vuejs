<template lang="pug">
  v-card.box-border
    v-card-title Commande fournisseurs passées
    v-data-table(:headers="headers" :items="orders" dense no-data-text="Aucune commande passée trouvé"
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
          text: 'Bons de commandes',
          align: 'start',
          value: 'orderNum'
        },
        { text: 'Date de la commande', value: 'date' },
        { text: 'Fournisseur', value: 'pdt_reference.pdt_provider.name' },
        {
          text: 'Références fournisseurs',
          value: 'pdt_reference.providerReference'
        },
        { text: 'Info références', value: 'pdt_reference.infoRef' },
        { text: 'Cdtnmt', value: 'pdt_reference.package' },
        { text: 'Qté', value: 'qty' },
        { text: 'Unité', value: 'pdt_reference.pdt_product.buyUnity.name' },
        { text: "Prix d'achat", value: 'buyPrice' }
      ]
    }
  },
  computed: {
    fontSize () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.title = '18.4px'
          break
        case 'sm':
          result.title = '20px'
          break
        default:
          result.title = '20px'
          break
      }
      return {
        title: `font-size: ${result.title}`
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
