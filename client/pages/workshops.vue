<template lang="pug">
v-container
  div(v-for="(card, index) in content" :key="index" v-if="$store.state.auth.user.isUser")
    VisitCard(:card="card" :reverseStyle="indicatorRow(index)")
  EventList(
    v-if="$store.state.auth.user.isUser"
    :events="events"
    @subscribe="subscribe"
    @update-events="fetchEvents()"
  )
  v-tabs(centered, v-model="tab" v-if="$store.state.auth.user.isKulteur || $store.state.auth.user.isAdmin")
    v-tab
      v-btn(fab text outlined x-small @click="dialogFormEventAdd = true" icon).mr-3
        v-icon $mdi-plus
      span Liste des Ateliers
    v-tab Calendrier
  v-tabs-items(v-model="tab")
    v-tab-item
      EventList(
        :events="events",
        @subscribe="subscribe",
        @update-events="fetchEvents()"
      )
    v-tab-item
      Planning( @subscribe="subscribe")

  v-dialog(v-model="ConfirmSubscribe", max-width=600, content-class="rounded")
    v-card.pa-2
      v-card-title Confirmation d'inscription
      v-card-text Vous êtes sur le point de vous inscrire à : #[strong {{ workshop.workshop.name }}] <br>
      v-card-text le {{ new Date(workshop.startAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }} pour un prix de #[strong {{ workshop.workshop.price }} €].
      v-card-actions
        v-spacer
        v-btn(
          rounded,
          color="primary",
          @click="checkout",
          :loading="paymentLoading"
        ) Payer {{ workshop.role === 'Culture' ? 'la ' : "l'" }}{{ workshop.role }}
      v-img(src="/traitperma.png")

  v-dialog(
    v-model="paymentDialogSuccess",
    max-width="290",
    content-class="rounded"
  )
    UserPaymentSuccess(
      @close="paymentDialogSuccess = false",
      :href="paidWithRefund"
    )
  v-dialog(v-model="paymentRequested", max-width=400, content-class="rounded")
    UserPaymentRequest(@close="paymentRequested = false", :href="payURL")
  AdmPlangEventForm(
    v-if="dialogFormEventAdd",
    mode="ajout",
    @close-event-form="dialogFormEventAdd = !dialogFormEventAdd"
  )
</template>

<script>
import { eventsService, providersService } from '@/api'
import { setEventsFromRaw } from '@/utils/planningHandler'

export default {
  props: {
    provider: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    content: [
      {
        image: '/at3.jpeg',
        title: 'Des ateliers pour se reconnecter ',
        // eslint-disable-next-line no-irregular-whitespace
        content: `Nos ateliers de sensibilisation « Rencontres Durables » sont conçus et animés par les Kanopée Kulteurs, sous forme d’ateliers théoriques et pratiques, ludiques et pédagogiques. 
                Développés en partenariat avec E-graine, les Rencontres Durables abordent de nombreux thèmes du développement durable en lien avec la nourriture, de sa création à sa destruction.
                Durée : 30 minutes + accès au supports d’ateliers en ligne.
                Nb de personnes max. : 15 personnes (10 en alerte COVID).`,
        logo: '/traitperma.png'
      },
      {
        image: '/at1.jpeg',
        title: 'Une Kommunauté locale',
        content: `Rencontrez vos voisins au moment de la collecte des paniers hebdomadaires. <br>
                    Venez vous cultiver lors des «Rencontres Durables».
                    <span class="wordSelect">Échangez</span> entre vous sur vos lieux de culture et en vous connectant à notre site.`,
        logo: '/traitperma.png'
      }
    ],
    dialogFormEventAdd: false,
    tab: null,
    events: [],
    eventsRaw: [],
    workshop: {
      workshop: {
        name: ''
      }
    },
    paymentRequested: false,
    payURL: '',
    ConfirmSubscribe: false,
    paymentLoading: false,
    paymentDialogSuccess: false,
    paidWithRefund: false,
    tabText: 'Liste des Rencontres'
  }),
  async mounted () {
    const query = { $limit: 300, $sort: { startAt: -1 } } // TODO add infinite loader for viewing more results
    if (this.$store.state.auth.user.isAdmin) {
      Object.assign(query, {
        pdtProviderId: this.$store.state.admin.providers.filter(
          ({ isSite }) => isSite
        ).map(x => x.id)
      })
    } else if (this.$store.state.auth.user.isKulteur) {
      Object.assign(query, { pdtProviderId: this.$store.state.auth.user.pdtProviderId })
    } else if (this.$store.state.auth.user.isUser) {
      Object.assign(query, { pdtProviderId: this.$store.state.auth.user.pdtProviderId, role: ['Reception', 'Atelier'] })
    }
    const { data } = await eventsService.find({ query })
    this.events = setEventsFromRaw(
      data,
      this.$store.state.auth.user.userId,
      this.$store.state.auth.user.rank
    )
    if (this.$store.state.auth.user.isKulteur || this.$store.state.auth.user.isAdmin) {
      this.tabText = 'liste des événements'
    }
  },
  methods: {
    indicatorRow (id) {
      let row
      if (id % 2) {
        row = 'row-reverse'
      } else {
        row = 'row'
      }
      return {
        'flex-direction': `${row}`
      }
    },
    async fetchProvider () {
      try {
        this.providersInfo = await providersService.get(this.provider)
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    formatDate (date) {
      if (!date) {
        return null
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    async fetchEvents () {
      let pdtProviderId = this.$store.state.auth.user.pdtProviderId
      if (this.$store.state.auth.user.isAdmin) {
        pdtProviderId = this.$store.state.admin.providers.filter( // TODO display event by site grouping ???
          ({ isSite }) => isSite
        ).map(x => x.id)
      }
      const { data } = await eventsService.find({
        query: { pdtProviderId, $limit: 300, $sort: { startAt: -1 } }
      })
      this.events = setEventsFromRaw(
        data,
        this.$store.state.auth.user.userId
      )
    },
    subscribe ({ fullEvent }) {
      this.workshop = fullEvent
      this.ConfirmSubscribe = true
    },
    async checkout () {
      this.paymentLoading = true
      try {
        if (!this.hasPaymentURL) {
          const { url, secret, stripe, isPaid } = await this.$store.dispatch(
            'cart/checkout',
            {
              eventId: this.workshop.eventId,
              eventStartAt: this.workshop.startAt,
              eventEndAt: this.workshop.endAt,
              workshopId: this.workshop.workshop.workshopId
            }
          )
          if (isPaid) {
            this.onPaymentSuccess(true)
            this.paymentLoading = false
            return
          }
          this.paymentRequested = true
          this.payURL = url
          this.checkIntent(stripe, secret)
        }
        window.open(this.payURL, '_blank')
      } catch (error) {
        if (error.code === 400) {
          this.$store.commit('notif/sendAlert', error.message)
        } else {
          this.$store.commit('notif/sendAlert')
        }
      }
      this.paymentLoading = false
    },
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
    onPaymentSuccess (paidWithRefund = false) {
      if (this.$fb) {
        this.$fb.track('Purchase', { value: this.$store.getters['cart/totalPrice'], currency: 'EUR' })
      }
      this.paymentRequested = false
      this.ConfirmSubscribe = false
      this.paymentDialogSuccess = true
      setTimeout(() => {
        this.fetchEvents()
      }, 3000)
    }
  }
}
</script>
