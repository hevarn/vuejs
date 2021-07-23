<template lang="pug">
v-container(fluid)
  v-card
    v-card-title Rechercher une référence
    v-row
      v-select.col-12.col-sm-6.col-md-4.col-lg-2(
        v-model='product.pdtDistanceId',
        :items='$store.state.admin.distances.filter((x) => x.id !== 1)',
        item-text='name',
        item-value='id',
        label='Distance',
        :disabled='!!product.pdtDistanceId',
        append-icon='$mdi-chevron-down'
      )
      v-select.col-12.col-sm-6.col-md-3(
        v-model='pdtTypeId',
        :items='$store.state.admin.types',
        item-text='name',
        item-value='id',
        label='Type',
        @change='selectKind',
        append-icon='$mdi-chevron-down'
      )
      v-select.col-12.col-sm-6.col-md-3(
        v-model='addNewVarieties.pdtKindId',
        :items='kindSelection',
        item-text='name',
        item-value='id',
        menu-props='auto',
        label='Genre',
        @change='fetchVariety',
        append-icon='$mdi-chevron-down'
      )
      v-text-field.col-12.col-sm-6.col-md-3(
        v-if='addNewKind',
        v-model='addNewKinds.name',
        label='Nom du nouveau genre',
        append-icon='$mdi-plus-thick',
        @click:append='postNewKind',
        :rules='[(v) => v.length > 3 || "4 caractéres minimum"]'
      )
      v-select.col-12.col-sm-6.col-md-3(
        v-model='product.pdtVarietyId',
        :items='varietySelect',
        item-text='name',
        item-value='id',
        label='Variété',
        @change='newVariety',
        append-icon='$mdi-chevron-down'
      )
      v-text-field.col-12.col-sm-6.col-md-3(
        v-if='addNewVariety',
        v-model='addNewVarieties.name',
        label='Nom de la nouvelle variété',
        append-icon='$mdi-plus-thick',
        @click:append='postNewVariety',
        :rules='[(v) => v.length > 3 || "4 caractéres minimum"]'
      )
      v-select.col-12.col-sm-6.col-md-3(
        v-model='sharedRefSelected',
        :items='sharedRefList',
        item-text='sharedReference',
        return-object,
        label='Indexer ce produit',
        @change='newRefIndexed',
        append-icon='$mdi-chevron-down'
      )
      v-card-actions
        v-btn(
          @click='nextStep = true',
          color="primary"
          v-if='product.pdtDistanceId && pdtTypeId && addNewVarieties.pdtKindId && product.pdtVarietyId && !sharedRefList.length'
        ) Creer une nouvelle référence
        v-btn(
          @click="$emit('hide-panel')"
          color="secondary"
        ) Annuler
  v-card(v-if='nextStep')
    v-card-title Vous ne trouvez pas de référence correspondante à ce produit ? créer la maintenant !
      v-row(v-if='product.pdtVarietyId')
        v-spacer
        v-switch.col-12.col-sm-6.col-md-4.col-lg-2(
          v-model='product.display',
          color='#6b8e23',
          :label='product.display ? "En vente" : "Caché"'
        )
        v-spacer
        v-switch.col-12.col-sm-6.col-md-4.col-lg-2(
          v-model='product.spotlight',
          color='#6b8e23',
          :label='product.spotlight ? "Produit du moment" : "Produit classic"'
        )
        v-select.col-12.col-sm-6.col-md-4.col-lg-2(
          v-model='addNewVarieties.pdtKindId',
          :items='kindSelection',
          item-text='name',
          item-value='id',
          label='Genre',
          :disabled='!!addNewVarieties.pdtKindId',
          append-icon='$mdi-chevron-down'
        )
        v-select.col-12.col-sm-6.col-md-4.col-lg-2(
          v-model='product.pdtVarietyId',
          :items='varietySelect',
          item-text='name',
          item-value='id',
          label='Variété',
          :disabled='!!product.pdtVarietyId',
          append-icon='$mdi-chevron-down'
        )
        v-select.col-12.col-sm-6.col-md-4.col-lg-2(
          v-model='product.pdtCountryId',
          :items='$store.state.admin.countries',
          item-text='name',
          item-value='id',
          label='Origine',
          @change='() => myProduct.setCountryId(product.pdtCountryId)',
          :disabled='!!product.pdtCountryId',
          append-icon='$mdi-chevron-down'
        )
        v-select.col-12.col-sm-6.col-md-4.col-lg-2(
          v-model='product.pdtWeightUnityId',
          :items='$store.state.admin.unities',
          item-text='name',
          item-value='id',
          label='Unité',
          @change='() => myProduct.setUnityId(product.pdtWeightUnityId)',
          append-icon='$mdi-chevron-down',
          :disabled='!!product.pdtWeightUnityId'
        )
        v-select.col-12.col-sm-6.col-md-4.col-lg-2(
          v-model='product.pdtCategoryId',
          :items='$store.state.admin.categories',
          item-text='name',
          item-value='id',
          label='Catégorie',
          @change='() => myProduct.setCategory(product.pdtCategoryId)',
          append-icon='$mdi-chevron-down',
          :disabled='!!product.pdtCategoryId'
        )
        v-text-field.col-12.col-sm-6.col-md-4.col-lg-2(
          v-model='reference.package',
          :disabled='!!reference.package',
          label='Conditionnement'
        )
        v-text-field.col-12.col-sm-6.col-md-4.col-lg-2(v-model='product.description', label='Information client complémentaire')
        v-btn(@click='$store.dispatch("admin/fetchSettings", 2)', rounded) refresh references
    v-card-actions
      v-spacer
      v-btn(
        color="primary",
        @click='addProduct',
        v-if='product.pdtCountryId && product.pdtCategoryId && reference.package && product.pdtWeightUnityId'
      ) Sauvegarder
