<template lang="pug">
v-select(
  :items='$store.state.admin.marketList',
  v-model='marketSelected',
  item-text='name',
  return-object,
  label='Choix du Marché',
  @change='updateMarket',
  outlined,
  dense,
  append-icon='$mdi-chevron-down'
)
  template(v-slot:selection='{item}') {{`${item.name} - ${item.description} -${item.ordered ? 'traitée' : 'non traitée'}`}}
  template(v-slot:item="{item}") {{`${item.name} - ${item.description} -${item.ordered ? 'traitée' : 'non traitée'} `}}
</template>

<script>
import { marketService } from '@/api'
export default {
  props: {
    fetchOrders: {
      type: Boolean,
      default: false
    },
    fetchAll: {
      type: Boolean,
      default: true
    },
    fetchClosedMarket: {
      type: Boolean,
      default: false
    },
    fetchIgnoreNextMarket: {
      type: Boolean,
      default: false
    },
    fromKultorCheckPage: {
      type: Boolean,
      default: false
    },
    ordered: {
      type: Boolean,
      default: null
    }
  },
  data () {
    return {
      marketSelected: {},
      queryAll: {
        query: {
          pdtSiteGroupingId: this.$store.state.admin.group.id
        }
      }
    }
  },
  watch: {
    '$store.state.admin.group.id' () {
      this.fetchMarketsList()
    }
  },
  mounted () {
    this.fetchMarketsList()
  },
  methods: {
    updateMarket () {
      this.$store.commit('admin/updateSelectedMarket', this.marketSelected)
      if (this.fetchOrders) {
        this.$emit('fetch-orders')
      }
      if (this.fromKultorCheckPage) {
        this.$emit('reset-field')
      }
    },
    async fetchMarketsList () {
      const query = this.queryAll
      if (this.fetchClosedMarket) {
        Object.assign(query, {
          query: {
            pdtSiteGroupingId: this.$store.state.admin.group.id,
            closing: { $lte: new Date() },
            $limit: 10,
            $sort: {
              closing: -1
            }
          }
        })
      }
      if (this.fetchIgnoreNextMarket) {
        Object.assign(query, {
          query: {
            pdtSiteGroupingId: this.$store.state.admin.group.id,
            opening: { $lte: new Date() },
            $limit: 10,
            $sort: {
              opening: -1,
              ordered: 1
            }
          }
        })
      }
      try {
        const { data } = await marketService.find(query)
        this.$store.commit('admin/updateMarketList', data)
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    }
  }
}
</script>
