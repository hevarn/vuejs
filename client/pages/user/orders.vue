<template lang="pug">
v-container
  v-row(justify="space-around")
    v-col.col-10
      v-select(
        :items="status",
        v-model="select",
        label="Voir mes commandes",
        dense,
        outlined,
        @change="fetchInvoices()",
        hide-details,
        append-icon="$mdi-chevron-down"
      )
  v-row(v-if="loadingPage")
    v-col.col-12
      LoadingKanopee
  v-row(v-else)
    v-container(v-if="ordersItem.length === 0")
      v-row
        v-col.col-12
          h2.text-center Il n'y a pas de commandes à afficher.
    v-container(v-else)
      v-row
        v-col.col-12
          v-expansion-panels(popout, focusable)
            v-expansion-panel(
              v-for="(item, i) in ordersItem",
              :key="i",
              @change="fetchItemList(item)"
            )
              v-expansion-panel-header
                template(v-slot:actions)
                  v-icon $mdi-chevron-down
                v-container
                  v-row(align="center", justify="space-between", dense)
                    v-col.col-12.col-md-7
                      span.body-1 Commande n°#[strong {{ item.number }}] passée le {{ new Date(item.created * 1000).toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }}
                      span.body-1(v-if="item.status === 'paid'") <br> #[i {{ isDelivered(item.metadata.delivered) ? 'Récupérée' : 'Non récupérée' }}]
                      span.body-1(v-if="!isDelivered(item.metadata.delivered)") <br> #[i {{ marketText(item.metadata) }}]
                    v-col.col-12.col-md-5
                      span.body-1 Prix total de la commande: #[strong {{ (item.total / 100).toFixed(2) }} €]
                      span.body-1(v-if="item.total !== item.amount_due") <br> Montant Payé : #[strong {{ (item.amount_due / 100).toFixed(2) }} €]
                      div(v-if="item.discount") <br>
                        span Bon de réduction de
                        span(v-if="item.discount.coupon.amount_off") #[strong {{ (item.discount.coupon.amount_off * 0.01).toFixed(2) }} €]
                        span(v-else) #[strong {{ item.discount.coupon.percent_off }} %] ({{ ((item.total * item.discount.coupon.percent_off) / 10000).toFixed(2) }} €)
                      div(v-if="item.post_payment_credit_notes_amount > 0")
                        span Avoir après paiement de #[strong {{ (item.post_payment_credit_notes_amount / 100).toFixed(2) }} €]
                  v-row(dense)
                    v-tooltip(top, v-if="item.status !== 'draft'")
                      template(v-slot:activator="{ on }")
                        v-btn(
                          fab,
                          icon,
                          small,
                          color="primary",
                          @click.stop="downloadInvoice(item)",
                          :loading="loadingInvoice",
                          v-on="on"
                        )
                          v-icon $mdi-printer
                      span Imprimer votre reçu
                    v-tooltip(top)
                      template(v-slot:activator="{ on }")
                        v-btn(
                          fab,
                          icon,
                          small,
                          color="primary",
                          @click.stop="addAllProducts(item, i)",
                          :loading="loadingAddCart",
                          v-on="on",
                          :disabled="!$store.state.auth.user.statusMarket"
                        )
                          v-icon $mdi-cart-arrow-down
                      span Pour récupérer votre ancienne commande et la mettre dans votre panier, cliquez ici.
                    v-tooltip(top, v-if="item.status === 'open'")
                      template(v-slot:activator="{ on }")
                        v-badge(overlap, dot, color="red", offset-x=15)
                          v-btn(
                            fab,
                            icon,
                            small,
                            @click.stop="payNow(item)",
                            v-on="on"
                          )
                            v-icon(
                              color="primary",
                              v-if="item.status === 'open'"
                            ) $mdi-cash-register
                      span Payer votre facture
              v-expansion-panel-content
                UserList(
                  :products="item.lines.data",
                  :orderDate="item.created",
                  :priceTotal="item.total",
                  :paidId="item.id",
                  :loadingList="loadingList",
                  :invoiceIndex="i",
                  :status="item.status",
                  @invoice-updated="fetchInvoice",
                  @add-product="addProduct"
                )
        v-col.col-12(v-if="paginationLength > 1")
          v-pagination(
            v-model="paginationPage",
            :length="paginationLength",
            circle,
            next-icon="$mdi-chevron-right",
            prev-icon="$mdi-chevron-left"
          )
</template>

<script>
import { paymentService, productsService, orderInfoService } from '@/api'
import DisplayedProduct from '@/components/DisplayedProduct'

