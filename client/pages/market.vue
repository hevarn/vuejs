<template lang="pug">
  v-container(fluid).pt-0
    v-row
      v-img(src="/homePage.jpg" max-height="25vh" position="center bottom")
    v-container(fluid)
      v-row(justify="center")
        v-card-title.word-break-normal Bienvenue, vous pouvez visualiser le marché en tant que visiteur.
      v-row(justify="center")
        h2 Vous êtes connecté au site de {{siteSelected.name}}
      v-row(justify="center")
        v-col(cols=12 sm=6 md=4 lg=2)
          v-select(
            v-model="siteSelected"
            :items="sites"
            item-text="name"
            return-object
            label="selectionner un autre marché"
            @change="fecthProducts"
          )
      v-row(justify="center" v-if="siteSelected.marketEvents.length")
        h4 Ouverture du marché du {{new Date(currentMarket.market.opening).toLocaleDateString()}} au {{new Date(currentMarket.market.closing).toLocaleDateString()}}
      v-row(justify="center" v-if="siteSelected.marketEvents.length")
        h4 Récupération des paniers le {{new Date(currentMarket.receptionOpen).toLocaleDateString()}} entre {{new Date(currentMarket.receptionOpen).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}} et {{new Date(currentMarket.receptionClose).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}}
    v-row
      VisitMarkCardList(v-for="(list, {title}) in productList" :key="title" :list="list" @open-dialog-connect="isOpenModal = true")
    VisitMarkDialogConnect(@close-modal="isOpenModal = false" :isOpenModal="isOpenModal")
</template>

<script>
import DisplayedProduct from '@/components/DisplayedProduct'
import { productsService } from '@/api'
import { siteGroupingsService } from '../api'
export default {
  layout: 'visitor',
  data () {
    return {
      products: [],
      sites: [],
      siteSelected: {
        id: 3,
        name: 'Ladera',
        marketEvents: [
        ]
      },
      productList: [{
        title: 'Nos Fruits',
        src: '/register_login_image.jpg',
        size: '20vh',
        products: []
      },
      {
        title: 'Nos Légumes',
        src: '/KonceptPartOne.jpg',
        size: '20vh',
        products: []
      },
      {
        title: 'Nos Autres Produits',
        src: '/KonceptPartTwo.jpg',
        size: '20vh',
        products: []
      }],
      isOpenModal: false,
      providers: []
    }
  },
  head () {
    return {
      title: 'Présentation du marché',
      meta: [
        { hid: 'description', name: 'description', content: 'Market Page ' },
        { hid: 'keywords', name: 'keywords', content: 'Market' }
      ]
    }
  },
  computed: {
    currentMarket () {
      let currentMarket = {
        receptionOpen: new Date(),
        receptionClose: new Date(),
        market: {
          opening: new Date(),
          closing: new Date()
        }
      }
      if (this.sites.length && this.siteSelected.marketEvents.length) {
        currentMarket = this.siteSelected.marketEvents.slice().sort((a, b) => (a.market.opening - b.market.opening))[0]
      }
      return currentMarket
    }
  },
  mounted () {
    this.fetchGroupOfProviders()
  },
  methods: {
    async fecthProducts () {
      const query = { query: { visitor: true, pdtSiteGroupingId: 1, providers: [this.siteSelected.id, ...this.providers] } }
      this.$store.commit('admin/launchLoadingPage')
      const data = await productsService.find(query)
      setTimeout(() => this.$store.commit('admin/removeLoadingPage'), 100)
      this.products = data.map(element => new DisplayedProduct(element))
      this.sortProductByTypes()
    },
    sortProductByTypes () {
      this.productList.forEach((products) => { products.products = [] })
      this.products.forEach((product) => {
        if (product.product.pdt_variety.pdt_kind.pdtTypeId === 1) {
          this.productList[0].products.push(product)
        } else if (product.product.pdt_variety.pdt_kind.pdtTypeId === 2) {
          this.productList[1].products.push(product)
        } else {
          this.productList[2].products.push(product)
        }
      })
    },
    async fetchGroupOfProviders () {
      try {
        const { data } = await siteGroupingsService.find({ query: { visitor: true, id: 1 } })
        const allProviders = data[0].pdt_providers
        this.sites = allProviders.filter(x => x.isSite)
        this.providers = allProviders.filter(x => !x.isSite).map(x => x.id)
        await this.fecthProducts()
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    }
  }
}
</script>
