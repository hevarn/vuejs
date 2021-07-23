<template lang="pug">
  v-dialog(v-model="changeProduct" width="600" content-class='rounded')
    v-card.pa-5(elevation=2 max-width=600)
      v-card(v-for="product, index in unavailableProduct" :key="index" elevation=0 )
        SmallLoading(v-if="loading")
        span Attention le produit #[strong {{product.kind}} {{product.variety}}] n'est plus disponible.
        v-card-text
          span Dans l'attente de pouvoir vous le proposer à nouveau, nous vous proposons différents produits qui pourrait vous intéresser :
        v-row
          v-col.col-4(v-for="product, index in product.alternativeChoice" :key="index")
            ProductCard(:product="product" rank='1')
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="$store.commit('cart/showChangeProduct', false), $store.commit('cart/emptyUnavailableProduct')") fermer
</template>

<script>
import { fetchProducts } from '@/components/admin/utils/fetchProduct'
export default {
  name: 'ChangeProduct',
  data () {
    return {
      products: [],
      loading: true,
      rules: [v => v > 0 || 'Quantité invalide']
    }
  },
  computed: {
    changeProduct: {
      get () {
        return this.$store.state.cart.changeProduct
      },
      set (value) {
        this.$store.commit('cart/showChangeProduct', value)
      }
    },
    unavailableProduct () {
      return this.$store.state.cart.unavailableProduct
    }
  },
  watch: {
    unavailableProduct () {
      this.fetchSameProduct()
    }
  },
  mounted () {
    this.fetchSameProduct()
  },
  methods: {
    async fetchSameProduct () {
      for (let i = 0; i < this.unavailableProduct.length; i++) {
        const item = this.unavailableProduct[i]
        try {
          const products = await fetchProducts({
            query: { kind: item.productIds.kind }
          }, this.$store)
          this.unavailableProduct[i].alternativeChoice = products.reduce(
            (acc, product) => {
              if (
                product.isBio &&
                product.display &&
                product.lastSellPrice > 0
              ) {
                acc.push(product)
              }
              if (
                !product.isBio &&
                product.favouriteRefId !== item.favouriteRefId &&
                product.display &&
                product.stock > 0 &&
                product.lastSellPrice > 0
              ) {
                acc.push(product)
              }
              return acc
            },
            []
          )
        } catch (e) {}
      }
      this.loading = false
    }
  }
}
</script>
