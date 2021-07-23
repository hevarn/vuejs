<template lang="pug">
  div
    v-app-bar.foreground(:dense='mobileStyle' app fixed :height='mobileStyle ? 60 : 80')
      v-avatar(tile :height='mobileStyle ? "50px": "80px"').ml-5
        v-img(:src='mobileStyle ? "/favicon.ico" : "/navLogo.png"' style="cursor:pointer" @click='$router.push("/")')
      v-spacer
      v-btn(v-for="(menu,i) in menus" :key="i" :to="menu.href" text v-if='!mobileStyle') {{menu.title}}
      v-spacer
      v-dialog(v-model='marketInfo')
        v-img(:src='marketInfoImg')
      v-btn.mr-3(icon outlined large color="accent" @click.stop="showCart = !showCart" :class="{'cartShake': cartShake}"
        @animationend="cartShake = false" v-if="$store.state.auth.user.isUser")
          v-badge(v-if="$store.getters['cart/totalPrice'] > 0" :content="`${$store.getters['cart/totalPrice'].toFixed(2)} €`" offset-x=50 overlap)
          v-badge(:value="qteCart" :content="qteCart" overlap)
            v-icon $mdi-cart
      v-btn(icon large color="accent" outlined v-model='marketInfo' @click.stop='marketInfo = true' v-if='marketInfoImg && !$store.state.auth.user.isAdmin').mr-3
        v-icon $mdi-help
      v-dialog(hide-overlay scrollable width="unset" v-if='!mobileStyle' v-model="showCart")
        UserCart(@closeCart="showCart = false"  @paymentSuccess='onPaymentSuccess')
          template(v-slot:bottom)
            v-btn(rounded small color="primary" @click="checkout" :loading='loadingStripePage'
              :disabled='!isPaiementAvailable|| !$store.state.auth.user.statusMarket')
              span(v-if='hasPaymentURL') Payez ici si vous n'êtes pas redirigé
              span(v-else) Payer mon panier
            v-tooltip(top v-if="!isPaiementAvailable || !$store.state.auth.user.statusMarket")
              template(v-slot:activator="{ on }")
                v-btn(icon small v-on="on")
                  v-icon(color='green') $mdi-information-outline
              span(v-if="!isPaiementAvailable") Le montant total de la commande sur la période du marché en cours doit être supérieur à {{$store.state.auth.user.minAmountMarket}} €.
              span(v-else) Le marché est actuellement fermé. Il est impossible de payer votre panier pour le moment.
      v-btn(color='accent' v-if='mobileStyle' large outlined icon @click="showDrawer = true")
        v-icon $mdi-menu
      v-menu(offset-y v-else-if='!mobileStyle')
        template(v-slot:activator="{ on }")
          v-btn(color='accent' rounded large outlined v-on="on") Bonjour {{$store.state.auth.user.firstname}}
            v-icon $mdi-chevron-down
        v-list
          v-list-item(v-for="(item, index) in items" :to="item.href" :key="index" )
            v-list-item-icon
              v-icon(color='accent') {{ item.icon }}
            v-list-item-title {{item.title}}
        v-divider
        v-btn(@click="logOut" block) Se déconnecter
    UserChangeProduct(v-show="showChangeProduct")
    v-navigation-drawer(v-if='mobileStyle' width='90%' app fixed color='lightgray' v-model="showCart" touchless).foreground.text-center
      UserMobileCart(@paymentSuccess='onPaymentSuccess')
      template(v-slot:prepend).primary--text
        v-row.mt-1
          v-img(src='/logonavbar.png' contain height="90px" width="150px")
          v-btn(text @click='showCart = !showCart')
            v-icon $mdi-close
        v-img(src='/traitperma.png' contain max-height='25px')
        v-row(v-if="$store.state.cart.coupon" no-gutters)
          v-col.col-12
            span(v-if="$store.state.cart.coupon.amount_off").subtitle-2 Bon de réduction de: {{($store.state.cart.coupon.amount_off * 0.01).toFixed(2)}} €
            span(v-else).subtitle-2 Bon de réduction de: {{$store.state.cart.coupon.percent_off}} %
            v-btn.ml-2(icon x-small color="primary" @click="removeCoupon")
              v-icon $mdi-close
        v-row(justify="center" no-gutters v-else)
          v-col.col-9
            v-text-field(dense solo append-outer-icon="$mdi-checkbox-marked-circle" v-model="coupon" placeholder="Bon de réduction" @click:append-outer="validCoupon" style="height: 40px")
        v-row(justify="center")
          v-col.col-11
            v-select(:items="events" v-model="selectEvent" item-text="startAt" label="Sélectionner un créneau horaires" outlined solo dense color="primary" return-object hide-details @click="fetchEvents" append-icon="$mdi-chevron-down" style="font-size: 0.85em" :disabled="!$store.state.auth.user.statusMarket")
              template(v-slot:selection="event")
                span {{new Date(event.item.startAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}} - {{new Date(event.item.endAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}}
              template(v-slot:item="data")
                span {{new Date(data.item.startAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}} - {{new Date(data.item.endAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}}
        v-row(justify="center" no-gutters)
          v-col.col-12
            span.font-weight-bold.subtitle-2 Prix total TTC : {{ totalPrice.toFixed(2) }} €
          v-col.col-12
            v-btn(rounded color="primary" @click="checkout" :loading='loadingStripePage'
              :disabled='!isPaiementAvailable  || !selectEvent || !$store.state.auth.user.statusMarket')
              span(v-if='hasPaymentURL') Payez ici si vous n'êtes pas redirigé
              span(v-else) Payer mon panier
          v-col.col-12
            span(v-if='!$store.state.auth.user.statusMarket').ml-1.caption.font-italic (le marché est actuellement fermé)
            span(v-if='isPaiementAvailable && $store.state.auth.user.statusMarket').ml-1.caption.font-italic ({{$store.state.auth.user.minAmountMarket}}€ min)
            span(v-if=' !selectEvent && $store.state.auth.user.statusMarket').ml-1.caption.font-italic (Sélectionner un créneau horaire)
      template(v-slot:append).primary--text
        h1.primary--text(v-if='$store.state.cart.cart.length > 0').title A récupérer {{new Date($store.state.auth.user.provider.receptionOpen).toLocaleDateString('fr-FR', { weekday: 'long' })}} prochain
    v-dialog(v-model='paymentRequested' max-width="400" content-class='rounded')
      UserPaymentRequest(@close='paymentRequested = false' :href='payURL')
    v-dialog(v-model='paymentDialogSuccess' max-width="290" content-class='rounded')
      UserPaymentSuccess(@close='paymentDialogSuccess = false' :href='paidWithRefund')
    v-dialog(v-model="dialogSelectEvent" max-width=450 content-class='rounded' persistent)
      v-card.pa-2(v-if="loadingSelectEvent")
        v-card-title Recherche de créneaux disponibles
        SmallLoading
      v-card.pa-2(v-else)
        v-card-title Nombre de créneaux disponibles : {{events.length}}
        v-card-actions
          v-select(:items="events" v-model="selectEvent" item-text="startAt" label="Sélectionner votre créneau horaire" dense color="primary" return-object append-icon="$mdi-chevron-down")
            template(v-slot:selection="event")
              span {{new Date(event.item.startAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}} - {{new Date(event.item.endAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}}
            template(v-slot:item="data")
              span {{new Date(data.item.startAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}} - {{new Date(data.item.endAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })}}
        v-card-actions
          v-btn.ml-5(rounded small color="primary" @click="dialogSelectEvent = false; selectEvent= null") Continuer mon marché
          v-btn.ml-5(rounded small color="primary" @click="checkout(); dialogSelectEvent = false" :loading='loadingStripePage'
              :disabled='!isPaiementAvailable || !selectEvent') Payer mon panier
        v-img(src='/traitperma.png')
    v-navigation-drawer.foreground(v-if='mobileStyle' right app color='lightgray' v-model="showDrawer" touchless).text-center
      v-icon.ma-1(@click="logOut" color='accent') $mdi-logout
      v-btn.ma-3(color='accent' rounded outlined) Bonjour {{$store.state.auth.user.firstname}}
      v-divider
      v-list(nav).text-center
        v-list-item(v-for="(menu,i) in menus" :key="i"  :to="menu.href" text @click="showDrawer = false")
          v-list-item-icon
            v-icon(color='accent') {{ menu.icon }}
          v-list-item-title.text-left {{menu.title}}
      v-divider
      v-list(nav).text-center
        v-list-item(v-for="(menu,i) in items" :key="i"  :to="menu.href" text @click="showDrawer = false")
          v-list-item-icon
            v-icon(color='accent') {{ menu.icon }}
          v-list-item-title.text-left {{menu.title}}
      v-divider
      v-container(fluid)
        v-row(align-center justify-end)
          v-img(src='/logonavbar.png' contain height="100px" width="150px").mt-5
</template>

<script>
import { couponsStripeService, eventsService } from '@/api'
export default {
  data () {
    return {
      marketInfo: false,
      cartHeaders: [
        { text: '', value: 'picture', align: 'start', sortable: false },
        {
          text: 'Article',
          value: 'description',
          align: 'center',
          sortable: false
        },
        { text: 'Qté', value: 'qty', align: 'center' },
        { text: 'PU (€)', value: 'unitPrice', align: 'center' },
        { text: 'Total (€)', value: 'priceTotalTTC', align: 'center' },
        { text: '', value: 'delete', sortable: false, align: 'center' }
      ],
      showDrawer: false,
      loadingCoupon: false,
      showCart: false,
      cartShake: false,
      loadingAdd: false,
      coupon: '',
      paymentDialogSuccess: false,
      loadingStripePage: false,
      payURL: '',
      loadingRemove: false,
      loadingSelectEvent: false,
      paidWithRefund: false,
      paymentRequested: false,
      events: [],
      dialogSelectEvent: false,
      selectEvent: null,
      adminMenu: [
        {
          href: '/admin/products',
          title: 'Tableau de pilotage',
          icon: '$mdi-chart-gantt'
        },
        { href: '/admin/orders', title: 'Commandes', icon: '$mdi-cart' },
        {
          href: '/admin/setting',
          title: 'Tables admin',
          icon: '$mdi-table-edit'
        },
        {
          href: '/admin/varietyManager',
          title: 'Mes variétés',
          icon: '$mdi-food-apple'
        },
        {
          href: '/workshops',
          title: 'Mes ateliers',
          icon: '$mdi-food-apple'
        },
        {
          href: '/admin/kulteurs',
          title: 'Kulteurs',
          icon: '$mdi-barcode-scan'
        }
      ],
      kultorMenu: [
        {
          href: '/admin/kulteurs',
          title: 'Kulteurs',
          icon: '$mdi-barcode-scan'
        },
        {
          href: '/workshops',
          title: 'Mes ateliers',
          icon: '$mdi-food-apple'
        }
      ],
      userMenu: [
        {
          href: '/user/items',
          title: 'Faire son marché',
          icon: '$mdi-cart'
        },
        {
          href: '/workshops',
          title: 'Ateliers',
          icon: '$mdi-account-switch'
        },
        {
          href: '/user/community',
          title: 'Kommunauté',
          icon: '$mdi-google-circles-extended'
        }
      ]
    }
  },
  computed: {
    marketInfoImg () {
      return this.$store.state.auth.user.pdt_provider.scheduleImg || false
    },
    isPaiementAvailable () {
      return this.$store.getters['cart/isPaiementAvailable']
    },
    totalPrice () {
      return this.$store.getters['cart/totalPrice']
    },
    mobileStyle () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          return window.innerWidth < 890
        default:
          return false
      }
    },
    menus () {
      let menu = this.userMenu
      if (this.$store.state.auth.user.isAdmin) {
        menu = this.adminMenu
      } else if (this.$store.state.auth.user.isKulteur) {
        menu = this.kultorMenu
      }
      return menu
    },
    items () {
      return this.$store.state.auth.user.isAdmin
        ? [
            { href: '/account', title: 'Mon compte', icon: '$mdi-account' },
            { href: '/', title: 'Accueil', icon: '$mdi-home' }
          ]
        : [
            { title: 'Mon compte', href: '/account', icon: '$mdi-account' },
            {
              href: '/user/orders',
              title: 'Mes commandes',
              icon: '$mdi-history'
            },
            {
              href: '/user/support',
              title: "Besoin d'aide ?",
              icon: '$mdi-help-circle'
            }
          ]
    },
    qteCart () {
      return this.$store.state.cart.cart.length
    },
    showChangeProduct () {
      return this.$store.state.cart.changeProduct
    },
    hasPaymentURL () {
      return this.payURL !== ''
    }
  },
  watch: {
    qteCart () {
      this.cartShake = true
    },
    totalPrice () {
      clearTimeout(this.checkIntentTimer)
      this.payURL = ''
    }
  },
  methods: {
    checkIntent (stripe, secret) {
      this.checkIntentTimer = setTimeout(async () => {
        const { paymentIntent } = await stripe.retrievePaymentIntent(secret)
        if (paymentIntent.status !== 'succeeded') {
          this.checkIntent(stripe, secret)
        } else {
          this.onPaymentSuccess()
        }
      }, 2500)
    },
    async checkout () {
      if (this.selectEvent) {
        this.loadingStripePage = true
        try {
          if (!this.hasPaymentURL) {
            const { url, secret, stripe, isPaid } = await this.$store.dispatch(
              'cart/checkout',
              {
                eventId: this.selectEvent.eventId,
                eventStartAt: this.selectEvent.startAt,
                eventEndAt: this.selectEvent.endAt
              }
            )
            if (isPaid) {
              this.onPaymentSuccess(true)
              this.loadingStripePage = false
              return
            }
            this.paymentRequested = true
            this.payURL = url
            this.checkIntent(stripe, secret)
          }
          window.open(this.payURL, '_blank')
        } catch (e) {
          let notif
          if (e.code === 406) {
            const product = this.$store.state.cart.cart.find(
              p => p.product.favouriteRefId === Number(e.data.pdtReferenceId)
            )
            this.$store.commit('cart/changeProduct', product)
            this.$store.commit('cart/showChangeProduct', true)
            notif = `Le produit ${product.kind} ${product.variety} n'est plus disponible`
          } else if (e.code === 400) {
            notif = e.message
          }
          this.$store.commit('notif/sendAlert', notif)
        }
        this.loadingStripePage = false
      } else {
        this.dialogSelectEvent = true
        this.loadingSelectEvent = true
        this.fetchEvents()
      }
    },
    async removeCoupon () {
      try {
        await couponsStripeService.update(this.$store.state.cart.coupon.id, {
          coupon: null
        })
        this.$store.commit('cart/removeCoupon')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async validCoupon () {
      if (this.coupon.length < 3) {
        return
      }
      this.loadingCoupon = true
      try {
        const response = await couponsStripeService.get(this.coupon)
        this.$store.commit('cart/addCoupon', response)
        this.$store.commit('notif/sendSuccess', 'Le bon de réduction a bien été pris en compte.')
      } catch (error) {
        this.$store.commit('notif/sendAlert', "Le bon de réduction entré n'est pas valide.")
      }
      this.loadingCoupon = false
      this.coupon = ''
    },
    async onPaymentSuccess (paidWithRefund = false) {
      this.paymentRequested = false
      this.paidWithRefund = paidWithRefund
      this.paymentDialogSuccess = true
      this.showCart = false
      if (this.$fb) {
        this.$fb.track('Purchase', { value: this.$store.getters['cart/totalPrice'], currency: 'EUR' })
      }
      this.$store.commit('cart/removeCoupon')
      try {
        await this.$store.dispatch('cart/removeAllProduct')
        this.$store.commit('cart/emptyCart')
        this.selectEvent = null
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async fetchEvents () {
      const { data } = await eventsService.find({
        query: {
          marketEventId: this.$store.state.auth.user.marketEventsId,
          freeEvents: true,
          role: 'Reception'
        }
      })
      this.events = data
      this.loadingSelectEvent = false
    },
    logOut () {
      this.$router.push('/')
      setTimeout(() => {
        this.$store.commit('cart/emptyCart')
        this.$store.dispatch('auth/logout')
      }, 500)
    }
  }
}
</script>

<style scoped>
.foreground {
  z-index: 199 !important;
}

.cartShake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.capitalize {
  text-transform: capitalize;
  word-break: normal;
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
    background-color: green;
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
    background-color: silver;
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
    background-color: green;
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
    background-color: silver;
  }
}
</style>
