<template lang="pug">
  v-container(fluid)
    v-row(@drop='_drop' @dragenter='_suppress' @dragover='_suppress')
      v-container
        v-row
          v-spacer
          h2 Sélectionnez votre mercuriale {{ provider.name }}
          v-spacer
          input(type="file" :accept='SheetJSFT' @change='_change')
    v-row(v-if="importedProduct.length")
      v-col.xs-12
        v-card
          v-card-title Références en attente d'indexation
            v-spacer
            v-text-field(
              v-model="search"
              append-icon="$mdi-magnify"
              label="Rechercher"
              single-line
              hide-details
            )
          v-data-table(
            :headers="headersReferencedProducts.ref"
            :items="referencedProducts"
            :loading="loading"
            loading-text="Chargement en cours...Veuillez patienter"
            :items-per-page="referencedProducts.length"
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
          ).col-12

            template(v-slot:item.actions="{ item }")
              v-row
                v-btn(icon @click="deleteSelect(referencedProducts.indexOf(item))").col-4
                  v-icon $mdi-trash-can-outline
    v-row(v-if="importedProduct.length && newRegistered.length")
      v-col.xs-12
        v-card
          v-card-title Références directement ajoutées en base
            v-spacer
            v-text-field(
              v-model="search"
              append-icon="$mdi-magnify"
              label="Rechercher"
              single-line
              hide-details
            )
          v-data-table(
            :headers="headersReferencedProducts.unref"
            :items="newRegistered"
            :loading="loading"
            loading-text="Chargement en cours...Veuillez patienter"
            :items-per-page="newRegistered.length"
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
          ).col-12
    v-row(justify="center" v-if="importedProduct.length")
      v-btn(
        @click="addNewProduct"
      ) Valider les changements et importer les mises à jours
    v-row(v-if="importedProduct.length")
      v-col.xs-12
        v-card
          v-card-title Table Références non indéxées (reference = genre_variété_idCatégorie_idUnité_idDistance_PAYS)
            v-spacer
            v-text-field(
              v-model="search"
              append-icon="$mdi-magnify"
              label="Rechercher"
              single-line
              hide-details
            )
          v-data-table(
            :headers="headersReferencedProducts.unref"
            :items="unReferencedProducts"
            :loading="loading"
            class="elevation-1"
            :search="search"
            loading-text="Chargement en cours...Veuillez patienter"
            color="red"
            :expanded.sync="expanded"
            item-key="providerReference"
            show-expand
            :items-per-page="unReferencedProducts.length"
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
            expand-icon="$mdi-chevron-down"
          ).col-12

            template(v-slot:expanded-item="{ headers, item }")
              td(:colspan="headers.length")
                AdmPdctAddNewProduct(
                  :newProviderProduct="item"
                  :provider="provider"
                  @hide-select="hideSelect(item, unReferencedProducts.indexOf(item))"
                  @change-shared-ref="changeSharedRef"
                  @add-valid-ref="addValidRef(item, unReferencedProducts.indexOf(item))"
                  @fetch-fetch-kanoppe-ref="() => $emit('fetchKanoppeRef')"
                  @hide-panel="() => expanded = []"
                )
</template>

<script>
import XLSX from 'xlsx'
import { referencesService, buyHistoriesService } from '@/api'
const _SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm'
]
  .map(function (x) {
    return `.${x}`
  })
  .join(',')
