<template lang="pug">
  v-card
    v-stepper(v-model="marketStepper")
      v-stepper-header
        v-stepper-step(:complete="marketStepper > 1" step="1") Création des marchés {{$store.state.admin.group.name}}
        v-divider
        v-stepper-step(:complete="marketStepper > 2" step="2") Horaires des marchés
        v-divider
        v-stepper-step(:complete="marketStepper > 3" step="3") Ajout des sites
        v-divider
        v-stepper-step(:complete="marketStepper > 4" step="4") Horaires des distributions
      v-stepper-items
        v-stepper-content(step="1")
          AdmMarkCreateMarket(:marketsList="marketsList" @next-step="setTime" @delete-market="deleteMarket" @change-status="changeStatus")
        v-stepper-content(step="2")
          AdmMarkSetMarketTime(:market="selectedMarket" @next-step="validMarket" @previous-step="() => marketStepper = 1")
        v-stepper-content(step="3")
          AdmMarkAddSitesToMarket(:market="selectedMarket" @next-step="setRecoveryCart" @previous-step="() => marketStepper = 2")
        v-stepper-content(step="4")
          AdmMarkSetRecovery(:market="selectedMarket" @next-step="restartPage" @previous-step="() => marketStepper = 3")
</template>

<script>
import { marketService } from '@/api'
export default {
  data () {
    return {
      marketStepper: 1,
      marketsList: [],
      selectedMarket: {}
    }
  },
  mounted () {
    this.fetchMarkets()
  },
  methods: {
    async fetchMarkets () {
      try {
        const { data } = await marketService.find({
          query: {
            pdtSiteGroupingId: this.$store.state.admin.group.id,
            $sort: { closing: -1 },
            $limit: 11,
            setMarket: true
          }
        })
        this.marketsList = data
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async deleteMarket (id) {
      try {
        await marketService.remove(id)
        this.fetchMarkets()
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async validMarket (value) {
      this.selectedMarket = value
      try {
        if (this.selectedMarket.id) {
          await marketService.patch(this.selectedMarket.id, this.selectedMarket)
        } else {
          this.selectedMarket = await marketService.create(this.selectedMarket)
        }
        this.marketStepper = 3
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    setTime (value) {
      this.selectedMarket = value
      this.marketStepper = 2
    },
    async setRecoveryCart () {
      try {
        this.selectedMarket = await marketService.get(this.selectedMarket.id, { query: { setMarket: true } })
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.marketStepper = 4
    },
    async changeStatus (value) {
      try {
        await marketService.patch(value.id, { isOpen: value.isOpen })
        await this.fetchMarkets()
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    restartPage () {
      // this.fetchMarkets()
      this.marketStepper += 1
      this.$emit('close-set-market')
      // this.selectedMarket = {}
    }
  }
}
</script>
