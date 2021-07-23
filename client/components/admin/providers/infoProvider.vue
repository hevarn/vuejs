<template lang="pug">
v-container
  v-row
    v-col(
      cols='12',
      sm='6',
      md='4',
      lg='3',
      v-if='infos',
      v-for='([key, value], index) in Object.entries(infos)',
      :key='index'
    )
      v-select(
        v-if='truthyFalsyValues.includes(key)',
        v-model='infos[key]',
        :label='infos.isSite ? headerKult[index] : headerProv[index]',
        :items='truthyOrFalsy',
        :disabled='!advanced && unUdaptableKey(key)',
        append-icon='$mdi-chevron-down'
      )
      v-text-field(
        v-else,
        v-model='infos[key]',
        :disabled='!advanced && unUdaptableKey(key)',
        :label='infos.isSite ? headerKult[index] : headerProv[index]'
      )
    v-card-actions
      v-btn(@click='advanced = !advanced', color='secondary') Mode Avancé
      v-btn(@click.stop='ValidateUpdateProvider = true', color='primary') valider les changements
    v-dialog(v-model='ValidateUpdateProvider', width=400)
      v-card
        v-card-title Modification des informations
        v-card-text Voulez-vous modifier les informations de #[strong {{ infos.name }}] ?
        v-card-actions
          v-spacer
          v-btn.ma-2(
            outlined,
            color='secondary',
            @click='ValidateUpdateProvider = false'
          ) Annuler
          v-btn.ma-2(outlined, color='primary', @click='putProvider') Oui
</template>

<script>
import { providersService } from '@/api'

export default {
  props: {
    provider: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      ValidateUpdateProvider: false,
      infos: {},
      truthyFalsyValues: ['isSite', 'isPrivate'],
      truthyOrFalsy: [
        { text: 'OUI', value: 1 },
        { text: 'NON', value: 0 }
      ],
      headerKult: [
        'Nom du fournisseur/site',
        'Référent du site',
        'Mail du référent',
        'Tel du site',
        'Nom du kulteur',
        'Mail du kulteur',
        'Tel du Kulteur',
        'Photo du kulteur/site',
        "Nbr d'employés",
        "Code d'identification",
        'Adresse su site',
        'Site',
        'Site privé',
        'nbr de colis/ prix 1',
        'Montant minimum de commande',
        'groupement de site'
      ],
      headerProv: [
        'Nom du fournisseur/site',
        'Tel du frs',
        "Code d'identification",
        'Adresse su fournisseur',
        'Site',
        'nbr de colis/ prix 1',
        'nbr de colis/ prix 2',
        'nbr de colis/ prix 3',
        'nbr de colis/ prix 4',
        'nbr de colis/ prix 5',
        'groupement de site'
      ],
      advanced: false,
      advencedKeys: [
        'isSite',
        'isPrivate',
        'packaging1',
        'packaging2',
        'packaging3',
        'packaging4',
        'packaging5',
        'pdtSiteGroupingId'
      ]
    }
  },
  watch: {
    provider () {
      this.fetchProvider()
    }
  },
  mounted () {
    this.fetchProvider()
  },
  methods: {
    async fetchProvider () {
      if (this.provider) {
        try {
          this.infos = await providersService.get(this.provider)
          delete this.infos.id
          delete this.infos.receptionClose
          delete this.infos.receptionOpen
          delete this.infos.createdAt
          delete this.infos.updatedAt
          if (!this.infos.isSite) {
            delete this.infos.nameKultor
            delete this.infos.telKultor
            delete this.infos.mailKultor
            delete this.infos.nbEmployees
            delete this.infos.admin
            delete this.infos.avatar
            delete this.infos.isPrivate
            delete this.infos.mailAdmin
            delete this.infos.telKultor
          }
          if (this.infos.isSite) {
            delete this.infos.packaging2
            delete this.infos.packaging3
            delete this.infos.packaging4
            delete this.infos.packaging5
          }
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      }
    },
    async putProvider () {
      try {
        await providersService.patch(this.provider, this.infos)
        this.$store.commit('notif/sendSuccess', `Modification de ${this.infos.name} effectuée avec succés`)
        this.ValidateUpdateProvider = false
      } catch (e) {
        this.$store.commit('notif/sendAlert', `Echec de la modification de ${this.infos.name}, ${e.message}`)
      }
    },
    unUdaptableKey (key) {
      let isUnUdaptableKey = false
      if (this.advencedKeys.includes(key)) {
        isUnUdaptableKey = true
      }
      return isUnUdaptableKey
    }
  }
}
</script>
