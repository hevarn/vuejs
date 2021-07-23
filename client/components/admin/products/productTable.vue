<template lang="pug">
  v-card.box-border.px-0.px-sm-6.px-md-8
    v-card-title {{provider.isSite ? 'Site' : 'Fournisseur'}} {{provider.name}}
      v-spacer
      v-btn(@click="() => udpateProvider = !udpateProvider" text outlined color="secondary") Infos
      v-btn(icon @click="$emit('fetch-product', isArchiveMode), isArchiveMode =!isArchiveMode" v-if="!(infoMark || udpateProvider)")
        v-icon(x-large color="primary") $mdi-Package-Down
      v-spacer
      v-text-field(
        v-model="search"
        append-icon="$mdi-magnify"
        label="Rechercher"
        single-line
        hide-details
      )
    AdmPvdrInfoProvider(v-if="udpateProvider" :provider="provider.id")
    v-data-table(
      v-if="!(infoMark || udpateProvider)"
      :loading="$store.state.admin.loadingPage"
      loader-height="10"
      loading-text="Loading... Please wait"
      color="#010101"
      :items-per-page="product.length"
      :headers="settedHeaders"
      :items="product"
      :search="search"
      :footer-props={
        itemsPerPageText: 'Produits par page :',
        itemsPerPageOptions: [-1, 5, 10, 15],
        prevIcon: '$mdi-chevron-left',
        nextIcon: '$mdi-chevron-right'
      }
      :header-props={
        sortIcon: '$mdi-arrow-up',
        sortByText:'Filtrer par'
      }
    )
      template(v-slot:item.picture="{ item }")
        v-avatar
          v-img(
            lazy-src="/logoKwhite.png"
            :src="item.picture"
            alt="fruit"
            height="50"
            width="50")
      template(v-slot:item.display="{ item }")
        v-switch(:input-value="item.display" color="#010101" inset dense @change="changeDisplay(item)" :disabled="item.isArchived")
      template(v-slot:item.unity="{ item }")
        span(v-if="item.sellUnity") {{item.sellUnity}}
          br
          span {{item.unity}}
        span(v-else) {{item.unity}}
      template(v-slot:item.actions="{ item }")
        v-row
          v-btn(icon @click="toggleEditMode(item)").col-4
            v-icon $mdi-pencil-outline
          v-btn(icon @click="togglePriceMode(item)").col-4
            span $
          v-btn(icon @click="deleteItems(item)" v-if="item.isArchived").col-4
            v-icon $mdi-trash-can-outline
          v-btn(icon @click="archiveProduct(item)").col-4
            v-icon {{item.isArchived ? '$mdi-Package-Up' : '$mdi-Package-Down'}}
      template(v-slot:item.ratioPrice="{ item }")
        v-card-text(v-if="referenceExist(item)")
          div(v-if="item.favouriteRefId")
            div(v-if="Math.round(item.ratioPrice) >= Math.round(item.getRatioRefPrice(provider.id))")
              v-chip(color="secondary" small v-if="Math.round(item.registeredRatio) !== Math.round(item.ratioPrice)") Marge modifiée
              v-chip(color="primary" small v-else) {{ `${Math.round(item.ratioPrice)} %`}}
            div(v-else)
              v-chip(color="secondary" small v-if="Math.round(item.registeredRatio) !== Math.round(item.ratioPrice)") Marge modifiée
              v-chip(color="warning" small v-else) {{ `${Math.round(item.ratioPrice)} %`}}
          div(v-else)
            v-chip(color="warning" small) A référencer
      template(v-slot:item.getRatioRefPrice(provider.id)="{ item }")
        v-card-text(:class='(item.getRatioRefPrice(provider.id) > 30) ? "text--primary" : "text--secondary"' v-if="referenceExist(item)")
          div {{item.getRatioRefPrice(provider.id) ? `${Math.round(item.getRatioRefPrice(provider.id))} %` : 'N/A'}}
    AdmPdctEditProduct(:product="prod" @fetch-product="$emit('fetch-product')" :isEditMode="isEditMode" @toggle-edit-mode="isEditMode = false" v-if="isEditMode")
    AdmPdctDisplayPrices(:displayPrice="displayPrice" :product="prod" @update-price="$emit('fetch-product')" @hide-price-panel="displayPrice = false" v-if="displayPrice")
</template>

