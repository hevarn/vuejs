<template lang="pug">
v-container
  v-row
    v-card-title.pa-2
      v-icon.mb-4.mr-2(color='secondary', large) $mdi-alert-outline
      span Attention, Privilégier l'association de nouvelles références via la mercuriale
  v-form(lazy-validation, ref='form')
    v-row
      v-col(cols='12', sm='6', md='3')
        v-select(
          :items='$store.state.admin.providersBG.filter((x) => !x.isSite)',
          item-text='name',
          return-object,
          label='Sélectionnez votre Fournisseur',
          @change='providerSelected',
          append-icon='$mdi-chevron-down',
          :rules='[rules.required]'
        )
      v-col(cols='12', sm='6', md='3')
        v-text-field(
          v-model='neoRef.providerReference',
          label='Référence fournisseur du produit',
          :rules='[rules.required]'
        )
      v-col(cols='12', sm='6', md='3')
        v-text-field(
          v-model='neoRef.infoRef',
          label='Description complémentaire'
        )
      v-col(cols='12', sm='6', md='3')
        v-text-field(
          v-model='neoRef.package',
          label='Conditionnement',
          :rules='[rules.required, rules.positive]'
        )
    v-col.pa-0(align='end')
      v-btn(@click.stop='popupValidateRef = true', color='primary') Valider cette référence
      v-dialog(v-model='popupValidateRef', width=400)
        v-card
          v-card-title Valider la référence
          v-card-text Voulez-vous valider la référence du produit #[strong {{ product.kind }} {{ product.variety }}] ?
          v-card-actions
            v-spacer
            v-btn.ma-2(
              outlined,
              color='secondary',
              @click='popupValidateRef = false'
            ) Annuler
            v-btn.ma-2(outlined, color='primary', @click='addNewRef') Oui
</template>

<script>
import { referencesService } from '@/api'

export default {
  props: {
    product: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    }
  },
  data () {
    return {
      popupValidateRef: false,
      rules: {
        required: value => !!value || 'Champ obligatoire',
        positive: v => v > 0 || 'Cette valeur doit être supérieur à zéro'
      },
      neoRef: {
        pdtProviderId: '',
        kanopeeReference: this.product.sharedReference,
        providerReference: '',
        infoRef: '',
        package: '',
        pdtProductId: this.product.id
      }
    }
  },
  methods: {
    async addNewRef () {
      try {
        if (this.$refs.form.validate()) {
          await referencesService.create(this.neoRef)
          this.$emit('close')
        }
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    providerSelected (value) {
      this.neoRef.pdtProviderId = value.id
      this.neoRef.kanopeeReference = `${this.neoRef.kanopeeReference}_${value.code}`
    }
  }
}
</script>