export default {
  data () {
    return {
      orders: [],
      paginationPage: 1,
      paginationLimit: 30,
      paginationLength: 1,
      loadingPage: true,
      loadingAddCart: false,
      loadingInvoice: false,
      loadingDelivery: false,
      status: [{ value: 'paid', text: 'Commandes payées' }],
      select: 'paid',
      loadingList: false
    }
  },
  computed: {
    ordersItem () {
      let items = []
      if (this.orders.length > 0) {
        items = this.orders.slice(
          this.paginationLimit * (this.paginationPage - 1),
          this.paginationLimit * this.paginationPage - 1
        )
      }
      return items
    }
  },
  mounted () {
    this.fetchInvoices()
  },
  methods: {
    isDelivered (delivered) {
      return Number(delivered) === 1
    },
    marketText (eventsInvoice) {
      if (eventsInvoice.eventStartAt && eventsInvoice.eventEndAt) {
        return `Récupération du panier le ${new Date(
          eventsInvoice.eventStartAt
        ).toLocaleString('fr-FR', {
          weekday: 'long',
          day: '2-digit',
          month: 'long'
        })} entre ${new Date(eventsInvoice.eventStartAt).toLocaleString(
          'fr-FR',
          { hour: '2-digit', minute: '2-digit' }
        )} et  ${new Date(eventsInvoice.eventEndAt).toLocaleString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })}.`
      } else {
        const market = this.$store.state.auth.user.provider
        const dateDistriOpen = new Date(market.receptionOpen)
        const start = dateDistriOpen.toLocaleTimeString('fr-FR', {
          timeZone: 'Europe/Paris',
          hour: 'numeric',
          minute: 'numeric'
        })
        const end = new Date(market.receptionClose).toLocaleTimeString(
          'fr-FR',
          { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' }
        )
        return `Récupération du panier le ${dateDistriOpen.toLocaleDateString(
          'fr-FR',
          {
            timeZone: 'Europe/Paris',
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          }
        )} de ${start} à ${end}`
      }
    },
    async fetchInvoices () {
      this.loadingPage = true
      this.paginationPage = 1
      try {
        this.orders = await paymentService.find({
          query: { status: this.select, limit: this.paginationLimit }
        })
        this.paginationLength = Math.ceil(
          this.orders.length / this.paginationLimit
        )
      } catch (e) {
        this.$store.commit('notif/sendAlert', "Erreur lors de la récupération de vos commandes. Si le problème persiste, veuillez contacter l'administrateur")
      }
      this.loadingPage = false
    },
    async fetchItemList ({ id, lines, orders }) {
      if (lines.total_count !== lines.data.length) {
        this.loadingList = true
        lines.data = await orderInfoService.get(id)
        this.loadingList = false
      }
    },
    async fetchInvoice ({ paidId, index }) {
      this.loading = true
      try {
        const data = await paymentService.get(paidId)
        this.orders.splice(index, 1, this.formatInvoice(data))
      } catch (error) {}
      this.loading = false
    },
    downloadInvoice ({ charge, invoice_pdf: pdf }) {
      const url = charge ? charge.receipt_url : pdf
      window.open(url, '_blank')
    },
    async addProduct (order) {
      try {
        const productsList = []
        if (Array.isArray(order)) {
          const products = await productsService.find(order)
          products.forEach(product => {
            const previousProduct = order.find(x => x.pdtProductId === product.id)
            if (previousProduct) {
              productsList.push(new DisplayedProduct(product, previousProduct.quantity))
            }
          })
        } else {
          const product = await productsService.get(order.metadata.pdtProductId)
          productsList.push(new DisplayedProduct(product, order.quantity))
        }
        productsList.forEach(async product => {
          if (
            (!product.display || !product.isBio) &&
          (product.stock <= 0 || !product.display || !product.stock)
          ) {
            this.$store.commit('cart/changeProduct', product)
            this.$store.commit('cart/showChangeProduct', true)
          } else {
            await this.$store.dispatch('cart/addProduct', {
              product,
              quantityToAdd: product.qty
            })
          }
        })
      } catch (e) {
        if (e.code === 404) {
          this.$store.commit('notif/sendAlert', "Ce produit n'est plus disponible")
        } else {
          this.$store.commit('notif/sendAlert')
        }
      }
    },
    async addAllProducts (invoice) {
      this.loadingAddCart = true
      try {
        await this.fetchItemList(invoice)
        const newList = invoice.lines.data.map(({ metadata, quantity }) => ({ pdtProductId: Number(metadata.pdtProductId), quantity }))
        await this.addProduct(newList)
        this.$store.commit('notif/sendSuccess', 'Votre nouveau panier a été fait')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.loadingAddCart = false
    },
    payNow ({ hosted_invoice_url: url }) {
      window.open(url, '_blank')
    }
  }
}
</script>
