<template lang="pug">
  v-container
    v-row
      v-text-field.col-12.col-sm-3(v-model="price" type="number" min="0" label="Prix de vente" @input="addNewPrice")
      v-text-field.col-12.col-sm-3(v-model="marge" type="number" min="0" label="Marge en %" @input="addNewMarge")
      v-text-field.col-12.col-sm-3(v-model="buyPrice" type="number" min="0" label="Prix d'achat" disabled)
      v-text-field.col-12.col-sm-3(v-model="product.disassemble" label="Convertion en %" disabled)
      v-col(align='end').pa-0
        v-btn(@click.stop="popupValidateNewPrice = true" color="primary" justify='end') Valider les nouveaux prix
        v-dialog(v-model="popupValidateNewPrice" width=400)
          v-card
            v-card-title Valider le nouveau prix
            v-card-text Voulez-vous valider le nouveau prix du produit #[strong {{product.kind}} {{product.variety}}] ?
            v-card-actions
              v-spacer
              v-btn.ma-2(outlined color="secondary" @click="popupValidateNewPrice = false") Annuler
              v-btn.ma-2(outlined color="primary" @click="postNewPrice") Oui
    v-row
      v-data-table(
          :headers="headersPrices"
          :items="product.historySellPrice"
          :loading="loading"
          loading-text="Chargement en cours...Veuillez patienter"
          v-if="product.historySellPrice.length"
          :footer-props={
            itemsPerPageText: 'Item par page',
          prevIcon: '$mdi-chevron-left',
          nextIcon: '$mdi-chevron-right'
          }
          :header-props={
          sortIcon: '$mdi-arrow-up',
          sortByText:'Filtrer par'
        }
        ).col-12
          template(v-slot:item.createdAt="{ item }") {{new Date(item.createdAt).toLocaleString()}}
      p(v-else) Pas d'historique de vente pour ce produit
</template>

<script>
import DisplayedProduct from '@/components/DisplayedProduct'
import { sellHistoriesService } from '@/api'

export default {
  props: {
    product: {
      type: Object,
      default: () =>
        new DisplayedProduct({
          id: 0,
          sharedReference: '',
          description: '',
          pdtProviderId: '',
          pdtCategoryId: '',
          pdtVarietyId: '',
          pdtCountryId: '',
          pdtWeightUnityId: '',
          pdtDistanceId: '',
          spotlight: false,
          display: false,
          pdt_category: { name: '' },
          pdt_country: { name: '' },
          buyUnity: { name: '' },
          pdt_distance: { name: '' },
          pdt_variety: {
            name: '',
            picture: '',
            pdt_kind: {
              name: '',
              pdt_type: { name: '' }
            }
          }
        })
    },
    reference: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    }
  },
  data () {
    return {
      popupValidateNewPrice: false,
      price: this.product.lastSellPrice,
      marge: this.product.ratioPrice,
      minMarge: 15,
      buyPrice:
        this.reference.pdt_buyHistories.slice(0).sort((a, b) => {
          return b.id - a.id
        })[0].buyPrice1 * (this.product.disassemble / 100 || 1),
      headersPrices: [
        { text: 'Date', value: 'createdAt' },
        { text: 'Prix de vente', value: 'sellPrice' },
        { text: 'Taux de marge', value: 'ratio' }
      ],
      loading: false
    }
  },
  methods: {
    addNewPrice (value) {
      if (value > 0) {
        this.marge = (((value - this.buyPrice) / this.price) * 100).toFixed(2)
      } else {
        this.marge = 0
      }
    },
    addNewMarge (value) {
      if (this.buyPrice > 0 && value) {
        this.price = (this.buyPrice / (1 - value * 0.01)).toFixed(2)
      } else {
        this.price = 0
      }
    },
    async postNewPrice () {
      if (
        this.product.lastSellPrice !== this.price ||
        this.product.registeredRatio !== this.marge
      ) {
        try {
          const data = {
            sellPrice: this.price,
            ratio: this.marge,
            pdtProductId: this.product.id
          }
          await sellHistoriesService.create(data)
          this.$store.commit('notif/sendSuccess', 'Prix mis à jour')
          this.$emit('update-product')
          this.popupValidateNewPrice = false
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      } else {
        this.$store.commit('notif/sendAlert', "Merci de modifier le prix/marge avant de l'enregistrer")
      }
    }
  }
}
</script>
