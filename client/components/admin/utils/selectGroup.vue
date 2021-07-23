<template lang="pug">
v-select(
  :items='$store.state.admin.siteGroupings',
  v-model='groupSelected',
  item-text='name',
  return-object,
  label='Choix du Groupement de sites',
  @change='updateGroup',
  :outlined='product',
  :dense='product',
  append-icon='$mdi-chevron-down'
)
</template>

<script>
export default {
  props: {
    removeSelectedProvider: {
      type: Boolean,
      default: false
    },
    fetchOrders: {
      type: Boolean,
      default: false
    },
    product: {
      type: Boolean,
      default: true
    },
    fromKultorCheckPage: {
      type: Boolean,
      default: false
    },
    fromMercuPage: {
      type: Boolean,
      default: false
    },
    fromOrdersPage: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      groupSelected: this.$store.state.admin.group
    }
  },
  methods: {
    updateGroup (value) {
      this.$store.commit('admin/changeGroup', value)
      if (this.removeSelectedProvider) {
        this.$store.commit('admin/changeSelectedProvider', {})
        this.$emit('remove-provider-for-view')
      }
      if (this.fetchOrders) {
        this.$emit('fetch-orders')
      }
      if (this.fromKultorCheckPage) {
        this.$emit('reset-field')
      }
      if (this.fromMercuPage) {
        this.$emit('new-group')
      }
      if (this.fromOrdersPage) {
        // remove selectedMarket from store
        // this.$store.commit('admin/updateSelectedMarket', null)
        this.$store.commit('admin/updateMarketList', [])
      }
    }
  }
}
</script>
