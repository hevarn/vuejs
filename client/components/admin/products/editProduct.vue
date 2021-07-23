<template lang="pug">
v-dialog(v-model='isEditMode', max-width='900px' @click:outside="$emit('toggle-edit-mode')")
  v-card
    v-card-title(v-if='product.id')
      v-avatar.mr-2
        v-img(:src='product.picture')
      span.headline {{ product.productName }}
    v-card-title(v-else)
      span
        v-icon.mr-2.mb-2(large, color='primary') $mdi-cart
      span.headline Ajouter un nouveau produit Kulteur
    v-card-text
      v-form(lazy-validation, ref='form')
        v-row
          v-col(cols='12', sm='6', md='6', v-if='!product.id')
            v-select(
              v-model='kindSelect',
              :items='$store.state.admin.kinds',
              item-text='name',
              return-object,
              label='Genre',
              @change='fetchVariety',
              append-icon='$mdi-chevron-down',
              :rules='[rules.required]'
            )
          v-col(cols='12', sm='6', md='6', v-if='!product.id')
            v-select(
              :items='varietySelect',
              item-text='name',
              label='Variété',
              return-object,
              @change='checkVariety',
              append-icon='$mdi-chevron-down',
              :rules='[rules.required]'
            )
          v-col(cols='12')
            v-text-field(
              v-model='productEdited.description',
              label='Description'
            )
          v-col(cols='12', sm='6', md='3', v-if='!product.id')
            v-select(
              v-model='productEdited.pdtDistanceId',
              :items='$store.state.admin.distances.filter((x) => x.id === 1)',
              item-text='name',
              item-value='id',
              label='Distance',
              append-icon='$mdi-chevron-down',
              :rules='[rules.required]'
            )
          v-col(cols='12', sm='6', md='3', v-if='product.id && product.isBio')
            v-select(
              v-model='productEdited.pdtDistanceId',
              :items='$store.state.admin.distances.filter((x) => x.id !== 1)',
              item-text='name',
              item-value='id',
              label='Distance',
              append-icon='$mdi-chevron-down',
              :rules='[rules.required]'
            )
          v-col(cols='12', sm='6', md='3')
            v-select(
              v-model='productEdited.pdtWeightUnityId',
              :items='$store.state.admin.unities',
              item-text='name',
              item-value='id',
              label='Unité d\'achat',
              append-icon='$mdi-chevron-down',
              :rules='[rules.required]',
              hint='Modifier uniquement si erreur mercuriale',
              persistent-hint
            )
          v-col(cols='12', sm='6', md='3', v-if='product.id && product.isBio')
            v-select(
              v-model='productEdited.sellUnityId',
              :items='$store.state.admin.unities',
              item-text='name',
              item-value='id',
              label='Unité de vente',
              append-icon='$mdi-chevron-down',
              hint='Si unité de vente différente de l\'unité d\'achat',
              persistent-hint
            )
          v-col(cols='12', sm='6', md='3', v-if='productEdited.sellUnityId')
            v-text-field(
              v-model='productEdited.disassemble',
              label='Convertion en %',
              type='number',
              min='0',
              hint='exemple: U.A = 1kg, U.V. = 250g, alors convertion = 25% ',
              persistent-hint
            )
          v-col(cols='12', sm='6', md='3')
            v-select(
              v-model='productEdited.pdtCountryId',
              :items='$store.state.admin.countries',
              item-text='name',
              item-value='id',
              return-object,
              label='Origine',
              append-icon='$mdi-chevron-down',
              @change='updateCountry',
              :rules='[rules.required]'
            )
          v-col(cols='12', sm='6', md='3')
            v-select(
              v-model='productEdited.pdtCategoryId',
              :items='$store.state.admin.categories',
              item-text='name',
              item-value='id',
              label='Catégorie',
              append-icon='$mdi-chevron-down',
              :rules='[rules.required]'
            )
          v-col(cols='12', sm='6', md='3')
            v-select(
              v-model='productEdited.spotlight',
              :items='$store.state.admin.truthyFalsy',
              item-text='name',
              item-value='value',
              label='Produit du moment',
              append-icon='$mdi-chevron-down'
            )
          v-col(cols='12', sm='6', md='3')
            v-select(
              v-model='productEdited.display',
              :items='$store.state.admin.truthyFalsy',
              item-text='name',
              item-value='value',
              label='En vente',
              append-icon='$mdi-chevron-down'
            )
          v-col(cols='12', sm='6', md='3')
            v-text-field(
              v-model='productEdited.sharedReference',
              label='Référence',
              disabled
            )
          v-col(
            cols='12',
            sm='6',
            md='3',
            v-if='productEdited.pdtDistanceId === 1 && !product.id'
          )
            v-select(
              :items='$store.state.admin.providersBG.filter((x) => x.isSite)',
              item-text='name',
              return-object,
              label='Sélectionnez un site',
              @change='updateKulteur',
              append-icon='$mdi-chevron-down',
              :rules='[rules.required]'
            )
          v-col(
            cols='12',
            sm='6',
            md='3',
            v-if='productEdited.pdtDistanceId === 1 && !product.id'
          )
            v-text-field(
              v-model='referencesEdited.package',
              label='conditionnement',
              type='number',
              :rules='[rules.required]'
            )
          v-col(
            cols='12',
            sm='6',
            md='3',
            v-if='productEdited.pdtDistanceId === 1 && !product.id'
          )
            v-text-field(
              v-model='referencesEdited.providerReference',
              label='Reference produit kulteur'
            )
          v-col(
            cols='12',
            sm='6',
            md='3',
            v-if='productEdited.pdtDistanceId === 1 && !product.id'
          )
            v-text-field(
              v-model='referencesEdited.infoRef',
              label='Info Reference'
            )
      v-card-actions
        v-spacer
        v-btn(color='secondary', outlined, @click='$emit("toggle-edit-mode")') Annuler
        v-btn(
          color='primary',
          outlined,
          @click.stop='popupConfirmAddProduct = true'
        ) Enregistrer
      v-dialog(v-model='popupConfirmAddProduct', width=400)
        v-card
          v-card-title(v-if='this.product.id') Modification du produit
          v-card-title(v-else) Ajout d'un nouveau produit
          v-card-text(v-if='this.product.id') Voulez-vous modifier le produit #[strong {{ product.productName }}] ?
          v-card-text(v-else) Voulez-vous ajouter le produit #[strong {{ kindSelect.name }} {{ varietySelect.name }}] ?
          v-card-actions
            v-spacer
            v-btn.ma-2(
              outlined,
              color='secondary',
              @click='popupConfirmAddProduct = false'
            ) Annuler
            v-btn.ma-2(outlined, color='primary', @click='updateSharedRef') Oui