</template>

<script>
import {
  varietiesService,
  productsService,
  referencesService,
  buyHistoriesService,
  kindsService
} from '@/api'
import Product from './Product'

export default {
  props: {
    newProviderProduct: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    },
    provider: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    }
  },
  data () {
    return {
      sharedRefList: [],
      varietySelect: [],
      kindSelection: [],
      pdtTypeId: 0,
      product: {
        pdtVarietyId: null,
        pdtCategoryId: null,
        pdtCountryId: null,
        pdtDistanceId: null,
        pdtWeightUnityId: null,
        description: null,
        sharedReference: '',
        display: false,
        spotlight: false,
        isArchived: false,
        pdtSiteGroupingId: this.$store.state.admin.group.id
      },
      reference: {
        kanopeeReference: null,
        infoRef: null,
        pdtProductId: null,
        providerReference: null,
        pdtProviderId: null,
        package: null
      },
      historyBuy: {
        buyPrice: [],
        pdtReferenceId: {}
      },
      addNewVariety: false,
      addNewVarieties: {
        pdtKindId: null,
        name: '',
        picture:
          'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png',
        description: ''
      },
      addNewKind: false,
      addNewKinds: {
        name: '',
        pdtTypeId: null
      },
      sharedRefSelected: [],
      nextStep: false,
      myProduct: {}
    }
  },
  methods: {
    async fetchVariety (e) {
      if (e === 0) {
        this.addNewKind = true
      } else {
        this.addNewKind = false
        try {
          const { data } = await varietiesService.find({
            query: { $limit: 200, pdtKindId: e }
          })
          this.varietySelect = data
          this.varietySelect.push({ id: 0, name: 'Ajouter une variété' })
        } catch (error) {
          this.$store.commit('notif/sendAlert')
        }
      }
    },
    selectKind (e) {
      this.kindSelection = [
        ...this.$store.state.admin.kinds.filter(
          ({ pdtTypeId }) => pdtTypeId === e
        ),
        { id: 0, name: 'Ajouter un nouveau' }
      ]
    },
    async newVariety () {
      if (this.product.pdtVarietyId === 0) {
        this.addNewVariety = true
      } else {
        this.addNewVariety = false
        this.myProduct = new Product(
          this.newProviderProduct,
          this.$store.state.admin,
          this.provider.id,
          this.product.pdtVarietyId,
          this.$store.state.admin.group.id,
          this.varietySelect
        )
        this.myProduct.setDistanceId(this.product.pdtDistanceId)
        this.product.pdtCountryId = this.myProduct.getCountryId()
        this.product.pdtWeightUnityId = this.myProduct.getUnityId()
        this.product.pdtCategoryId = this.myProduct.getCategoryId()
        this.reference.providerReference = this.myProduct.getProviderRef()
        this.reference.infoRef =
          this.provider.id === 2
            ? this.myProduct.getInfoRef()
            : `${this.myProduct.getInfoRef()} ${
                this.newProviderProduct.informations
              }`
        this.reference.package = this.myProduct.getPackage()
        this.reference.pdtProviderId = this.myProduct.getProviderId()
        this.historyBuy.buyPrice = this.myProduct.getBuyPrice()
        this.product.sharedReference = this.myProduct.getSharedRef()
        this.reference.kanopeeReference = this.myProduct.getReferenceRef()
        try {
          const query = {
            pdtVarietyId: this.product.pdtVarietyId,
            pdtSiteGroupingId: this.$store.state.admin.group.id,
            pdtDistanceId: { $gt: 1 },
            mercu: true
          }
          query.pdtCountryId = this.product.pdtCountryId || 0
          query.pdtWeightUnityId = this.product.pdtWeightUnityId || 0
          query.pdtCategoryId = this.product.pdtCategoryId || 0
          this.sharedRefList = await productsService.find({ query })
        } catch (e) {
          alert(e)
        }
      }
    },
    async postNewVariety () {
      if (this.addNewVarieties.name.length > 3) {
        try {
          const data = await varietiesService.create(this.addNewVarieties)
          this.$store.commit('admin/addOneVarietyToSetting', data)
          await this.varietySelect.push(data)
          this.addNewVariety = false
          this.product.pdtVarietyId = data.id
          this.newVariety()
          this.$store.commit('notif/sendSuccess', `Nouvelle variété: ${this.addNewVarieties.name} ajoutée à la base de données`)
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      } else {
        this.$store.commit('notif/sendAlert', 'entrée incorrecte')
      }
    },
    async postNewKind () {
      if (this.addNewKinds.name.length > 3) {
        try {
          this.addNewKinds.pdtTypeId = this.pdtTypeId
          const data = await kindsService.create(this.addNewKinds)
          this.$store.commit('admin/addOneKindToSetting', data)
          await this.kindSelection.push(data)
          this.addNewKind = false
          this.addNewVarieties.pdtKindId = data.id
          this.product.pdtKindId = data.id
          this.fetchVariety(data.id)
          this.$store.commit('notif/sendSuccess', `Nouveau genre: ${this.addNewKinds.name} ajouté à la base de données`)
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      } else {
        this.$store.commit('notif/sendAlert', 'entrée incorrecte')
      }
    },
    async addProduct () {
      this.nextStep = false
      try {
        this.product.sharedReference = this.myProduct.getSharedRef()
        const { id } = await productsService.create(this.product)
        this.reference.pdtProductId = id
        this.postNewRef()
        this.clearModal()
        this.$emit('fetch-kanoppe-ref')
        this.$store.commit('notif/sendSuccess', 'Nouveau produit ajouté à la base de données')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async postNewRef () {
      try {
        this.reference.kanopeeReference = this.myProduct.getReferenceRef()
        const { id } = await referencesService.create(this.reference)
        this.historyBuy.pdtReferenceId = id
        this.$emit('close-edit-mode')
        this.postPurchasePrice()
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async postPurchasePrice () {
      try {
        const newPrice = {
          pdtReferenceId: this.historyBuy.pdtReferenceId,
          ...this.historyBuy.buyPrice
        }
        await buyHistoriesService.create(newPrice)
        this.$emit('hide-select')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    closeModal () {
      this.product.pdtDistanceId = null
      this.$emit('close-edit-mode')
      this.clearModal()
    },
    clearModal () {
      this.product = {
        pdtVarietyId: null,
        pdtCategoryId: null,
        pdtCountryId: null,
        pdtDistanceId: null,
        pdtWeightUnityId: null,
        description: null,
        sharedReference: '',
        display: false,
        spotlight: false
      }
      this.reference = {}
      this.pdtTypeId = 0
      this.addNewVarieties.pdtKindId = []
    },
    newRefIndexed () {
      this.$emit('change-shared-ref', this.sharedRefSelected)
      this.$emit('add-valid-ref')
    }
  }
}
</script>
