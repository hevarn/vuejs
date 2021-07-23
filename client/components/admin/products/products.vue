<template lang="pug">
  v-container(fluid)
    v-row(align="center" justify="space-around")
      v-col.col-12.col-sm-7
        AdmUtlsSelectGroup(@fetch-product="fetchProduct" removeSelectedProvider @remove-provider-for-view="providerSelectedForView = 0")
        v-container
          v-row(align="center" justify="space-between")
            v-btn(@click="toggleEditMode" small :disabled="!$store.state.admin.group.id") Nouveau Produit
            v-btn(small to="/admin/references" :disabled="!$store.state.admin.group.id") Mercuriale
      v-spacer
      v-col.col-10.col-sm-4
        v-switch(
          v-model="groupDisplay"
          color="#010101"
          inset
          dense
          :disabled="!$store.state.admin.group.id"
          label="Marché").pt-0.pb-0.mt-0
        v-switch(
          v-model="viewStatus"
          color="#010101"
          inset
          dense
          :disabled="!$store.state.admin.group.id"
          @change="$store.commit('admin/tooggleView')"
          label="Konsomateur").pt-0.pb-0.mt-0
    AdmMarkSetMarket(v-if="groupDisplay" @close-set-market="groupDisplay =!groupDisplay")
    v-container
      v-row(v-if="!viewStatus")
        AdmPdctSelectProvider(@fetch-product="checkBeforeFetch")
      v-row(v-else)
        v-select(
          :items="siteProvider"
          item-text="name"
          item-value='id'
          label="Selectionnez votre site"
          v-model="providerSelectedForView"
          @change="checkBeforeFetchView"
        )
    v-container(v-if="viewStatus && providerSelectedForView")
      v-row(align="center")
        v-col(align="center").col-6.pr-0
          AdmOrdrSearch(@onSearch="onSearch")
        v-col(align="center")
          FilterProducts(@fetch-items="checkBeforeFetchView" :products="productDisplay" :loading="$store.state.admin.loadingPage")
      v-row(v-if="$store.state.admin.loadingPage" justify='center')
        v-col(v-for="p in 12" :key="p").col-6.col-sm-4.col-md-3.col-lg-2
          v-skeleton-loader(type='card')
      v-row(v-else)
        v-col(v-for="product in productDisplay" :key="product.id").col-12.col-sm-4.col-md-3.col-lg-2
          ProductCard(:product="product" isAdminPage @fetch-product="checkBeforeFetchView")
      h2(v-if="!searchResult.length && isSearch") Pas de résultat
    v-row(v-if="!$store.state.admin.selectedProvider.id")
      v-img(src="/logoKnoir.png" max-height=500 contain)
    AdmPdctProductTable(:product="products" @fetch-product="checkBeforeFetch" :provider="$store.state.admin.selectedProvider"
      v-if="!viewStatus && $store.state.admin.selectedProvider.id" @splice-product="spliceProduct")
    v-row(v-if="isEditMode")
      AdmPdctEditProduct(:isEditMode="isEditMode" @toggle-edit-mode="toggleEditMode" @fetch-product="checkBeforeFetch")
</template>

<script>
import { fetchProducts } from '@/components/admin/utils/fetchProduct'
export default {
  data () {
    return {
      isEditMode: false,
      loadingPage: false,
      products: [],
      isSearch: false,
      searchResult: [],
      viewStatus: this.$store.state.admin.view,
      groupDisplay: false,
      valueSwitch: null,
      productsforViews: [],
      providerSelectedForView: 0,
      step: 0
    }
  },
  computed: {
    productDisplay () {
      return this.isSearch ? this.searchResult : this.productsforViews
    },
    activeMargin () {
      const result = {}
      if (this.viewStatus) {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            result.marginLeft = '33px'
            break
          case 'sm':
            result.marginLeft = '55px'
            break
          case 'md':
            result.marginLeft = '48px'
            break
          default:
            result.marginLeft = ''
            break
        }
      }
      return {
        marginLeft: `margin-left: ${result.marginLeft}`
      }
    },
    siteProvider () {
      return this.$store.state.admin.providersBG.filter(({ isSite }) => isSite)
    }
  },
  mounted () {
    if (this.$store.state.admin.selectedProvider.id) {
      this.checkBeforeFetch()
    }
  },
  methods: {
    async fetchProduct (query, viewer) {
      Object.assign(query.query, { pdtSiteGroupingId: this.$store.state.admin.group.id })
      try {
        if (viewer) {
          this.productsforViews = await fetchProducts(query, this.$store)
        } else {
          this.products = await fetchProducts(query, this.$store)
        }
      } catch (e) {
        this.$store.commit('notif/sendAlert', 'Une erreur est survenue, rechargez la page')
      }
    },
    toggleEditMode () {
      this.isEditMode = !this.isEditMode
    },
    onSearch (value) {
      this.isSearch = !!value.length
      this.searchResult = this.products.filter(x =>
        x.productName.toLowerCase().includes(value.toLowerCase())
      )
    },
    checkBeforeFetch (value) {
      const query = {
        fetchByProvider: this.$store.state.admin.selectedProvider.id,
        isArchived: value ? 1 : 0
      }
      this.fetchProduct({ query })
    },
    checkBeforeFetchView (value) {
      const providers = this.$store.state.admin.providersBG.filter(site => !site.isSite).map(provider => provider.id)
      providers.push(this.providerSelectedForView)
      let query = { display: 1, providers }
      if (value) {
        query = { display: 1, providers, ...value.query }
      }
      this.fetchProduct({ query }, true)
    },
    spliceProduct (item) {
      this.products.splice(this.products.indexOf(item), 1)
    }
  }
}
</script>

<style scoped>
.containerProducts {
  width: 93%;
}
</style>
