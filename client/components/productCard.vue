<template lang="pug">
  v-card.productCard(:disabled="unavailable" :hover="!unavailable" :min-height='size.cardMinHeight' z-index="0")
    v-img(lazy-src="/logoKwhite.png" :src='product.picture' height="150")
    v-overlay(absolute opacity="1" :value="unavailable" z-index="5" style="align-items:start")
      v-row.mx-0.mt-12.px-1.py-3.pa-sm-3.containerText(align="center" justify="center" :style="size.fontSize")
        v-icon.mb-2.mr-1(color='green' ) $mdi-sprout
        p ÇA POUSSE
        v-icon.mb-2.ml-1(color='green') $mdi-sprout
        p Disponible bientôt
    v-btn.mt-7(@click="toggleFavorite" top right absolute fab x-small :disabled="!$store.state.auth.user || $store.state.auth.user.isAdmin" :loading="loadFavorit")
      v-icon(v-if="product.isFavorit" color='red' medium) $mdi-heart
      v-icon(v-else medium) $mdi-heart-outline
    v-btn.mt-7(top left absolute fab x-small)
      v-tooltip(right max-width="300px")
        template(v-slot:activator="{ on }")
          v-icon(color='green' v-on="on" x-large :class="size.infoBtn") $mdi-information-outline
        p {{ product.description}}
        p {{ product.varietyDescription }}
        p(v-if="product.preparationAdvice") Conseil de préparation : {{ product.preparationAdvice }}
    v-row(v-if="!isAdminPage" no-gutters align="center" justify="space-between")
      v-btn(:small="size.xsmall" tile color="grey" @click="setQuantity(product, -1)"
      :disabled="!product.lastSellPrice || qty <= 1" :loading="loadingAdd")
        v-icon $mdi-minus
      p(:style="size.qtySize") {{ qty }}
      v-btn(:small="size.xsmall" tile color="#6b8e23" @click="setQuantity(product, 1)"
      :disabled="!product.isBio && (product.stock <= 0 || qty === product.stock || !product.lastSellPrice)"
      :loading="loadingAdd")
        v-icon $mdi-plus
    v-row(v-else no-gutters align="center" justify="space-around")
      v-btn(icon @click="toggleEditMode")
        v-icon $mdi-pencil-outline
      v-btn(icon :color="checkColor()" @click="() => this.displayPrice = true")
        v-icon $mdi-currency-eur
      v-btn(icon @click.stop="statusPopup = true")
        v-icon $mdi-trash-can-outline
    v-card-text.pa-1
      v-row(no-gutters justify="space-between" align="center" flex-column)
        v-col.col-8
          p(:style="size.lineHeight") {{ product.kind.substring(0, 16) }}
          p {{ product.variety.substring(0, 16) }}
          p.small.font-weight-light Cat : {{ product.category.substring(0, 3) }}
        v-col.col-4
          v-img(v-if="product.isBio" :src="iconAbUrl" contain height="60px")
          v-img(v-else contain :src="icon0KmUrl" height="60px")
      v-row(no gutters)
        v-col.col-12
          p.green--text.font-weight-black.mb-0(:style="size.pdtDistance") Trajet : {{ product.distance }}
      v-row(no-gutters)
        v-col.col-12(align="center")
          p {{ price }}
      v-row(no-gutters)
        v-col.col-12(align="center")
          p.small.font-weight-light {{ stock }}
      AdmPdctEditProduct(:product="product" @fetch-product="$emit('fetch-product')" :isEditMode="isEditMode" @toggle-edit-mode="toggleEditMode")
      AdmPdctDisplayPrices(:displayPrice="displayPrice" :product="product" @update-price="updatePrice" @hide-price-panel="hidePricePanel")
    v-dialog(v-model="statusPopup" width=400)
      v-card
        v-card-title Suppression du produit
        v-card-text Attention il est dangereux de supprimer un produit. Archivez ou Retirez de la vente en priorité.
        v-card-text Voulez-vous supprimer le produit #[strong {{product.kind}} {{product.variety}}] ?
        v-card-actions
          v-spacer
          v-btn.ma-2(outlined color="secondary" @click="statusPopup = false") Annuler
          v-btn.ma-2(outlined color="primary" @click="deleteItems") Je sais ce que je fais
</template>

