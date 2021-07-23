<template lang="pug">
  v-container
    v-col.px-0.pb-0(align='end')
      v-btn(@click.stop="popupDeleteRef= true" color="secondary" small)
        v-icon $mdi-trash-can-outline
      v-dialog(v-model="popupDeleteRef" width=400)
            v-card
              v-card-title Suppression de la référence
              v-card-text Voulez-vous supprimer la référence du produit #[strong {{history.infoRef}}] ?
              v-card-text(v-if="isAloneRef") Attention Référence unique! Vous êtes sur le point de supprimer la totalité de la fiche produit.
              v-card-actions
                v-spacer
                v-btn.ma-2(outlined color="secondary" @click="popupDeleteRef = false") Annuler
                v-btn.ma-2(outlined color="primary" @click="deleteRef") Oui
    v-col.col-12.pt-0.px-0
      v-card-title {{history.kanopeeReference}} référencé chez {{history.pdt_provider.name}}
      v-card-text {{history.infoRef}} conditionné par  {{history.package}} sous la référence {{ history.providerReference }} - stock: {{history.providerStockValue}}
    v-card-actions.px-0.pt-0(align='end')
      v-btn(@click="() => addNewPrice = !addNewPrice" color="primary" small) Ajouter un nouveau prix
      v-btn(@click="() => updatePackage = !updatePackage" color="primary" small) Modifier le conditionnement
    v-row(v-if="updatePackage")
      v-col(cols="12" sm="6" md="2")
        v-text-field(v-model="history.package"  label="nouveau conditionnement")
      v-col(cols="12" sm="6" md="2")
        v-btn(@click="updateNewPackage" color="primary" small) Valider le conditionnement
    v-form(lazy-validation ref="form")
      v-row(v-if="addNewPrice")
        v-col(cols="12" sm="6" md="2")
          v-text-field(v-model="newPrice.buyPrice1" label="Prix 1" type="number" min="0" :rules="[rules.required, rules.positive]")
        v-col(cols="12" sm="6" md="2")
          v-text-field(v-model="newPrice.buyPrice2" label="Prix 2" type="number" min="0" )
        v-col(cols="12" sm="6" md="2")
          v-text-field(v-model="newPrice.buyPrice3" label="Prix 3" type="number" min="0" )
        v-col(cols="12" sm="6" md="2")
          v-text-field(v-model="newPrice.buyPrice4" label="Prix 4" type="number" min="0" )
        v-col(cols="12" sm="6" md="2")
          v-text-field(v-model="newPrice.buyPrice5" label="Prix 5" type="number" min="0" )
        v-col.text-center(cols="12" sm="6" md="2").mt-0.mt-sm-3
          v-btn(@click="popupValidateAddPrice = true" color="primary") valider
          v-dialog(v-model="popupValidateAddPrice" width=400)
            v-card
              v-card-title Ajout d'un nouveau prix
              v-card-text Voulez-vous ajouter un nouveau prix pour le produit {{history.infoRef}} ?
              v-card-actions
                v-spacer
                v-btn.ma-2(outlined color="secondary" @click="popupValidateAddPrice = false") Annuler
                v-btn.ma-2(outlined color="primary" @click="postNewPrice") Oui
    v-row
      v-data-table(
        :headers="headersPrices"
        :items="history.pdt_buyHistories.slice(0).sort((a, b) => { return b.id - a.id })"
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
        template(v-slot:no-data)
          v-alert(:value="true")
            span Aucun nouveau prix a été ajouter
        template(v-slot:item.createdAt="{ item }") {{new Date(item.createdAt).toLocaleString()}}
</template>

<script>
import { buyHistoriesService, referencesService, productsService } from '@/api'
export default {
  props: {
    history: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    },
    isAloneRef: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      headersPrices: [
        { text: 'Date', value: 'createdAt' },
        { text: 'Prix 1', value: 'buyPrice1' },
        { text: 'Prix 2', value: 'buyPrice2' },
        { text: 'Prix 3', value: 'buyPrice3' },
        { text: 'Prix 4', value: 'buyPrice4' },
        { text: 'Prix 5', value: 'buyPrice5' }
      ],
      rules: {
        required: value => !!value || 'Champ obligatoire',
        positive: v => v > 0 || 'Cette valeur doit être supérieur à zéro'
      },
      loading: false,
      popupDeleteRef: false,
      addNewPrice: false,
      popupValidateAddPrice: false,
      newPrice: {
        buyPrice1: null,
        buyPrice2: null,
        buyPrice3: null,
        buyPrice4: null,
        buyPrice5: null,
        pdtReferenceId: this.history.id
      },
      updatePackage: false
    }
  },
  methods: {
    async postNewPrice () {
      try {
        if (this.$refs.form.validate()) {
          await buyHistoriesService.create(this.newPrice)
          this.$store.commit('notif/sendSuccess', 'Modification de la référence effectuée avec succés')
          this.addNewPrice = false
          this.popupValidateAddPrice = false
          this.$emit('update-ref')
        }
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async deleteRef () {
      if (this.isAloneRef) {
        this.removeProduct()
      } else {
        try {
          await referencesService.remove(this.history.id)
          this.$store.commit('notif/sendSuccess', 'Réference supprimée')
          this.$emit('update-ref')
          this.popupDeleteRef = false
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      }
    },
    async removeProduct () {
      try {
        await productsService.remove(this.history.pdtProductId)
        this.$store.commit('notif/sendSuccess', 'Produit supprimé')
        this.$emit('update-ref')
        this.popupDeleteRef = false
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async updateNewPackage () {
      try {
        await referencesService.patch(this.history.id, { package: this.history.package })
        this.$store.commit('notif/sendSuccess', 'Référence mise à jour')
        this.$emit('update-ref')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.updatePackage = !this.updatePackage
    }
  }
}
</script>

<style scoped>
.theme--light.v-data-table {
  border: 1px solid darkolivegreen;
  border-collapse: collapse;
  padding: 0 10px;
  color: darkolivegreen;
  font-weight: 700;
}
</style>