<script>
import { productsService } from '@/api'
export default {
  props: {
    product: {
      type: Array,
      default: () => []
    },
    provider: {
      type: Object,
      default: () => ({
        id: 0,
        name: ''
      })
    }
  },
  data () {
    return {
      providers: [
        { text: 'Produit', value: 'productName' },
        { text: 'Référence', value: 'sharedReference' },
        { text: 'Image', value: 'picture' },
        { text: 'Conditionnement', value: 'unity' },
        { text: 'Disponible', value: 'stock' },
        { text: 'Prix de vente', value: 'lastSellPrice' },
        { text: 'Taux de marge produit', value: 'ratioPrice' },
        {
          text: 'Taux de marge référence',
          value: 'getRatioRefPrice(provider.id)'
        },
        { text: 'En vente', value: 'display' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      providersSmallSize: [
        { text: 'Produit', value: 'productName', width: 140 },
        { text: 'Référence', value: 'sharedReference', width: 240 },
        { text: 'Image', value: 'picture', width: 90 },
        { text: 'Conditionnement', value: 'unity', width: 170 },
        { text: 'Dispo', value: 'stock', width: 90 },
        { text: 'Prix', value: 'lastSellPrice', width: 75 },
        { text: 'Marge produit', value: 'ratioPrice', width: 150 },
        {
          text: 'Marge réf',
          value: 'getRatioRefPrice(provider.id)',
          width: 100
        },
        { text: 'En vente', value: 'display', width: 80 },
        { text: 'Actions', value: 'actions', sortable: false, width: 100 }
      ],
      kulteur: [
        { text: 'Produit', value: 'productName' },
        { text: 'Référence', value: 'sharedReference' },
        { text: 'Image', value: 'picture' },
        // { text: 'En culture', value: 'product.cultived' },
        { text: 'Disponible', value: 'stock' },
        // { text: 'Commandé', value: 'product.pdt_variety.picture' },
        { text: 'Conditionnement', value: 'unity' },
        { text: 'Prix de vente', value: 'lastSellPrice' },
        { text: 'Taux de marge', value: 'ratioPrice' },
        { text: 'En vente', value: 'display' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      kulteurSmallSize: [
        { text: 'Fournisseur', value: 'productName', width: '150' },
        { text: 'Produit', value: 'sharedReference', width: '190' },
        { text: 'Image', value: 'picture', width: '90' },
        // { text: 'En culture', value: 'product.cultived' },
        { text: 'Disponible', value: 'stock', width: '110' },
        // { text: 'Commandé', value: 'product.pdt_variety.picture' },
        { text: 'Conditionnement', value: 'unity', width: '150' },
        { text: 'Prix de vente', value: 'lastSellPrice', width: '130' },
        { text: 'Taux de marge', value: 'ratioPrice', width: '140' },
        { text: 'En vente', value: 'display', width: '100' },
        { text: 'Actions', value: 'actions', sortable: false, width: '105' }
      ],
      search: '',
      isEditMode: false,
      pdt: 0,
      displayPrice: false,
      infoMark: false,
      udpateProvider: false,
      isArchiveMode: true
    }
  },
  computed: {
    settedHeaders () {
      let result = this.provider.isSite ? this.kulteur : this.providers
      if (this.$vuetify.breakpoint.name !== 'xl') {
        result = this.provider.isSite
          ? this.kulteurSmallSize
          : this.providersSmallSize
      }
      return result
    },
    prod () {
      return this.product.find(x => x.id === this.pdt)
    }
  },
  methods: {
    async changeDisplay (item) {
      try {
        await productsService.patch(item.id, { display: !item.display })
        this.$store.commit('notif/sendSuccess', 'Ajout de la modification')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async deleteItems (item) {
      try {
        await productsService.remove(item.id)
        this.$emit('splice-product', item)
        this.$store.commit('notif/sendSuccess', 'Produit supprimé')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async archiveProduct (item) {
      try {
        await productsService.patch(item.id, {
          isArchived: !item.isArchived,
          display: false
        })
        this.$emit('splice-product', item)
        this.$store.commit('notif/sendSuccess', 'Produit archivé')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    toggleEditMode (item) {
      this.isEditMode = false
      this.displayPrice = false
      this.pdt = item.id
      this.isEditMode = true
    },
    togglePriceMode (item) {
      this.isEditMode = false
      this.displayPrice = false
      this.pdt = item.id
      this.displayPrice = true
    },
    hidePricePanel () {
      this.displayPrice = false
    },
    referenceExist (item) {
      return item.product.pdt_references.find(
        x => x.pdtProviderId === this.provider.id
      )
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
