<template lang="pug">
  v-col(align="center").col-xs-12.col-sm-6.col-md-4
    v-btn-toggle(v-model="toggle_exclusive" multiple rounded :dense="wideScreen" @change="fetchByDistance" color='green accent-4')
      v-btn(:large="wideScreen" :disabled="loading")
        v-img(src='/0km.png' max-width=20)
      v-btn(:large="wideScreen" :disabled="loading")
        v-img(src='/ab.png' max-width=20)
      v-btn(v-if="!this.$store.state.auth.user.isAdmin" :large="wideScreen" :disabled="loading")
        v-icon(color="red") $mdi-heart
        slot
    v-navigation-drawer.foregroundDrawer(absolute left permanent
    mini-variant :mini-variant.sync='stateDrawer' :mini-variant-width='mini' clipped )
      v-list(nav)
        v-list-item
          v-btn(icon @click.stop="stateDrawer = !stateDrawer" )
            v-icon(v-if='stateDrawer') $mdi-chevron-right
            v-icon(v-else) $mdi-chevron-left
        v-list-item-group( align="end" )
          v-list-item(@click="fetchByProduct(null)")
            v-list-item-avatar
              v-img(src='/products/all.png' width="20px" contain)
            v-list-item-title Tout
          v-list-item(@click="fetchByProduct('spotlight')")
            v-list-item-avatar
              v-img(src='/products/spotlight.png' width="20px" contain)
            v-list-item-title En ce moment
        v-list-group(v-for='({id, name, pdt_kinds, picture}) in typesList' :key='id' append-icon="$mdi-chevron-down" no-action)
          template(v-slot:activator)
            v-list-item-avatar(@click="fetchByProduct({types: id})")
              v-img(:src='picture' width="20px" contain)
            v-list-item-title(v-text="name" @click="fetchByProduct({types: id})")
          v-list-group(v-for='({id, name}) in pdt_kinds' :key='id' sub-group)
            template(v-slot:activator)
              v-list-item(@click="fetchByProduct({kind: id})")
                v-list-item-title(v-text="name")

</template>

<script>
import { typesService } from '@/api'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    products: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    toggle_exclusive: [],
    typesList: [],
    queryDistance: {},
    queryProduct: {},
    spotlight: false,
    stateDrawer: true,
    stateFavorites: false,
    drawer: false
  }),
  computed: {
    mini () {
      if (this.$vuetify.breakpoint.name === 'xs') {
        return '50px'
      } else {
        return '70px'
      }
    },
    wideScreen () {
      let dense = true
      if (
        this.$vuetify.breakpoint.name === 'xs' ||
        this.$vuetify.breakpoint.name === 'sm'
      ) {
        dense = false
      }
      return dense
    }
  },
  mounted () {
    this.fetchByProduct()
    this.fetchTypes()
  },
  methods: {
    fetchByDistance () {
      const query = {}
      if (this.toggle_exclusive.includes(0) && this.toggle_exclusive.includes(1)) {
        if (this.toggle_exclusive[this.toggle_exclusive.length - 1] === 1) {
          this.toggle_exclusive.splice(this.toggle_exclusive.indexOf(0), 1)
        } else {
          this.toggle_exclusive.splice(this.toggle_exclusive.indexOf(1), 1)
        }
      }
      this.toggle_exclusive.forEach(option => {
        if (option === 0 || option === 1) {
          Object.assign(query, { pdtDistanceId: option > 0 ? { $gt: 1 } : 1 })
        }
        if (option === 2) {
          // favorit
          Object.assign(query, { favorit: 1 })
        }
      })
      this.queryDistance = query
      this.$emit('fetch-items', { query: { ...query, ...this.queryProduct } })
    },
    fetchByProduct (queryProduct) {
      if (queryProduct === 'spotlight') {
        this.spotlight = !this.spotlight
        queryProduct = { spotlight: this.spotlight ? 1 : 0 }
      }
      this.queryProduct = queryProduct
      this.$emit('fetch-items', { query: { ...queryProduct, ...this.queryDistance } })
    },
    async fetchTypes () {
      try {
        this.typesList = await typesService.find({ query: { productList: this.$store.state.admin.group.id || this.$store.state.auth.user.groupId } })
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    }
  }
}
</script>

<style scoped>
.foregroundDrawer {
  z-index: 10 !important;
}
</style>
