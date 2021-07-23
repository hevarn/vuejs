<template lang="pug">
  v-container
    v-row
      v-col(cols="12" sm="6" md="9")
        v-card-title {{history.kanopeeReference}} référencé chez {{history.pdt_provider.name}}
        v-card-text {{history.infoRef}} conditionné par  {{history.package}}
      v-col(cols="12" sm="3")
        v-btn(@click="() => addNewStock = !addNewStock" color="primary" small align='center') Modifier les disponibilités
    v-row(v-if="addNewStock")
      v-col(cols="12" sm="6" md="3")
        v-text-field(
          v-model="newStock.quantity"
          label="Stock disponible"
          type="number"
          min="0"
          @input="checkValue"
          :rules="[rules.required, rules.positive]")
      v-col(cols="12" sm="6" md="3")
        v-text-field(
          v-model="newPrice.buyPrice1"
          label="Prix Estimé"
          type="number"
          min="0"
          @input="checkValue"
          :rules="[rules.required, rules.positive]")
      v-col(cols="12" sm="6" md="3")
        v-btn(@click="postNewStock(false)" v-if="checkedValue" color="primary") valider
      v-col.mt-3(cols="12" sm="6" md="3").text-center.text-sm-right
        v-btn(@click="postNewStock(true)" color="secondary") raz des stocks
    v-row
      v-data-table(
        :headers="headers"
        :items="stocks"
        :loading="loading"
        loading-text="Chargement en cours...Veuillez patienter"
        dense
        :footer-props={
          itemsPerPageText: 'Item par page',
        prevIcon: '$mdi-chevron-left',
        nextIcon: '$mdi-chevron-right'
        }
        :header-props={
          sortIcon: '$mdi-arrow-up',
          sortByText:'Filtrer par'
        }
      ).col-12
        template(v-slot:item.createdAt="{ item }") {{new Date(item.createdAt).toLocaleString()}}
        template(v-slot:item.solde="{ item }") {{stocks.map(x => x.quantity).slice(stocks.indexOf(item),stocks.length).reduce((a, c) => a + c)}}
</template>

<script>
import { kulteurStocksService, buyHistoriesService } from '@/api'

export default {
  props: {
    history: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    }
  },
  data () {
    return {
      addNewStock: false,
      newPrice: {
        buyPrice1: 0,
        pdtReferenceId: this.history.id
      },
      newStock: {
        quantity: 0,
        pdtStocksActionId: 1,
        pdtReferenceId: this.history.id
      },
      stocks: [],
      loading: false,
      headers: [
        { text: 'Date', value: 'createdAt' },
        { text: 'Label', value: 'pdt_stocksAction.name' },
        { text: 'Mouvement', value: 'quantity' },
        { text: 'Solde', value: 'solde' }
      ],
      rules: {
        required: value => !!value || 'Champ obligatoire',
        positive: v => v > 0 || 'Cette valeur doit être supérieur à zéro'
      },
      checkedValue: false
    }
  },
  mounted () {
    this.fecthLastStocks()
  },
  methods: {
    async postNewStock (raz) {
      if (raz) {
        this.newStock.pdtStocksActionId = 2
      } else {
        this.newStock.pdtStocksActionId = 1
        this.newStock.solde = parseInt(this.newStock.quantity)
      }
      try {
        await kulteurStocksService.create(this.newStock)
        await buyHistoriesService.create(this.newPrice)
        this.fecthLastStocks()
        this.$emit('update-product')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async fecthLastStocks () {
      try {
        const { id } = this.history
        const { data } = await kulteurStocksService.find({
          query: { pdtReferenceId: id, historyStock: true }
        })
        this.stocks = data
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    checkValue (value) {
      this.checkedValue = false
      if (this.newStock.quantity > 0 && this.newPrice.buyPrice1 > 0) {
        this.checkedValue = true
      }
    }
  }
}
</script>
