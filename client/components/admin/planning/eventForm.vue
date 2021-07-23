<template lang="pug">
v-dialog(
  v-model='dialogFormEvent'
  @click:outside='$emit("close-event-form")',
  max-width='600px',
  content-class='rounded'
)
  v-card.pa-3
    v-card-title
      v-spacer
      span.headline.text-center(v-if='isNewEvent') Ajouter un événement
      span.headline.text-center(v-if='isUpdate') Modifier un événement
    v-form(ref='form')
      v-text-field(
        v-model='name',
        :rules='[rules.required]',
        label='Nom de l\'événement'
      )
      v-text-field(
        v-model='description',
        :rules='[rules.required]',
        label='Description de l\'événement'
      )
      v-select(
        :items='typeEvent',
        :rules='[rules.required]',
        v-model='select',
        label='Type d\'événement',
        append-icon='$mdi-chevron-down'
      )
      v-select(
        :items='isSite',
        :rules='[rules.required]',
        v-model='site',
        item-text='name',
        return-object,
        label='Choix du site',
        append-icon='$mdi-chevron-down'
      )
      v-menu(
        ref='menuDate',
        v-model='menuStartDate',
        :close-on-content-click='false',
        :return-value.sync='date',
        transition='scale-transition',
        offset-y,
        min-width='290px'
      )
        template(v-slot:activator='{ on }')
          v-text-field(
            v-model='computedDateFormatted',
            :disabled='disable.date',
            :rules='[rules.required]',
            label='Date de l\'événement',
            prepend-icon='$mdi-calendar-today',
            readonly,
            v-on='on'
          )
        v-date-picker(
          v-model='date',
          @input='(menuStartDate = false), $refs.menuDate.save(date)',
          :min='maxDate',
          no-title,
          scrollable,
          locale='fr-fr'
        )
      v-row(justify='center')
        v-col(cols='6')
          v-menu(
            v-model='menuStartHours',
            :close-on-content-click='false',
            :nudge-right='40',
            transition='scale-transition',
            offset-y,
            min-width='290px',
            ref='menu',
            :return-value.sync='timeStart'
          )
            template(v-slot:activator='{ on }')
              v-text-field(
                v-model='timeStart',
                :disabled='disable.hourStart',
                :rules='[rules.required]',
                label='Heure de Début',
                prepend-icon='$mdi-timer',
                readonly,
                v-on='on'
              )
            v-time-picker(
              v-model='timeStart',
              :max='timeEnd',
              v-if='menuStartHours',
              @click:minute='$refs.menu.save(timeStart)',
              format='24hr'
            )
        v-col(cols='6')
          v-menu(
            v-model='menuEndHours',
            :close-on-content-click='false',
            :nudge-right='40',
            transition='scale-transition',
            offset-y,
            min-width='290px',
            ref='menu2',
            :return-value.sync='timeEnd'
          )
            template(v-slot:activator='{ on }')
              v-text-field(
                v-model='timeEnd',
                :disabled='disable.hourEnd',
                :rules='[rules.required]',
                label='Heure de Fin',
                prepend-icon='$mdi-timer',
                readonly,
                v-on='on'
              )
            v-time-picker(
              v-model='timeEnd',
              :min='timeStart',
              v-if='menuEndHours',
              @click:minute='$refs.menu2.save(timeEnd)',
              format='24hr'
            )
      v-text-field(
        v-model='nbParticipant',
        v-if='select === "Atelier"',
        :rules='[rules.required]',
        label='Nombre maximal de participants',
        type='number'
      )
      v-text-field(
        v-model='price',
        :disabled='disable.price',
        v-if='select === "Atelier"',
        :rules='[rules.required]',
        suffix='€',
        label='Prix',
        type='number'
      )
      v-text-field(
        v-model='pdfLinkKulteur',
        :rules='[rules.required]',
        suffix='PDF',
        label='Lien vers le PDF Kulteur'
      )

      v-text-field(
        v-model='pdfLinkKonsommateur',
        v-if='select === "Atelier"',
        :rules='[rules.required]',
        suffix='PDF',
        label='Lien vers le PDF Konsommateur'
      )
      v-textarea(
        v-model='misc',
        label='Autre liens utiles',
        hint='Separés par \';\''
      )
    v-card-actions
      v-btn(
        color='secondary',
        small,
        @click='dialogFormEvent = !dialogFormEvent; $emit("close-event-form");',
        rounded
      ) Annuler
      v-btn(
        v-if='isUpdate',
        @click='dialogRemove = true',
        :disabled='disable.remove',
        color='secondary',
        small,
        rounded,
        :loading='loadingRemove'
      )
        v-icon $mdi-trash-can-outline
      v-tooltip(top, v-if='disable.remove')
        template(v-slot:activator='{ on, attrs }')
          v-btn.pb-5(icon, small, v-on='on', v-bind='attrs')
            v-icon(color='green') $mdi-information-outline
        span La suppression de l'événement est impossible car vous avez déjà {{ userCurrent }} participant{{ userCurrent > 1 ? "s" : "" }}.
      v-spacer
      v-btn(
        color='primary',
        v-if='isNewEvent',
        small,
        @click='createEvents()',
        rounded,
        :loading='loadingCreate'
      ) Valider
      v-btn(
        color='primary'
        v-if='isUpdate'
        small
        @click='updateEvents()'
        rounded
        :loading='loadingUpdate'
      ) Modifier
    v-card-actions
      v-img(src='/traitperma.png')

  v-dialog(v-model='dialogRemove', max-width=400)
    v-card
      v-card-title Etes-vous sûr de vouloir supprimer #[strong {{  select === 'Culture' ? 'la ' : "l'"  }}{{ select.toLowerCase() }} {{ this.name }} du {{ new Date(date).toLocaleDateString("fr-FR", { weekday: "long", month: "long", day: "numeric" }) }}]
      v-card-actions
        v-spacer
        v-btn.ma-2(outlined, color='secondary', @click='dialogRemove = false') Annuler
        v-btn.ma-2(
          outlined,
          color='primary',
          @click='removeEvent',
          :loading='loadingRemove'
        ) Oui
      v-card-actions
        v-img(src='/traitperma.png')
