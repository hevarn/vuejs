<template lang="pug">
  v-card
    v-card-title
      h4 Bon de réception Fournisseur
    v-card-text
      v-row
        v-col(cols="12")
          AdmUtlsSelectGroup(v-if="$store.state.auth.user.isAdmin")
        SmallLoading(v-if="loadingFetch")
        v-col(cols="12" sm="6" align="center")
          v-select(
            :items="providerList"
            item-text="name"
            return-object
            v-model="selectedProvider"
            label="Fournisseur"
            outlined
            dense
            @change="fecthOrdersByProvider"
            append-icon="$mdi-chevron-down"
          )
        v-col(cols="12" sm="6" align="center")
          v-select(
            :items="deliveries"
            item-text="orderNum"
            item-value="orderNum"
            v-model="selectedOrder"
            label="Numéro de commande"
            outlined
            dense
            @change="changeOrder"
            append-icon="$mdi-chevron-down"
          )
    v-card-text(v-if="delivery.length")
      v-row
        p Facture {{delivery[0].pdt_reference.pdt_provider.name}} {{new Date(delivery[0].createdAt).toLocaleString()}}
      v-row
        p Modifiez directement la quantité si nécessaire en cliquant sur sa valeur
      v-row
        v-data-table(
          :headers="headers"
          :loading="loading"
          loading-text="Chargement en cours...Veuillez patienter"
          :items="delivery"
          loader-height="50"
          color="#010101"
          :items-per-page="delivery.length"
          :footer-props={
            itemsPerPageText: 'Item par page',
            itemsPerPageOptions: [-1, 10, 25, 50],
            prevIcon: '$mdi-chevron-left',
            nextIcon: '$mdi-chevron-right'
          },
          :header-props={
          sortIcon: '$mdi-arrow-up',
          sortByText:'Filtrer par'
        }
        )
          template(v-slot:item.pdt_reference.kanopeeReference="{ item }")
            span(title="catégorie/unité/distance/pays") {{item.pdt_reference.kanopeeReference.split('_').slice(2,6).join('/')}}
          template(v-slot:item.action="{item}")
            v-edit-dialog(
              :return-value.sync="item.received"
            ) {{ item.received }}
              template(v-slot:input)
                v-text-field(
                  v-model="item.received"
                  label="Edit"
                  single-line
                  type="number"
                )
      v-row(justify="center" align="center" v-if="delivery.length")
        v-col(cols="12" sm="6")
          v-img(src="/logoButton.png")
        v-col(cols="12" sm="6" align="center")
          v-btn(
            :loading="loading"
            @click="postNewStock"
            color="primary"
          ) Valider la réception
</template>

<script>
import { orderProvidersService, providersService, stocksService } from '@/api'
import deliveryCheck from '@/utils/invoice/deliveryCheck'
export default {
  data () {
    return {
      headers: [
        { text: 'Référence', value: 'pdt_reference.providerReference' },
        { text: 'Référence Kanoppe', value: 'pdt_reference.kanopeeReference' },
        { text: 'Prix', value: 'buyPrice' },
        { text: 'Description', value: 'pdt_reference.infoRef' },
        { text: 'Cdt.', value: 'pdt_reference.package' },
        // { text: 'quant. attendue', value: 'qty' },
        { text: 'Unité', value: 'pdt_reference.pdt_product.buyUnity.name' },
        { text: 'Quantité', value: 'action' }
      ],
      loading: false,
      loadingFetch: false,
      delivery: [],
      deliveries: [],
      providers: [],
      selectedProvider: {},
      max25chars: v => v.length <= 10 || 'Trop de caractères!',
      selectedOrder: []
    }
  },
  computed: {
    providerList () {
      let list = this.providers
      if (this.$store.state.auth.user.isAdmin) {
        list = this.$store.state.admin.providersBG.filter(x => !x.isSite)
      }
      return list
    }
  },
  mounted () {
    if (this.$store.state.auth.user.isKulteur) {
      this.fetchProviders()
    }
  },
  methods: {
    putProviders (value) {
      this.providers = this.$store.state.admin.providers.filter(
        x => x.pdtSiteGroupingId === value
      )
    },
    async fecthOrdersByProvider () {
      this.loadingFetch = true
      try {
        const query = {
          query: { pdtProviderId: this.selectedProvider.id, full: true, delivered: 0, $sort: { createdAt: -1 } }
        }
        const { data } = await orderProvidersService.find(query)
        this.deliveries = data
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.loadingFetch = false
    },
    async validDelivery () {
      const delivery = this.delivery.map(({ id }) => id)
      try {
        await orderProvidersService.patch(
          null,
          { delivered: true },
          { query: { id: delivery } }
        )
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    changeOrder () {
      this.loading = true
      const delivery = this.deliveries.map(function (x) {
        return { ...x, received: x.qty }
      })
      this.delivery = delivery.filter(x => x.orderNum === this.selectedOrder)
      this.loading = false
    },
    async postNewStock () {
      this.loading = true
      const data = this.delivery.map(function (x) {
        return {
          referenceProvider: x.pdt_reference.kanopeeReference,
          qtyExpected: x.qty,
          qtyReceived: x.received,
          buyPrice: x.buyPrice,
          pdtReferenceId: x.pdtReferenceId
        }
      })
      try {
        await stocksService.create(data)
        await this.validDelivery()
        await this.generatePdf()
        this.$store.commit('notif/sendSuccess', 'réception enregistré')
        this.$emit('close-window')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.loading = false
    },
    async fetchProviders () {
      try {
        const { data } = await providersService.find({
          query: {
            pdtSiteGroupingId: this.$store.state.auth.user.siteGrouping.id,
            isSite: false
          }
        })
        this.providers = data
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    generatePdf () {
      try {
        // Open PDF in new window blocked by browser
        const data = this.delivery.map(function (x) {
          return {
            referenceProvider: x.pdt_reference.providerReference,
            referenceKanopee: x.pdt_reference.kanopeeReference,
            description: x.pdt_reference.infoRef,
            cdt: x.pdt_reference.package,
            unity: x.pdt_reference.pdt_product.buyUnity.name,
            qtyExpected: x.qty,
            qtyReceived: x.received,
            buyPrice: x.buyPrice,
            pdtReferenceId: x.pdtReferenceId
          }
        })
        deliveryCheck(data, this.selectedOrder, this.selectedProvider).open()
      } catch (e) {
        this.$store.commit('notif/sendAlert', "Votre navigateur bloque l'ouverture des popups. Merci d'autoriser l'ouverture de popup sur ce site")
      }
    }
  }
}
</script>
