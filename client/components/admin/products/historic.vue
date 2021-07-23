<template lang="pug">
v-card(color='grey')
  AdmPdctAddNewProviderPrices.pt-0.pb-0(
    :history='history',
    v-if='product.isBio',
    @update-ref='() => $emit("update-product")'
    :isAloneRef='isAloneRef'
  )
  AdmPdctAddNewKulteurStocks.pt-0.pb-0(
    :history='history',
    v-else,
    @update-product='$emit("update-product")'
  )
</template>

<script>
export default {
  props: {
    history: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    },
    product: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    }
  },
  data () {
    return {
      updateKulteurStock: false,
      isAloneRef: this.product.referencesPdt.length === 1
    }
  },
  methods: {
    providers () {
      return this.$store.state.admin.providers.find(
        x => x.id === this.history.pdtProviderId
      )
    }
  }
}
</script>