export default {
  props: {
    provider: {
      type: Object,
      default: () => ({
        name: '',
        id: 0
      })
    }
  },
  data () {
    return {
      validRef: [],
      indexSelected: null,
      search: '',
      importedData: ['SheetJS'.split(''), '1234567'.split('')],
      referencedProducts: [],
      unReferencedProducts: [],
      sharedRefSelected: [],
      importedProduct: [],
      SheetJSFT: _SheetJSFT,
      originReferences: [],
      loading: false,
      headersPronadis: [
        { text: 'Référence Kanopée', value: 'kanopeeReference' },
        { text: 'Réf. Frs', value: 'providerReference' },
        { text: 'Désignation article', value: 'description' },
        { text: 'Cat', value: 'category' },
        { text: 'Qual', value: 'quality' },
        { text: 'Prov', value: 'origine' },
        { text: 'Pays', value: 'country' },
        { text: 'Condit.', value: 'package' },
        { text: 'UV', value: 'unity' },
        { text: '1 Colis', value: 'buyPrice1' },
        { text: '3 Colis', value: 'buyPrice2' },
        { text: '10 Colis', value: 'buyPrice3' },
        { text: 'Suppr', value: 'actions' }
      ],
      headersSMB: [
        { text: 'Référence Kanopée', value: 'kanopeeReference' },
        { text: 'Réf. Frs', value: 'providerReference' },
        { text: 'Désignation article', value: 'description' },
        { text: 'Informations', value: 'informations' },
        { text: 'Cat', value: 'category' },
        { text: 'Qual', value: 'quality' },
        { text: 'Condit.', value: 'package' },
        { text: 'UV', value: 'unity' },
        { text: 'Origine', value: 'country' },
        { text: '1 Colis', value: 'buyPrice1' },
        { text: 'Suppr', value: 'actions' }
      ],
      expanded: [],
      newRegistered: [],
      useDefaultTram: true,
      defaultTram: {
        // SICA default tram
        ranges: { s: { c: 0, r: 1 }, e: { c: 7, r: 1 } },
        firstRow: 0,
        loop: 2,
        providerHeaders: [
          'providerReference',
          'description',
          'informations',
          'quality',
          'package',
          'unity',
          'country',
          'buyPrice1',
          'category'
        ]
      },
      selectedConfig: {}
    }
  },
  computed: {
    headersReferencedProducts () {
      const headers = {
        // set deafult ref as smb format
        ref: this.headersSMB,
        unref: this.headersSMB.slice(1, 10)
      }
      if (this.provider.id === 2) {
        headers.ref = this.headersPronadis
        headers.unref = this.headersPronadis.slice(1, 12)
      }
      return headers
    }
  },
  watch: {
    provider () {
      this.razTable()
      if (this.provider.id === 2) {
        this.useDefaultTram = false
        this.selectedConfig = {
          id: 2, // PRONADIS - FLOIRAC
          ranges: { s: { c: 0, r: 50 }, e: { c: 11, r: 50 } },
          firstRow: 50,
          loop: 52,
          providerHeaders: [
            'providerReference',
            'description',
            'category',
            'quality',
            'origine',
            'country',
            'package',
            'unity',
            'buyPrice1',
            'buyPrice2',
            'buyPrice3',
            'order'
          ]
        }
      }
    }
  },
  methods: {
    async fetchReferencedProduct () {
      // get products already referenced by the admin, sorted by provider id
      // set store addProduct with this references
      this.$store.commit('products/clearProducts')
      try {
        const data = await referencesService.find({ query: { pdtProviderId: this.provider.id, histories: true } })
        this.$store.commit('products/addProducts', data)
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    deleteSelect (reference) {
      this.unReferencedProducts.push(this.referencedProducts[reference])
      this.referencedProducts.splice(reference, 1)
    },
    addNewProduct () {
      this.referencedProducts.forEach(async newRef => {
        try {
          const {
            pdtProductId,
            pdtProviderId,
            providerReference,
            kanopeeReference,
            buyPrice1,
            buyPrice2,
            buyPrice3,
            description
          } = newRef
          const dataRef = {
            pdtProductId,
            pdtProviderId,
            providerReference,
            kanopeeReference,
            package: newRef.package,
            infoRef: description
          }
          // create reference and take her id in order to send the new associated prices
          const { id } = await referencesService.create(dataRef)
          const dataHist = {
            buyPrice1,
            buyPrice2,
            buyPrice3,
            pdtReferenceId: id,
            buyPrice4: null,
            buyPrice5: null
          }
          await buyHistoriesService.create(dataHist)
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      })
      this.sendToBack()
    },
    sendToBack () {
      this.$store.state.products.newPrice.forEach(async reference => {
        try {
          const { buyPrice1, buyPrice2, buyPrice3, pdtReferenceId } = reference
          const data = {
            buyPrice1,
            buyPrice2,
            buyPrice3,
            pdtReferenceId,
            buyPrice4: null,
            buyPrice5: null
          }
          await buyHistoriesService.create(data)
          this.$router.history.push('/admin/products')
        } catch (e) {
          this.$store.commit('notif/sendAlert')
        }
      })
    },
    razTable () {
      this.referencedProducts = []
      this.unReferencedProducts = []
      this.sharedRefSelected = []
      this.importedProduct = []
      this.originReferences = []
      this.validRef = []
    },
    makeCols (nbCol, ws) {
      // set the param of the spreadsheet
      let { firstRow } = this.defaultTram
      if (!this.useDefaultTram) {
        firstRow = this.selectedConfig.firstRow
      }
      const label = [{ name: 'Référence Kanopée', key: 0 }]
      try {
        for (let i = 1; i < nbCol + 1; i++) {
          label.push({
            name: ws[XLSX.utils.encode_cell({ c: i - 1, r: firstRow })].v,
            key: i
          })
        }
      } catch (e) {
        this.$store.commit('notif/sendAlert', `Un problème est survenu durant l'intégration du fichier,
           êtes vous sur d'avoir importé le bon fichier pour ${this.provider.name}`)
        throw new Error()
      }
      return label
    },
    addValidRef (newProviderProduct, i) {
      this.indexSelected = i
      if (!this.sharedRefSelected.id) {
        this.sharedRefSelected = []
      } else {
        // add unknow reference in array of indexed products
        this.referencedProducts.push({
          kanopeeReference: `${this.sharedRefSelected.sharedReference}_${this.provider.code}`,
          pdtProductId: this.sharedRefSelected.id,
          pdtProviderId: this.provider.id,
          pdtSiteGroupingId: this.$store.state.admin.group.id,
          ...newProviderProduct
        })
        this.unReferencedProducts.splice(i, 1)
        this.sharedRefSelected = []
      }
    },
    hideSelect (registeredRef, i) {
      this.newRegistered.push(registeredRef)
      this.unReferencedProducts.splice(i, 1)
    },
    createNewRow (ws, nbCol, item, isReferenced, matchRef) {
      const row = []
      for (let j = 0; j < nbCol; j++) {
        const cellref = XLSX.utils.encode_cell({ c: j, r: item - 1 })
        const cell = ws[cellref]
        if (ws[cellref]) {
          row.push(cell.v)
        } else {
          row.push(null)
        }
      }
      this.createNewVariable(isReferenced, matchRef, row)
    },
    createNewVariable (isReferenced, matchRef, row) {
      if (row[0] && row[1]) {
        const reference = {}
        let { providerHeaders } = this.defaultTram
        if (!this.useDefaultTram) {
          providerHeaders = this.selectedConfig.providerHeaders
        }
        // add info product to our variables
        for (let i = 0; i < providerHeaders.length; i++) {
          reference[providerHeaders[i]] = row[i]
        }
        // add special set to our variables
        if (this.provider.id === 6 || this.provider.id === 4) {
          reference.category = 2
        }
        // add new prices to referenced products
        this.addNewPriceToReferencedProducts(isReferenced, matchRef, reference)
      }
    },
    addNewPriceToReferencedProducts (isReferenced, matchRef, reference) {
      if (isReferenced && matchRef) {
        let lastPrice = {}
        if (matchRef.pdt_buyHistories.length) {
          lastPrice = matchRef.pdt_buyHistories.slice(0).sort((a, b) => {
            return b.id - a.id
          })[0]
        } else {
          lastPrice = {
            buyPrice1: 'non renseigné',
            buyPrice2: 'non renseigné',
            buyPrice3: 'non renseigné'
          }
        }
        const lastPriceRegistered = {
          pdtReferenceId: matchRef.id,
          price1Old: lastPrice.buyPrice1,
          price2Old: lastPrice.buyPrice2,
          price3Old: lastPrice.buyPrice3,
          kanoppeReference: matchRef.kanopeeReference
        }
        this.originReferences.push({ ...lastPriceRegistered, ...reference })
      } else {
        this.unReferencedProducts.push(reference)
      }
    },
    _suppress (evt) {
      evt.stopPropagation()
      evt.preventDefault()
    },
    _drop (evt) {
      evt.stopPropagation()
      evt.preventDefault()
      const files = evt.dataTransfer.files
      if (files && files[0]) {
        this._file(files[0])
      }
    },
    _change (evt) {
      const files = evt.target.files
      if (files && files[0]) {
        this._file(files[0])
      }
    },
    _export (evt) {
      /* convert state to workbook */
      const ws = XLSX.utils.aoa_to_sheet(this.importedData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'SheetJS')
      /* generate file and send to client */
      XLSX.writeFile(wb, 'sheetjs.xlsx')
    },
    async _file (file) {
      try {
        await this.fetchReferencedProduct()
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      // number of column for each provider to set for each provider
      let { ranges, loop } = this.defaultTram
      if (!this.useDefaultTram) {
        ranges = this.selectedConfig.ranges
        loop = this.selectedConfig.loop
      }
      const range = XLSX.utils.encode_range(ranges)
      const nbCol = XLSX.utils.decode_range(range).e.c + 1
      /* Boilerplate to set up FileReader */
      const reader = new FileReader()
      reader.onload = e => {
        /* Parse data */
        const bstr = e.target.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        /* Get first worksheet */
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          blankrows: false
        })
        /* Update state */
        this.importedData = data
        for (let i = loop; i < 500; i++) {
          const cellToCheck = XLSX.utils.encode_cell({ c: 0, r: i - 1 })
          if (
            ws[cellToCheck] &&
            this.$store.state.products.oldPrice.find(
              product => product.providerReference === ws[cellToCheck].v
            )
          ) {
            const matchRef = this.$store.state.products.oldPrice.find(
              product => product.providerReference === ws[cellToCheck].v
            )
            this.createNewRow(ws, nbCol, i, { isReferenced: true }, matchRef)
            this.$store.commit('products/addOldProducts', this.originReferences)
          } else if (ws[cellToCheck]) {
            this.createNewRow(ws, nbCol, i)
          }
        }
        this.importedProduct = this.makeCols(nbCol, ws)
      }
      reader.readAsBinaryString(file)
    },
    changeSharedRef (value) {
      this.sharedRefSelected = value
    }
  }
}
</script>
<style scoped>
.v-card:not(.v-sheet--tile):not(.v-card--shaped) {
  border-radius: 24px;
}
</style>