</template>
<script>
import { productsService, varietiesService, referencesService } from '@/api'
import DisplayedProduct from '@/components/DisplayedProduct'

export default {
  props: {
    isEditMode: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      default: () =>
        new DisplayedProduct({
          id: 0,
          sharedReference: '',
          description: '',
          pdtProviderId: '',
          pdtCategoryId: '',
          pdtVarietyId: '',
          pdtCountryId: '',
          pdtWeightUnityId: '',
          pdtDistanceId: '',
          sellUnityId: '',
          spotlight: false,
          display: false,
          isArchived: false,
          pdt_category: { name: '' },
          pdt_country: { name: '' },
          buyUnity: { name: '' },
          pdt_distance: { name: '' },
          pdt_variety: {
            name: '',
            picture: '',
            pdt_kind: {
              name: '',
              pdt_type: { name: '' }
            }
          }
        })
    }
  },
  data () {
    return {
      productEdited: {},
      popupConfirmAddProduct: false,
      kindSelect: '',
      rules: {
        required: value => !!value || 'Champ obligatoire',
        positive: v => v > 0 || 'Cette valeur doit être supérieur à zéro'
      },
      varietySelect: [],
      referencesEdited: {
        pdtProviderId: 0,
        pdtProductId: 0,
        package: '',
        infoRef: '',
        providerReference: '',
        kanopeeReference: ''
      }
    }
  },
  watch: {
    product () {
      this.initProduct()
    }
  },
  mounted () {
    this.initProduct()
  },
  methods: {
    async editAProduct () {
      try {
        if (this.product.id) {
          await productsService.patch(this.product.id, {
            ...this.productEdited
          })
          this.$store.commit('notif/sendSuccess', 'Modification de la référence effectuée avec succés')
          this.$emit('fetch-product')
        } else {
          const { id } = await productsService.create({ ...this.productEdited })
          this.referencesEdited.pdtProductId = id
          await referencesService.create({ ...this.referencesEdited })
          this.$store.commit('notif/sendSuccess', 'Ajout de la référence effectuée avec succés')
          this.$emit('fetch-product')
        }
      } catch (error) {
        if (error.code === 400) {
          this.$store.commit('notif/sendAlert', 'Le produit existe déjà avec les informations indiquées')
        }
      }
      this.$emit('fetch-product')
      this.$emit('toggle-edit-mode')
    },
    async fetchVariety ({ id }) {
      try {
        const { data } = await varietiesService.find({
          query: { $limit: 200, pdtKindId: id }
        })
        this.varietySelect = data
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    checkVariety (e) {
      this.productEdited.sharedReference = this.product.setSharedRef(
        e,
        this.kindSelect.name
      )
      this.productEdited.pdtVarietyId = e.id
    },
    updateSharedRef () {
      if (this.$refs.form.validate()) {
        this.productEdited.sharedReference = this.product.getNewSharedRef(
          this.productEdited
        )
        this.referencesEdited.kanopeeReference = `${this.productEdited.sharedReference}_${this.referencesEdited.code}`
        this.editAProduct()
      }
    },
    updateCountry ({ name, id }) {
      this.product.setCountry(name)
      this.productEdited.pdtCountryId = id
    },
    updateKulteur ({ id, code }) {
      if (this.productEdited.pdtDistanceId === 1) {
        this.productEdited.kultorRef = `K${id}`
      }
      this.referencesEdited.pdtProviderId = id
      this.referencesEdited.code = code
    },
    initProduct () {
      this.productEdited = {
        sharedReference: this.product.sharedReference,
        description: this.product.description,
        pdtCategoryId: this.product.productIds.category,
        pdtVarietyId: this.product.productIds.variety,
        pdtCountryId: this.product.productIds.country,
        pdtWeightUnityId: this.product.productIds.unity,
        pdtDistanceId: this.product.productIds.distance,
        spotlight: this.product.spotlight,
        display: this.product.display,
        pdtSiteGroupingId: this.$store.state.admin.group.id,
        disassemble: this.product.disassemble,
        sellUnityId: this.product.productIds.sellUnity,
        isArchived: this.product.isArchived
      }
    }
  }
}
</script>
