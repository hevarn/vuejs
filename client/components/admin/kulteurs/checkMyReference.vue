<template lang="pug">
  v-card
    v-card-title
      v-col(cols="12")
        h4 Gestion des références
    v-card-text
      v-row(v-if="$store.state.auth.user.isAdmin || $store.state.auth.user.isKulteur")
        v-col(cols="12" sm="6" align="center")
          AdmUtlsSelectGroup(fromKultorCheckPage @reset-field="references = [], selectedSite = 0")
        v-col(cols="12" sm="6" align="center")
          v-select(
            :items="$store.state.admin.providersBG.filter(x => x.isSite)"
            item-text="name"
            item-value="id"
            label="Fournisseur"
            v-model="selectedSite"
            outlined
            dense
            @change="fetchReference"
            append-icon="$mdi-chevron-down"
          )
      v-row
      v-form(lazy-validation ref="form")
        v-data-table(
          v-if="selectedSite"
          :headers="headers",
          :items="references"
          :loading="loading"
          loader-height="50"
          loading-text="Loading... Please wait"
          color="#010101"
          :items-per-page="references.length"
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
          template(v-slot:no-data)
            v-alert(:value="true")
              span Aucune référence n'a été enregistré
          template(v-slot:item.pdt_product.pdt_variety.picture="{ item }")
            v-avatar
              v-img(
                lazy-src="/logoKanopeeWhite.png"
                :src="item.pdt_product.pdt_variety.picture"
                alt="fruit"
                height="40"
                width="40")
          template(v-slot:item.action="{ item }")
            v-edit-dialog(
              :return-value.sync="item.newAdd"
            ) {{ item.newAdd || 0}}
              template(v-slot:input)
                v-text-field(
                  v-model="item.newAdd"
                  label="Entrez la quantité"
                  single-line
                  type="number"
                  min="0"
                  :rules="[rules.positive]"
                )
          template(v-slot:item.action2="{ item }")
            v-edit-dialog(
              :return-value.sync="item.newWaste"
            ) {{ item.newWaste || 0}}
              template(v-slot:input)
                v-text-field(
                  v-model="item.newWaste"
                  label="Entrez la quantité"
                  single-line
                  type="number"
                  min="0"
                  :rules="[rules.positive]"
                )
    v-row(justify="center" align="center")
        v-col(cols="12" sm="6")
          v-img(src="/logoButton.png")
        v-col(cols="12" sm="6" align="center")
          v-btn(
            :disabled="!selectedSite"
            @click="addNewStock"
            color="primary"
          ) Valider les ajouts
</template>

<script>
import { referencesService, kulteurStocksService } from '@/api'
export default {
  data () {
    return {
      references: [],
      headers: [
        {
          text: 'Image',
          value: 'pdt_product.pdt_variety.picture',
          sortable: false
        },
        { text: 'Référence', value: 'kanopeeReference', sortable: false },
        { text: 'Détails', value: 'infoRef', sortable: false },
        { text: 'Qté dispo', value: 'kulteurStockValue', sortable: false },
        { text: 'Ajouter dispo', value: 'action', sortable: false },
        { text: 'Ajouter perte', value: 'action2', sortable: false }
      ],
      selectedSite: 0,
      rules: {
        positive: v =>
          v >= 0 || v === undefined || 'Cette valeur doit être minimum à zéro',
        number: v =>
          !v || /^[0-9]*$/.test(v) || 'chiffres !'
      },
      loading: false
    }
  },
  mounted () {
    if (this.$store.state.auth.user.isKulteur) {
      this.fetchReference()
    }
  },
  methods: {
    async fetchReference () {
      this.loading = true
      try {
        const site = this.$store.state.auth.user.isKulteur
          ? this.$store.state.auth.user.provider.id
          : this.selectedSite
        this.references = await referencesService.find({
          query: { pdtProviderId: site, kultors: true }
        })
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.loading = false
    },
    async addNewStock () {
      if (this.$refs.form.validate()) {
        this.references.forEach(async function (x) {
          if (x.newAdd || x.newWaste) {
            try {
              await kulteurStocksService.create({
                quantity: x.newAdd || x.newWaste,
                pdtReferenceId: x.id,
                pdtStocksActionId: x.newAdd ? 8 : 9
              })
            } catch (e) {
              this.$store.commit('notif/sendAlert')
            }
          }
        })
        this.$store.commit('notif/sendSuccess', 'Stocks ajustés')
        this.$emit('close-window')
      } else {
        this.$store.commit('notif/sendAlert', 'Valeurs entrées invalides')
      }
    }
  }
}
</script>
