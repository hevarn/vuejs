<template lang="pug">
  v-container.containerCard.pr-0.pl-sm-12.pl-md-0.pl-xl-12(:style="container.marginLeft")
    v-card.ml-sm-2(outlined dense)
      v-row(no-gutters align="center" justify="space-around")
        v-col.col-12.col-sm-5.col-md-4
          v-card-title.pa-2
            span {{ market.name }}
          v-card-subtitle.pa-2
            v-icon(color="primary").mb-2 $mdi-home
            span  {{ market.adress }}
        v-divider(vertical).d-sm-and-up
        v-divider.d-sm-none
        v-col.col-12.col-sm-6.col-md-7
          v-card-text.pa-2
            v-icon(color="primary").mb-2 $mdi-cart-plus
            span  {{ marketRetrieveText }}
            span </br>
            v-icon(color="primary").mb-2 $mdi-clock
            span  {{ marketClosingText }}
    v-card(v-if="closedMarket").mt-5.pb-5.ml-3
      v-card-title Le marché est fermé
      v-card-text(v-if='marketInfoImg')
        v-img(:src='marketInfoImg')
      ClosedMarket
        template(v-slot:middle)
          .countdown
            div(id="flipdown" class="flipdown" class='flipdown__theme-blue')
    div(v-else)
      v-row.pl-2(no-gutters justify="space-between" align="center")
        v-col.hidden-md-and-down
        v-col(align="center").col-xs-5.col-sm-6.col-md-7
          v-text-field(prepend-icon="$mdi-magnify" label="Rechercher" v-model="searchValue" @input="onSearch")
        FilterProducts(@fetch-items="fetchItems" :loading="loading" :products="products")
      v-row(v-if="$store.state.admin.loadingPage" justify='center')
        v-col(v-for="p in 12" :key="p").col-6.col-sm-4.col-md-3.col-lg-2
          v-skeleton-loader(type='card')
      v-row.pl-sm-3(v-else :style="container.margin")
        v-col.px-1.px-sm-1.px-lg-2(v-for="product in productDisplay" :key="product.id").col-6.col-sm-4.col-md-3.col-lg-2
          ProductCard(:product="product" rank='1' @fetch-product="fetchItems"
          @add-to-favorites='addToFavorites' @remove-from-favorites='removeFromFavorites')
</template>

<script>
import { fetchProducts } from '@/components/admin/utils/fetchProduct'
import FlipDown from '@/components/user/countdown'
import 'flipdown/dist/flipdown.css'
import { favoritProductsService } from '@/api'

