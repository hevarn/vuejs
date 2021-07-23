<template lang="pug">
  v-container(fluid)
    v-row
      v-img(:src="list.src" :height="list.size")
    v-row(justify="center")
      h1 {{list.title}}
    v-row(v-if="$store.state.admin.loadingPage")
      v-col(v-for="p in 12" :key="p" cols=6 sm=4 md=3 lg=2)
        v-skeleton-loader(type='card')
    v-row
      v-col(cols=6 sm=4 md=3 lg=2 v-for="product in productsList" :key="product.id")
        ProductCard(:product="product" isVisitorPage @open-dialog-connect="$emit('open-dialog-connect')")
      infinite-loading(@infinite="infiniteHandler")
        span(slot="no-more")
        span(slot="no-results")
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
export default {
  components: { InfiniteLoading },
  props: {
    list: {
      type: Object,
      default: () => ({
        title: 'Nos Fruits',
        size: '25vh',
        src: '/KonceptPartOne.jpg',
        products: []
      })
    }
  },
  data () {
    return {
      maxCardsToDisplay: 6
    }
  },
  computed: {
    productsList () {
      return this.list.products.slice(0, this.maxCardsToDisplay)
    }
  },
  methods: {
    infiniteHandler (state) {
      if (this.list.products.length <= this.maxCardsToDisplay) {
        state.complete()
      } else {
        state.loaded()
        this.maxCardsToDisplay += 3
      }
    }
  }
}
</script>
