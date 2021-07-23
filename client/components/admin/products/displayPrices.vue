<template lang="pug">
v-dialog(v-model='displayPrice', max-width='1100px' @click:outside="$emit('hide-price-panel')")
  v-card
    v-col.py-0.col-12
      v-card-title Prix par fournisseurs pour {{ product.productName }}
    v-col.col-12.text-center.text-sm-right
      v-btn.mt-0.mt-sm-0.mr-sm-2(
        @click='() => (displayNewRef = !displayNewRef)',
        v-if='product.isBio',
        color='primary'
      ) ajouter une référence
      v-btn.mt-2.mt-sm-0.mr-sm-5(
        @click='() => (displaySellPrice = !displaySellPrice)',
        v-if='favourit.pdt_buyHistories && favourit.pdt_buyHistories.length',
        color='primary'
      ) voir le prix de vente
    v-card-text
      v-container(v-if='displayNewRef')
        v-row
          AdmPdctNewRef(:product='product', @close='hideNewRef')
      v-container(v-if='displaySellPrice')
        v-row
          AdmPdctSellPrice(
            :product='product',
            :reference='favourit',
            @update-product='() => $emit("update-price")'
          )
      v-container
        v-row
          v-col(cols='12', md='6')
            v-card-title(v-if='favourit.kanopeeReference') {{ favourit.kanopeeReference }}-{{ favourit.providerReference }} est la référence favorite de {{ product.productName }}
            v-card-title.col-12.col-md-6.red(v-else) {{ product.productName }} n'a aucune référence favorite
          v-col(cols='12', md='6')
            v-select(
              v-model='selectedRef',
              :items='product.referencesPdt',
              item-text='kanopeeReference',
              item-value='id',
              @change='updateProduct',
              label='Sélectionnez une nouvelle référence favorite',
              append-icon='$mdi-chevron-down'
            )
              template(v-slot:item='referencesProvider') {{ referencesProvider.item.kanopeeReference }} - {{ referencesProvider.item.providerReference }}
      v-container(v-for='reference in product.buyHistory', :key='reference.id')
        AdmPdctHistoric(
          :history='reference',
          :product='product',
          @update-product='$emit("update-price")'
        )
    v-card-actions
      v-spacer
      v-btn.mr-7(outlined, color='secondary', @click='$emit("hide-price-panel")') Fermer
</template>

<script>
import { productsService } from '@/api'
export default {
  props: {
    product: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    },
    displayPrice: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    selectedRef: '',
    displaySellPrice: false,
    messageError: { notif: 'Une erreur est survenue', types: 1 },
    displayNewRef: false
  }),
  computed: {
    opacity () {
      if (this.displayPrice) {
        return 0.7
      }
      return 0
    },
    favourit () {
      let ref = 0
      if (
        this.product.referencesPdt.length &&
        this.product.referencesPdt.find(
          x => x.id === this.product.productIds.favouriteRef
        )
      ) {
        ref = this.product.referencesPdt.find(
          x => x.id === this.product.productIds.favouriteRef
        )
      }
      return ref
    }
  },
  watch: {
    opacity: function (opacity) {
      if (opacity === 0) {
        this.$emit('hide-price-panel')
      }
    }
  },
  methods: {
    async updateProduct () {
      try {
        await productsService.patch(this.product.id, {
          favouriteRefId: this.selectedRef
        })
        this.$emit('update-price')
      } catch (error) {
        this.$store.commit('notif/sendAlert')
      }
    },
    hideNewRef () {
      this.displayNewRef = false
      this.$emit('update-price')
    }
  }
}
</script>
