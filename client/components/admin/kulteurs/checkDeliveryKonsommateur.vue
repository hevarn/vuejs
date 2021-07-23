<template lang="pug">
  v-card(:loading='loading')
    v-card-title
      h4 Distribution Konsommateurs
    v-card-text
      v-row(v-if="$store.state.auth.user.isAdmin || $store.state.auth.user.isKulteur")
        v-col(cols="12" sm="6" align="center")
          AdmUtlsSelectGroup(fromKultorCheckPage @reset-field="references = [], siteSelectedID = 0, deliverySelected = []")
        v-col(cols="12" sm="6" align="center")
          AdmUtlsSelectMarket(fromKultorCheckPage @reset-field="references = [], siteSelectedID = 0, deliverySelected = []" fetchClosedMarket)
        v-col(cols="12" align="center")
          v-select(
            :items="$store.state.admin.providersBG.filter(x => x.isSite)"
            item-text="name"
            item-value="id"
            label="Site de distribution"
            v-model="siteSelectedID"
            outlined
            dense
            @change="fetchOrdersBySite"
            append-icon="$mdi-chevron-down"
          )
      v-stepper(v-model='step' v-if="siteSelectedID").elevation-0
        v-stepper-header.elevation-0
          v-stepper-step(:complete="step > 1" step="1" complete-icon="$mdi-check-circle-outline") Chargement
          v-divider
          v-stepper-step(step="2" complete-icon="$mdi-check-circle-outline") Controle
          v-divider
          v-stepper-step(step="3" complete-icon="$mdi-check-circle-outline") Commandes non livrées
        v-stepper-items
          v-stepper-content(step="1")
            v-row
              v-col.col-12(justify='center'  align='center' v-if='!deliveries.length')
                h1(v-if="!loading") Aucune commande à livrer - essayez plus tard
                h1(v-else) Chargement en cours ...
              v-col.col-12(justify='center'  align='center' v-else)
                h3(class="secondary--text" v-if="!$store.state.admin.selectedMarket.ordered") Attention cette commande n'a pas été traitée
                v-btn(color="secondary" @click="step = 2" v-if="!$store.state.admin.selectedMarket.ordered") accéder aux commandes quand même
                v-btn(color="primary" @click="step = 2" v-else) accéder aux commandes
          v-stepper-content(step="2")
            v-card
              v-card-text
                v-row
                  v-col.col-12.elevation-1
                    v-row(no-gutters)
                      h3 Filtrer la Recherche :
                    v-row
                      v-col.col-12.col-md-4
                        v-btn-toggle(v-model="toggleFilter" rounded)
                          v-tooltip(top)
                            template(v-slot:activator="{ on, attrs }")
                              v-btn(icon small v-on="on" v-bind="attrs" large)
                                v-icon(color="primary") $mdi-file-document-outline
                            span Recherche par numéro de facture.
                          v-tooltip(top)
                            template(v-slot:activator="{ on, attrs }")
                              v-btn(icon small v-on="on" v-bind="attrs" large)
                                v-icon(color="primary") $mdi-account
                            span Recherche par nom ou prénom.
                          v-tooltip(top)
                            template(v-slot:activator="{ on, attrs }")
                              v-btn(icon small v-on="on" v-bind="attrs" large)
                                v-icon(color="primary") $mdi-clock
                            span Recherche par créneau horaire de début ou fin.
                      v-col.col-12.col-md-8
                          v-menu(v-if="toggleFilter === 2" ref="menu" max-width="290px" min-width="290px" v-model="menuTime" :close-on-content-click="false" :return-value.sync="filter" transition="scale-transition" offset-x)
                            template(v-slot:activator="{on, attrs }")
                              v-text-field(v-model="filter" readonly v-bind="attrs" v-on="on" clearable)
                            v-time-picker(v-if="menuTime" v-model="filter" format="24hr" scrollable color="primary" @click:minute="$refs.menu.save(filter)")
                          v-text-field(v-else v-model="filter" :disabled="inputFilter" :label="toggleFilter === null ? 'Sélectioner le type de recherche' : ''")
                    v-select.pt-0(label="Sélectionnez la commande" :items="deliveriesFilter" item-text="number" return-object v-model="deliverySelected" @change="setProduct" append-icon="$mdi-chevron-down" :menu-props="{ closeOnContentClick: false, closeOnClick: false }")
                      template(v-slot:item="data")
                        span {{ data.item.number }} - {{ data.item.customer_name }} (le {{new Date(data.item.metadata.eventStartAt).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', month: 'long', day: 'numeric'})}} entre {{new Date(data.item.metadata.eventStartAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}} et {{new Date(data.item.metadata.eventEndAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}})
                  v-col.ml-5( v-if="deliverySelected && deliverySelected.lines && deliverySelected.lines.data.length")
                    span Facture du {{new Date(deliverySelected.created * 1000).toLocaleString()}}
                    span <br> Konsommateur: {{deliverySelected.customer_name}}
                    span <br> Mail: {{deliverySelected.customer_email}}
                    span <br> Site: {{deliverySelected.metadata.SiteName}}
                    span <br> Créneau: Entre {{new Date(deliverySelected.metadata.eventStartAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}} et {{new Date(deliverySelected.metadata.eventEndAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}}
                    v-divider
                    span(v-if="deliverySelected && deliverySelected.lines && deliverySelected.lines.data.length") Modifiez directement la quantité si nécessaire en cliquant sur sa valeur
                v-row(v-if="deliverySelected && deliverySelected.lines && deliverySelected.lines.data.length" )
                  v-col.col-12(align="center")
                    v-data-table(
                      :loading='loadingList'
                      :headers="deliveryHeaders"
                      :items="deliverySelected.lines.data"
                      :items-per-page="deliverySelected.lines.data.length"
                      :footer-props={
                        itemsPerPageText: 'Item par page',
                        itemsPerPageOptions: [-1, 10, 25, 50],
                        prevIcon: '$mdi-chevron-left',
                        nextIcon: '$mdi-chevron-right'
                      }
                      :header-props={
                        sortIcon: '$mdi-arrow-up',
                        sortByText:'Filtrer par'
                      }
                    )
                      template(v-slot:item.imageURL="{ item }")
                        v-avatar
                          v-img(
                            lazy-src="/logoKanopeeWhite.png"
                            :src="item.metadata.imageURL"
                            alt="fruit"
                            height="40"
                            width="40")
                      template(v-slot:item.metadata.referenceProduct="{ item }")
                        span(title="catégorie/unité/distance/site/pays") {{item.metadata.referenceProduct}}
                      template(v-slot:item.isBio="{ item }")
                        v-img(
                          lazy-src="/logoKanopeeWhite.png"
                          :src="item.metadata.isBio === 'true' ? '/ab.png' : '/0km.png'"
                          alt="logo"
                          height="40"
                          width="30")
                      template(v-slot:item.quantity="{item}")
                        v-edit-dialog(
                          :return-value.sync="item.quantity"
                        ) {{ item.quantity }}
                          template(v-slot:input)
                            v-text-field(
                              v-model="item.quantity"
                              label="Entrez la quantité livrée"
                              single-line
                              type="number"
                              min="0"
                            )
                  v-col.col-12(align="center")
                    v-btn(@click="validDelivery" color="primary" :loading="loadingValidation") Valider la réception
              v-card-actions
                v-spacer
                v-btn(@click="generateOrders" color="primary") Générer les reçus
                v-btn(@click='step = 3') Accéder aux commandes non livrées
          v-stepper-content(step="3")
            v-data-table(:items="deliveries" :headers="noDeliveryHeaders"  :footer-props="{ itemsPerPageText: 'Item par page', prevIcon: '$mdi-chevron-left',   nextIcon: '$mdi-chevron-right' }" :header-props="{ sortIcon: '$mdi-arrow-up' }" @click:row='emitRowClicked')
            v-card-actions
              v-btn(@click='step = 2') Retour
              v-spacer
              v-btn(color='primary' @click='validateAll' loading="loading") Valider toutes les commandes
</template>

<script>
import {
  stocksService,
  paymentService,
  refundService,
  orderInfoService
} from '@/api'
import { createInvoiceReceiptOrders } from '@/utils/invoice/receiptOrders'
export default {
  data () {
    return {
      step: 1,
      deliveries: [],
      loadingList: false,
      deliveryFetched: false,
      deliverySelected: {},
      loading: false,
      deliveryHeaders: [
        { text: 'Produit', value: 'description', sortable: false },
        {
          text: 'Réference',
          value: 'metadata.referenceProduct',
          sortable: false
        },
        { text: 'Distance', value: 'isBio', sortable: false },
        { text: 'Image', value: 'imageURL', sortable: false },
        { text: 'Quantité', value: 'quantity', sortable: false },
        { text: 'Unité', value: 'metadata.packaging', sortable: false }
      ],
      noDeliveryHeaders: [
        { text: 'Nom', value: 'customer_name' },
        { text: 'Mail', value: 'customer_email' },
        { text: 'Téléphone', value: 'customer_phone' }
      ],
      menuTime: false,
      toggleFilter: null,
      filter: '',
      siteSelectedID: 0,
      loadingValidation: false
    }
  },
  computed: {
    deliveriesFilter () {
      if (this.toggleFilter === 0) {
        return this.deliveries.filter(({ number }) => {
          return number.toLowerCase().match(this.filter.toLowerCase())
        })
      } else if (this.toggleFilter === 1) {
        return this.deliveries.filter(delevery => {
          return delevery.customer_name
            .toLowerCase()
            .match(this.filter.toLowerCase())
        })
      } else if (this.toggleFilter === 2) {
        return this.deliveries.filter(delevery => {
          return new Date(delevery.metadata.eventStartAt)
            .toLocaleTimeString('fr-FR', {
              timeZone: 'Europe/Paris',
              hour: '2-digit',
              minute: '2-digit'
            })
            .toLowerCase()
            .match(this.filter.toLowerCase()) || !delevery.metadata.eventStartAt
        })
      }
      return this.deliveries
    },
    inputFilter () {
      if (this.toggleFilter === 0 || this.toggleFilter > 0) {
        return false
      } else if (this.toggleFilter === null) {
        return true
      }
      return true
    }
  },
  watch: {
    toggleFilter () {
      this.filter = ''
    }
  },
  methods: {
    async generateOrders () {
      for (let index = 0; index < this.deliveries.length; index++) {
        const { lines, id } = this.deliveries[index]
        if (lines.total_count !== lines.data.length) {
          lines.data = await orderInfoService.get(id)
        }
      }
      const pdf = createInvoiceReceiptOrders(this.deliveries)
      pdf.open()
    },
    async fetchOrdersBySite () {
      try {
        this.deliveries = []
        this.step = 1
        this.deliverySelected = []
        this.loading = true
        this.deliveries = await paymentService.find({
          query: {
            delivered: 0,
            marketId: this.$store.state.admin.selectedMarket.id,
            created: {
              gte: new Date(this.$store.state.admin.selectedMarket.opening).getTime() / 1000,
              lte: new Date(this.$store.state.admin.selectedMarket.closing).getTime() / 1000
            },
            siteId: this.siteSelectedID,
            status: 'paid'
          }
        })
        if (this.deliveries.length > 0) {
          this.deliveries.sort((a, b) => {
            if (
              new Date(a.metadata.eventStartAt) <
              new Date(b.metadata.eventStartAt)
            ) {
              return -1
            } else {
              return 1
            }
          })
        }
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.deliveryFetched = true
      this.loading = false
    },
    formatNewStockObject (invoice) {
      const { data } = invoice.lines
      const providersProduct = data.filter(ref => ref.metadata.isBio === 'true')
      return providersProduct.map(ref => ({
        referenceProvider: ref.metadata.referenceProduct,
        qtyExpected:
          -ref.expected * (0 + ref.metadata.disassemble / 100 || 1) ||
          -ref.quantity * (0 + ref.metadata.disassemble / 100 || 1),
        qtyReceived: -ref.quantity * (0 + ref.metadata.disassemble / 100 || 1),
        buyPrice:
          (ref.price.unit_amount / 100) *
          ref.quantity *
          (0 + ref.metadata.disassemble / 100 || 1),
        pdtReferenceId: ref.metadata.favouriteRefId
      }))
    },
    validDelivery () {
      this.loadingValidation = true
      this.confirmDelivery()
      const refProviders = this.formatNewStockObject(this.deliverySelected)
      if (refProviders.length) {
        this.ajustStockProvider(refProviders)
      }
      this.filter = ''
    },
    async ajustStockProvider (refProviders) {
      try {
        await stocksService.create(refProviders)
        this.$store.commit('notif/sendSuccess', 'Stocks fournisseurs ajustés')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async confirmDelivery () {
      try {
        await paymentService.patch(this.deliverySelected.id, { delivered: 1 })
        const needRefund = this.checkQuantity()
        if (needRefund.length) {
          this.refund(needRefund)
        }
        this.deliveries.splice(
          this.deliveries.indexOf(this.deliverySelected),
          1
        )
        this.deliverySelected = {}
        this.$store.commit('notif/sendSuccess', 'Facture ajustée')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async refund (needRefund) {
      try {
        needRefund.push({ invoiceId: this.deliverySelected.id })
        await refundService.create(needRefund, {
          query: { creditNotes: true }
        })
        this.$store.commit('notif/sendSuccess', 'Avoir généré')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    checkQuantity () {
      const needRefund = []
      this.deliverySelected.lines.data.forEach(product => {
        if (product.expected > product.quantity) {
          needRefund.push(product)
        }
      })
      return needRefund
    },
    async fetchItemList ({ id, lines, orders }) {
      if (lines.total_count !== lines.data.length) {
        this.loadingList = true
        lines.data = await orderInfoService.get(id)
        this.loadingList = false
      }
    },
    async setProduct () {
      this.loadingValidation = false
      await this.fetchItemList(this.deliverySelected)
      this.deliverySelected.lines.data.forEach(element => {
        element.expected = element.quantity
      })
    },
    async validateAll () {
      this.loading = true
      try {
        const deliverAll = []
        this.deliveries.forEach(invoice => {
          const invoiceFormated = this.formatNewStockObject(invoice)
          if (invoiceFormated.length) {
            this.ajustStockProvider(invoiceFormated)
          }
          deliverAll.push(paymentService.patch(invoice.id, { delivered: 1 }))
        })
        await Promise.all(deliverAll)
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.loading = false
    },
    emitRowClicked (delivery) {
      this.step = 2
      this.deliverySelected = delivery
    }
  }
}
</script>

<style scoped>
.user {
  border: 1px solid #316827;
  font-weight: 800;
  background-color: #aecd6b;
  color: #316827;
}
</style>
