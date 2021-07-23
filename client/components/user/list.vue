<template lang="pug">
  div
    v-data-table(:headers='headers' :items='products' align='center'
    :loading='loadingList'
    :footer-props={
      itemsPerPageText: 'Item par page',
    prevIcon: '$mdi-chevron-left',
    nextIcon: '$mdi-chevron-right'
    }
    :header-props={
          sortIcon: '$mdi-arrow-up',
          sortByText:'Filtrer par'
        }
    )
      template(v-slot:item.imageURL="{ item }")
        v-avatar(max-height=90 max-width=90)
          v-img(:src="item.metadata.imageURL" style="max-height: 70px; max-width: 70px; margin: auto;")
      template(v-slot:item.unitPrice="{ item }")
        span {{ `${(item.amount / 100 / item.quantity).toFixed(2)} / ${item.metadata.packaging}` }}
      template(v-slot:item.oldPrice="{ item }")
        span {{ item.amount / 100 }}
      template(v-slot:item.addAgain="{ item }")
         v-btn(fab icon color="primary" @click="addProduct(item)" :loading="loadingAddProduct" :disabled="!$store.state.auth.user.statusMarket")
            v-icon $mdi-cart-arrow-down
      template(v-slot:header.delete="{ header }")
         span supprimer le produit de ma commande
         v-tooltip(top)
          template(v-slot:activator="{ on }")
            v-btn(icon small v-on="on" :disabled="!$store.state.auth.user.statusMarket")
              v-icon(color='green') $mdi-information-outline
          span Tant que le marché est ouvert, vous pouvez adapter votre commande en respectant un minimum d'achat égal à {{$store.state.auth.user.minAmountMarket}}€.
      template(v-slot:item.delete="{ item }")
        v-btn(fab icon color="secondary" @click="startRemove(item)" :loading="loadingRemove")
          v-icon $mdi-cart-arrow-up
    v-bottom-sheet(v-model="removeDialog")
      v-sheet
        v-card
          v-card-title Modification du produit :
          v-row(align="center" no-gutters)
            v-col.col-2(align="center")
              v-avatar(max-height=90 max-width=90)
                v-img(:src="removeProductSelect.imageURL" style="max-height: 70px; max-width: 70px; margin: auto;")
            v-col.col-1(align="center")
              span {{removeProductSelect.description}}
            v-col.col-1(align="center")
              v-btn(icon color="primary" @click="removeQty -= 1" :disabled="btnRemoveQtyMin")
                v-icon $mdi-minus
            v-col.col-1(align="center")
              span.text-center {{removeQty}}
            v-col.col-1(align="center")
              v-btn(icon color="primary" @click="removeQty += 1" :disabled="btnRemoveQtyPlus")
                v-icon $mdi-plus
            v-col.col-2(align="center")
              span {{removeProductSelect.unity}}
            v-col.col-2(align="center")
              span Prix unitaire : {{(removeProductSelect.oldPrice / removeProductSelect.quantity).toFixed(2)}} €
            v-col.col-2(align="center")
              span Prix total : {{((removeProductSelect.oldPrice / removeProductSelect.quantity) * removeQty).toFixed(2)}} €
          v-row
            v-col(align="center")
              v-btn(color="primary" @click="removeItem(removeProductSelect)") Modifier le produit
</template>

<script>
import { cartService } from '@/api'
import { textSize } from '@/utils/style'

export default {
  props: {
    loadingList: {
      type: Boolean,
      default: false
    },
    products: {
      type: Array,
      default: () => []
    },
    orderDate: {
      type: Number,
      default: 0
    },
    paidId: {
      type: String,
      default: ''
    },
    priceTotal: {
      type: Number,
      default: 0
    },
    invoiceIndex: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: 'paid'
    }
  },
  data () {
    return {
      loadingRemove: false,
      loadingAddProduct: false,
      removeProductSelect: {},
      removeDialog: false,
      removeQty: 1,
      maxRemoveQty: 1
    }
  },
  computed: {
    headers () {
      const headers = [
        {
          text: 'Image du produit',
          value: 'imageURL',
          align: 'start',
          sortable: false
        },
        {
          text: 'Nom du produit',
          value: 'description',
          align: 'center',
          sortable: false
        },
        { text: 'Quantité commandée', value: 'quantity', align: 'center' },
        { text: 'Prix Unitaire (€)', value: 'unitPrice', align: 'center' },
        { text: 'Prix Total (€)', value: 'oldPrice', align: 'center' },
        {
          text: 'Commander à nouveau',
          value: 'addAgain',
          sortable: false,
          align: 'center'
        }
      ]
      if (this.canBeRemoved) {
        headers.push({
          text: 'Supprimer le produit de ma commande',
          value: 'delete',
          sortable: false,
          align: 'center'
        })
      }
      return headers
    },
    textBody () {
      return `font-size: ${textSize(this.$vuetify.breakpoint.name).body}em;`
    },
    canBeRemoved () {
      const orderDate = new Date(this.orderDate * 1000)
      const opening = Date.parse(
        this.$store.state.auth.user.siteGrouping.opening
      )
      const closing = Date.parse(
        this.$store.state.auth.user.siteGrouping.closing
      )
      if (
        this.status === 'draft' &&
        orderDate > opening &&
        orderDate < closing
      ) {
        return true
      }
      return false
    },
    btnRemoveQtyPlus () {
      return this.removeQty >= this.maxRemoveQty
    },
    btnRemoveQtyMin () {
      return this.removeQty === 0
    }
  },
  methods: {
    startRemove (product) {
      this.removeDialog = true
      this.removeProductSelect = product
      this.removeQty = product.quantity
      this.maxRemoveQty = product.quantity
    },
    addProduct (product) {
      this.loadingAddProduct = true
      this.$emit('add-product', product)
      setTimeout(() => {
        this.loadingAddProduct = false
      }, 1500)
    },
    async removeItem (product) {
      this.loadingRemove = true
      try {
        const priceToSub =
          (product.oldPrice / product.quantity) * this.removeQty
        const newPriceForInvoice =
          this.priceTotal / 100 - product.oldPrice + priceToSub
        if (
          newPriceForInvoice <
          this.$store.state.auth.user.minAmountMarket
        ) {
          this.$store.commit('notif/sendAlert', `Le montant minimum d'une commande est de ${this.$store.state.auth.user.minAmountMarket} €.`)
        } else {
          if (this.removeQty === 0) {
            await cartService.remove(product.id)
          } else {
            await cartService.patch(product.id, { quantity: this.removeQty })
          }
          this.$emit('invoice-updated', {
            paidId: this.paidId,
            index: this.invoiceIndex
          })
          this.$store.commit('notif/sendSuccess', 'Votre modification a bien été prise en compte')
        }

        this.removeDialog = false
      } catch (e) {
        this.$store.commit('notif/sendAlert', 'Une erreur est survenue lors de la suppression de votre produit. Si le problème persiste, veuillez contacter un administrateur.')
        this.loadingRemove = false
      }
    }
  }
}
</script>