</template>
<script>
import { eventsService, workshopsService } from '@/api'

export default {
  props: {
    isNewEvent: {
      type: Boolean,
      default: false
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: () => ({
    on: '',
    typeEvent: [
      { value: 'Atelier', text: 'Atelier' },
      { value: 'Culture', text: 'Culture' }
    ],
    dialogFormEvent: true,
    dialogRemove: false,
    menuStartDate: false,
    menuEndDate: false,
    menuStartHours: false,
    menuEndHours: false,
    name: '',
    misc: '',
    description: '',
    date: '',
    hour: '',
    timeStart: '',
    timeEnd: '',
    nbParticipant: 0,
    userCurrent: 0,
    price: 0,
    pdfLinkKulteur: '',
    pdfLinkKonsommateur: '',
    miscLink: '',
    select: '',
    disable: {
      date: false,
      hourStart: false,
      hourEnd: false,
      price: false,
      remove: false
    },
    maxDate: new Date().toISOString().slice(0, 10),
    site: '',
    rules: {
      required: value => !!value || 'Champ obligatoire',
      positive: v => v > 0 || 'Cette valeur doit être supérieur à zéro'
    },
    startTime: '',
    endTime: '',
    loadingUpdate: false,
    loadingCreate: false,
    loadingRemove: false
  }),
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
    isSite () {
      return this.$store.state.admin.providers.filter(
        item => item.isSite === true
      )
    }
  },
  mounted () {
    if (this.isUpdate && this.event) {
      if (this.event.fullEvent.workshop) {
        this.name = this.event.fullEvent.workshop.name
        this.pdfLinkKonsommateur = this.event.fullEvent.workshop.userSupport
        this.pdfLinkKulteur = this.event.fullEvent.workshop.kulteurSupport
        this.price = this.event.fullEvent.workshop.price
        this.misc = this.event.fullEvent.workshop.pdfLink
      }
      if (this.event.nbParticipant > 0) {
        this.disable = {
          date: true,
          hourStart: true,
          hourEnd: true,
          price: true,
          remove: true
        }
      }
      this.select = this.event.fullEvent.role
      this.userCurrent = this.event.fullEvent.userCurrent
      this.nbParticipant = this.event.fullEvent.userMax
      this.description = this.event.fullEvent.description
      this.site = this.isSite.filter(
        site => site.id === this.event.fullEvent.pdtProviderId
      )[0]
      this.date = this.event.start.substring(0, 10)
      this.timeStart = this.event.start.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      this.timeEnd = this.event.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  },
  methods: {
    formatDate (date) {
      if (!date) {
        return null
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    computeTs (date, time) {
      return Date.parse(`${date}T${time}`)
    },
    async createEvents () {
      if (this.$refs.form.validate()) {
        this.loadingCreate = true
        this.startTime = new Date(this.computeTs(this.date, this.timeStart))
        this.endTime = new Date(this.computeTs(this.date, this.timeEnd))

        let newEvent = {
          role: this.select,
          pdtProviderId: this.site.id,
          startAt: this.startTime.toString(),
          endAt: this.endTime.toString(),
          userCurrent: 0,
          userMax: this.nbParticipant,
          description: this.description
        }
        newEvent = await eventsService.create(newEvent)
        this.createWorkshop(newEvent)
      }
    },
    async createWorkshop (newEvent) {
      const newWorkshop = {
        name: this.name,
        description: this.description,
        userSupport: this.pdfLinkKonsommateur,
        kulteurSupport: this.pdfLinkKulteur,
        duration: this.diff_minutes(),
        price: this.price,
        pdfLink: this.misc,
        evenementEventId: newEvent.eventId
      }
      await workshopsService.create(newWorkshop)
      this.dialogFormEvent = !this.dialogFormEvent
      this.loadingCreate = false
      this.$emit('close-event-form')
    },
    async updateEvents () {
      if (this.$refs.form.validate()) {
        this.loadingUpdate = true
        this.startTime = new Date(this.computeTs(this.date, this.timeStart))
        this.endTime = new Date(this.computeTs(this.date, this.timeEnd))

        const newEvent = {
          role: this.select,
          pdtProviderId: this.site.id,
          startAt: this.startTime.toString(),
          endAt: this.endTime.toString(),
          userCurrent: this.event.nbParticipant,
          userMax: this.nbParticipant,
          description: this.description
        }
        try {
          await eventsService.update(this.event.fullEvent.eventId, newEvent)
          this.updateWorkshop()
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      }
      this.loadingUpdate = false
    },
    async updateWorkshop () {
      const newWorkshop = {
        name: this.name,
        description: this.description,
        userSupport: this.pdfLinkKonsommateur,
        kulteurSupport: this.pdfLinkKulteur,
        duration: this.diff_minutes(),
        price: this.price,
        pdfLink: this.misc,
        evenementEventId: this.event.fullEvent.eventId
      }
      try {
        await workshopsService.update(
          this.event.fullEvent.workshop.workshopId,
          newWorkshop
        )
        this.dialogFormEvent = !this.dialogFormEvent
        this.$emit('close-event-form')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async removeEvent () {
      this.loadingRemove = true
      try {
        await eventsService.remove(this.event.fullEvent.eventId)
        await this.removeWorkshop()
        this.dialogFormEvent = !this.dialogFormEvent
        this.$emit('close-event-form')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.loadingRemove = false
    },
    async removeWorkshop () {
      await workshopsService.remove(this.event.fullEvent.workshop.workshopId)
    },
    diff_minutes () {
      let diff = (this.endTime.getTime() - this.startTime.getTime()) / 1000
      diff /= 60
      return Math.abs(Math.round(diff))
    }
  }
}
</script>
