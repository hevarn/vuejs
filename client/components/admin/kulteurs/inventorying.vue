<template lang="pug">
  v-card
    v-card-title
      v-col(cols="12")
        h4 Inventaire des stocks fournisseurs
    v-card-text
      v-row(v-if="$store.state.auth.user.isAdmin  || $store.state.auth.user.isKulteur")
        v-col(cols="12" sm="6" align="center")
          AdmUtlsSelectGroup(fromKultorCheckPage @reset-field="references = [], selectedProvider = 0")
        v-col(cols="12" sm="6" align="center")
          v-select(
            :items="$store.state.admin.providersBG.filter(x => !x.isSite)"
            item-text="name"
            item-value="id"
            label="Fournisseur"
            v-model="selectedProvider"
            outlined
            dense
            @change="fetchReferences"
            append-icon="$mdi-chevron-down"
          )
      v-row
        v-spacer
        v-text-field(
          v-model="search"
          append-icon="$mdi-magnify"
          label="Rechercher"
          single-line
          hide-details
          v-if="selectedProvider"
        )
        v-form(lazy-validation ref="form")
          v-data-table(
            v-if="selectedProvider"
            :headers="headers",
            :items="references"
            :loading="loading"
            :search="search"
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
            template(v-slot:item.pdt_reference.pdt_product.buyUnity.name="{ item }")
              span {{item.pdt_reference.pdt_product.buyUnity.name.toLowerCase()}}
            template(v-slot:item.pdt_reference.infoRef="{ item }")
              span {{item.pdt_reference.infoRef.toLowerCase().substring(0,20)}}
            template(v-slot:item.pdt_reference.kanopeeReference="{ item }")
              span {{item.pdt_reference.kanopeeReference.substring(0,20)}}
            template(v-slot:item.pdt_reference.pdt_product.pdt_variety.picture="{ item }")
              v-avatar
                v-img(
                  lazy-src="/logoKanopeeWhite.png"
                  :src="item.pdt_reference.pdt_product.pdt_variety.picture"
                  alt="fruit"
                  height="40"
                  width="40")
            template(v-slot:item.action="{ item }" v-if="sizeDevice.mdAndUp")
              v-edit-dialog(
                :return-value.sync="item.adjust"
              ) {{ item.adjust }}
                template(v-slot:input)
                  v-text-field(
                    v-model="item.adjust"
                    label="Ajuster la quantité"
                    single-line
                    type="number"
                    :rules="[rules.positive]"
                  )
            template(v-slot:item.action="{ item }" v-else)
              v-text-field(
                v-model="item.adjust"
                label="Ajuster la quantité"
                single-line
                type="number"
                :rules="[rules.positive]"
              )
      v-row(justify="center" align="center")
        v-col(cols="12" sm="6")
          v-img(src="/logoButton.png")
        v-col(cols="12" sm="6" align="center")
          v-btn(
            :disabled="!selectedProvider"
            @click="addNewStock"
            color="primary"
          ) Valider l'inventaire
</template>

<script>
import { stocksService } from '@/api'
export default {
  data () {
    return {
      selectedProvider: 0,
      references: [],
      search: '',
      headers: [
        {
          text: 'Image',
          value: 'pdt_reference.pdt_product.pdt_variety.picture',
          sortable: true
        },
        {
          text: 'Référence',
          value: 'pdt_reference.kanopeeReference',
          sortable: true
        },
        {
          text: 'Réf. frs',
          value: 'pdt_reference.providerReference',
          sortable: true
        },
        { text: 'Détails', value: 'pdt_reference.infoRef', sortable: true },
        { text: 'Stocks', value: 'solde', sortable: true },
        {
          text: 'Unité',
          value: 'pdt_reference.pdt_product.buyUnity.name',
          sortable: true
        },
        { text: 'Stock réel', value: 'action', sortable: true }
      ],
      rules: {
        positive: v =>
          v >= 0 || v === undefined || 'Cette valeur doit être minimum à zéro'
      },
      loading: false
    }
  },
  computed: {
    sizeDevice () {
      return this.$vuetify.breakpoint
    }
  },
  methods: {
    async fetchReferences () {
      this.loading = true
      try {
        const query = { stateStockByRef: this.selectedProvider }
        const { data } = await stocksService.find({ query })
        this.references = data
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.loading = false
    },
    async addNewStock () {
      if (this.$refs.form.validate()) {
        const data = []
        this.references.forEach(function (x) {
          if (x.adjust >= 0) {
            // set new stock with correct value
            data.push({
              qtyExpected: -(x.solde - x.adjust),
              qtyReceived: -(x.solde - x.adjust),
              buyPrice: x.price,
              referenceProvider: `ajustement de ${x.pdt_reference.kanopeeReference} à ${x.adjust} unités`,
              pdtReferenceId: x.pdtReferenceId
            })
          }
          if (!x.adjust && x.solde < 0) {
            // set negative stock to 0
            data.push({
              qtyExpected: -x.solde,
              qtyReceived: -x.solde,
              buyPrice: x.price,
              referenceProvider: `ajustement de ${x.pdt_reference.kanopeeReference} automatique car solde négatif`,
              pdtReferenceId: x.pdtReferenceId
            })
          }
        })
        try {
          await stocksService.create(data)
          this.$store.commit('notif/sendSuccess', 'Stocks ajustés')
          this.$emit('close-window')
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      } else {
        this.$store.commit('notif/sendAlert', 'Valeurs entrées invalides')
      }
    }
  }
}
</script>
