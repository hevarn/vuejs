<template lang="pug">
  v-container(fluid).silver
    v-row(no-gutters)
      v-container
        v-row
          AdmUtlSelectGroup.col-12.col.sm-6.col-md-4.col-lg-4(fromMercuPage @new-group="selectedProvider = null")
          v-select(v-model="selectedProvider"
          :items="$store.state.admin.providersBG.filter(x => !x.isSite)"
          item-text="name"
          return-object
          label="Sélectionnez votre fournisseur"
          outlined
          dense
          append-icon="$mdi-chevron-down"
          ).col-12.col.sm-6.col-md-4.col-lg-4.ml-md-2
          v-spacer
          v-btn(color='primary' to="/admin/products") Retour aux Produits
    LoadingKanopee(v-if="!selectedProvider")
    AdmPdctReferences(:provider="selectedProvider" v-if="selectedProvider" @fetchKanoppeRef="fetchKanoppeRef")
</template>
<script>
import { productsService } from '../../api'

export default {
  data () {
    return {
      selectedProvider: {}
    }
  },
  async mounted () {
    try {
      await this.$store.dispatch('admin/fetchSettings', 3)
      this.fetchKanoppeRef()
    } catch (e) {
      this.$store.commit('notif/sendAlert')
    }
  },
  methods: {
    async fetchKanoppeRef () {
      try {
        // fetch ref providers only
        const data = await productsService.find({
          query: {
            pdtDistanceId: { $gt: 1 },
            mercu: true
          }
        })
        this.$store.commit('products/addKanopeeRef', data)
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.silver {
  background-color: $background-color-table;
}
</style>