<script>
import { productsService } from '@/api'
export default {
  name: 'Card',
  props: {
    product: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    },
    isAdminPage: {
      type: Boolean,
      default: false
    },
    isVisitorPage: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      iconAbUrl: '../ab.png',
      icon0KmUrl: '../0km.png',
      isEditMode: false,
      displayPrice: false,
      spotlight: this.product.spotlight,
      display: this.product.display,
      loadingAdd: false,
      statusPopup: false,
      loadFavorit: false
    }
  },
  computed: {
    size () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.xsmall = true
          result.cardMinHeight = '370px'
          result.fontSize = '12px'
          result.pdtDistance = '0.7em'
          result.lineHeight = 'normal'
          result.infoBtn = 'pb-2'

          break
        case 'sm':
          result.xsmall = false
          result.cardMinHeight = '370px'
          result.fontSize = '12px'
          result.pdtDistance = '0.75em'
          result.lineHeight = '1.2'
          result.qtySize = '10px'
          result.infoBtn = 'pb-0'
          break
        case 'md':
          result.xsmall = false
          result.cardMinHeight = '225px'
          result.fontSize = '16px'
          result.pdtDistance = '0.80em'
          result.lineHeight = '1.2'
          result.infoBtn = 'pb-0'
          break
        case 'lg':
          result.cardMinHeight = '380px'
          result.fontSize = '13px'
          result.pdtDistance = '0.75em'
          result.lineHeight = '1.1'
          result.infoBtn = 'pb-0'
          break
        case 'xl':
          result.cardMinHeight = '225px'
          result.fontSize = '22px'
          result.pdtDistance = '1.0em'
          result.lineHeight = '0.7'
          result.infoBtn = 'pb-0'
          break
        default:
          result.xsmall = false
          result.cardMinHeight = '360px'
          result.fontSize = '16px'
          result.pdtDistance = '0.55em'
          result.infoBtn = 'pb-2'
          break
      }
      return {
        xsmall: result.xsmall,
        cardMinHeight: result.cardMinHeight,
        fontSize: `font-size: ${result.fontSize}`,
        pdtDistance: `font-size: ${result.pdtDistance}`,
        lineHeight: `line-height: ${result.lineHeight}`,
        qtySize: `font-size: ${result.qtySize}`,
        infoBtn: result.infoBtn
      }
    },
    unavailable () {
      return (
        (!this.product.isBio && this.product.stock === 0) ||
        this.product.lastSellPrice === null
      )
    },
    price () {
      return this.product.lastSellPrice
        ? `${this.product.lastSellPrice} € / ${this.product.sellUnity ||
            this.product.unity}`.replace('.', ',')
        : 'prix indisponible '
    },
    qty: {
      get () {
        let result = 0
        const productExist = this.$store.state.cart.cart.find(
          product => product.id === this.product.id
        )
        if (productExist) {
          result = productExist.qty
        }
        return result
      }
    },
    stock: {
      get () {
        if (!this.product.isBio) {
          if (this.product.stock > 0) {
            return `Quantité récoltée : ${this.product.stock}`
          } else {
            return 'Indisponible'
          }
        } else {
          return 'Disponible'
        }
      }
    }
  },
  methods: {
    toggleEditMode () {
      this.isEditMode = !this.isEditMode
    },
    updatePrice (value) {
      this.$emit('fetch-product')
    },
    hidePricePanel () {
      this.displayPrice = false
    },
    async setQuantity (product, quantityToAdd) {
      if (this.isVisitorPage) {
        this.$emit('open-dialog-connect')
      } else {
        this.loadingAdd = true
        try {
          await this.$store.dispatch('cart/addProduct', {
            product,
            quantityToAdd
          })
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
        this.loadingAdd = false
      }
    },
    openPopupDelete () {
      this.statusPopup = !this.statusPopup
    },
    async deleteItems () {
      try {
        await productsService.remove(this.product.id)
        this.$emit('fetch-product')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.openPopupDelete()
    },
    async changeDisplay (e) {
      try {
        await productsService.patch(this.product.id, { display: e })
        this.$emit('fetch-product')
      } catch (error) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async changeSpotlight (e) {
      try {
        await productsService.patch(this.product.id, { spotlight: e })
        this.$emit('fetch-product')
      } catch (error) {
        this.$store.commit('notif/sendAlert')
      }
    },
    checkColor () {
      let color = 'grey--darken-2'
      if (this.product.lastSellPrice && this.product.ratioPrice < 30) {
        color = 'orange'
      } else if (!this.product.lastSellPrice) {
        color = 'red'
      }
      return color
    },
    toggleFavorite () {
      this.loadFavorit = true
      if (this.product.isFavorit) {
        this.$emit('remove-from-favorites', this.product)
      } else {
        this.$emit('add-to-favorites', this.product.id)
      }
      setTimeout(() => { this.loadFavorit = false }, 1000)
    }
  }
}
</script>

<style scoped>
.productCard {
  border-radius: 30px !important;
}

.small {
  font-size: 0.7em !important;
}

.v-application p {
  margin-bottom: 0.34vh;
  margin-left: 0.1vw;
  margin-right: 0.1vw;
}

.containerText {
  background: lightgray;
  color: black;
  transform: skewY(-12deg);
  font-weight: 900 !important;
  top: -90px;
}
</style>