export default {
  data: () => ({
    loading: false,
    products: [],
    searchValue: '',
    isSearch: false,
    searchResult: []
  }),
  computed: {
    closedMarket () {
      return !this.$store.state.auth.user.statusMarket
    },
    marketInfoImg () {
      return this.$store.state.auth.user.pdt_provider.scheduleImg || false
    },
    market () {
      return this.$store.state.auth.user.provider
    },
    marketRetrieveText () {
      if (this.$store.state.auth.user.hasMarkets) {
        const start = `${this.$store.state.auth.user.openingDelivery.getHours()}:${this.minutesWithZero(this.$store.state.auth.user.openingDelivery)}`
        const end = `${this.$store.state.auth.user.closingDelivery.getHours()}:${this.minutesWithZero(this.$store.state.auth.user.closingDelivery)}`
        return `Récupération des paniers le ${this.$store.state.auth.user.openingDelivery.toLocaleDateString('fr-FR', {
          weekday: 'long', month: 'long', day: 'numeric'
        })} de ${start} à ${end}.`
      } else {
        return 'Aucun marché n\'est encore prévu'
      }
    },
    marketClosingText () {
      if (this.$store.state.auth.user.hasMarkets) {
        const end = `${this.$store.state.auth.user.closingMarket.getHours()}:${this.minutesWithZero(this.$store.state.auth.user.closingMarket)}`
        return ` Fermeture du marché le ${this.$store.state.auth.user.closingMarket.toLocaleDateString('fr-FR', {
        weekday: 'long', month: 'long', day: 'numeric'
      })} à ${end}.`
      } else {
        return 'Aucun marché n\'est encore prévu'
      }
    },
    productDisplay () {
      let display = []
      if (this.isSearch) {
        display = this.searchResult
      } else {
        display = this.products
      }
      return display
    },
    container () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          result.marginLeft = '50px'
          result.margin = '0px'
          break
        default:
          result.marginLeft = ''
          result.margin = ''
          break
      }
      return {
        margin: `margin: ${result.margin}`,
        marginLeft: `margin-left: ${result.marginLeft}`
      }
    }
  },
  async mounted () {
    await this.$nextTick()
    if (this.closedMarket && this.$store.state.auth.user.hasMarkets) {
      this.displayCountdown()
    }
  },
  methods: {
    async removeFromFavorites (product) {
      try {
        await favoritProductsService.remove(product.isFavorit)
        const index = this.products.findIndex(x => x.id === product.id)
        this.products[index].setFavorit([])
        this.$store.commit('notif/sendSuccess', 'Favoris supprimé')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async addToFavorites (pdtProductId) {
      try {
        const newFavorite = {
          userUserId: this.$store.state.auth.user.userId,
          pdtProductId
        }
        const favorit = await favoritProductsService.create(newFavorite)
        const index = this.products.findIndex(x => x.id === pdtProductId)
        this.products[index].setFavorit([favorit])
        this.$store.commit('notif/sendSuccess', 'Favoris ajouté')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async fetchItems (query) {
      this.loading = true
      try {
        this.products = await fetchProducts(
          query,
          this.$store
        )
      } catch (e) {
        setTimeout(async () => {
          this.$store.commit('notif/sendAlert', 'Veuillez rechargez la page')
        }, 1500)
      }
      this.loading = false
    },
    onSearch (value) {
      this.isSearch = !!value.length
      this.searchResult = this.products.filter(x =>
        x.productName.toLowerCase().includes(value.toLowerCase())
      )
    },
    launchCountDown (openDate) {
      new FlipDown(openDate.getTime() / 1000, {
        theme: 'blue'
      })
        // Start the countdown
        .start()
    },
    minutesWithZero (dt) {
      return (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes()
    },
    async displayCountdown () {
      await this.$nextTick()
      this.launchCountDown(
        new Date(this.$store.state.auth.user.openingMarket)
      )
    }
  }
}
</script>

<style lang='scss'>
.containerCard {
  width: 83%;
}

.countdown {
  height: 0;
  width: 120px;
  transform: scale(0.45);
}

/* Font styles */
.flipdown.flipdown__theme-blue {
  font-family: sans-serif;
  font-weight: bold;
}
/* Rotor group headings */
.flipdown.flipdown__theme-blue .rotor-group-heading:before {
  color: black;
}
/* Delimeters */
.flipdown.flipdown__theme-blue
  .rotor-group:nth-child(n + 2):nth-child(-n + 3):before,
.flipdown.flipdown__theme-blue
  .rotor-group:nth-child(n + 2):nth-child(-n + 3):after {
  background-color: #6495ed;
}
/* Rotor tops */
.flipdown.flipdown__theme-blue .rotor,
.flipdown.flipdown__theme-blue .rotor-top,
.flipdown.flipdown__theme-blue .rotor-leaf-front {
  color: #ffffff;
  background-color: #6495ed;
}
/* Rotor bottoms */
.flipdown.flipdown__theme-blue .rotor-bottom,
.flipdown.flipdown__theme-blue .rotor-leaf-rear {
  color: #efefef;
  background-color: #6495ed;
}
/* Hinge */
.flipdown.flipdown__theme-blue .rotor:after {
  border-top: solid 1px #6495ed;
}
</style>
