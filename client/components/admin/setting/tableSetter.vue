<template lang="pug">
    v-card.box-border
      v-dialog(v-model="statusPopup" width=500)
        v-card
          v-card-title Suppression d'un item de la table {{ nameTable }}
          v-card-text Voulez-vous supprimer le champ N°{{ idSelected }}?
          v-card-actions
            v-spacer
            v-btn.ma-2(outlined color="secondary" @click="statusPopup = false") Annuler
            v-btn.ma-2(outlined color="primary" @click="deleteItem") Oui
      v-card-title Table {{ nameTable }}
        v-spacer
        v-btn(icon v-if="idSelected !== 0" @click.stop="statusPopup = true")
          v-icon $mdi-trash-can-outline
        v-spacer
        v-text-field(
          v-model="search"
          append-icon="$mdi-magnify"
          label="Pensez à controler si j'existe déja ici avant de m'ajouter"
          single-line
          hide-details
        )
      v-data-table(
        :loading='loading'
        v-model="selected"
        :expanded.sync="expand"
        :single-expand="singleSelected"
        show-expand
        :headers="headers"
        :items="dataSetting"
        :search="search"
        @click:row="clicked"
        :footer-props={
          itemsPerPageText: 'Item par page',
        prevIcon: '$mdi-chevron-left',
        nextIcon: '$mdi-chevron-right'
        }
        :header-props={
          sortIcon: '$mdi-arrow-up',
          sortByText:'Filtrer par'
        }
      )
        template(v-slot:no-data)
          SmallLoading

        template(v-slot:item.data-table-expand="{ expand, isExpanded, item }")
          v-icon(v-if="!((item.id || item.userId) === idSelected)" @click="expand(!isExpanded)") $mdi-checkbox-blank-outline
          v-icon(v-if="(item.id || item.userId) === idSelected") $mdi-checkbox-marked

        template(v-slot:item.name="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.name"
            @save="save(updateName.item)"
          ) {{ updateName.item.name }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.name"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              )
        template(v-slot:item.providerName="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.providerName"
            @save="save(updateName.item)"
          ) {{ updateName.item.providerName }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.providerName"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              )
        template(v-slot:item.isSite="updateName")
          v-edit-dialog(
            :return-value.sync="newValue"
          ) {{ isSite.find(x => x.value === updateName.item.isSite).text }}
            template(v-slot:input)
              v-select(
                append-icon="$mdi-chevron-down"
                v-model="updateName.item.isSite"
                :items="isSite"
                @change="save(updateName.item, updateName.item.isSite)"
              )
        template(v-slot:item.isPrivate="updateName")
          v-edit-dialog(
            :return-value.sync="newValue"
          ) {{ isPrivate.find(x => x.value === updateName.item.isPrivate).text }}
            template(v-slot:input)
              v-select(
                v-model="updateName.item.isPrivate"
                :items="isPrivate"
                @change="save(updateName.item, updateName.item.isPrivate)"
                append-icon="$mdi-chevron-down"
              )
        template(v-slot:item.pdtSiteGroupingId="updateName")
          v-edit-dialog(
            :return-value.sync="newValue"
          ) {{ $store.state.admin.siteGroupings.find(x => x.id === updateName.item.pdtSiteGroupingId).name }}
            template(v-slot:input)
              v-select(
                v-model="updateName.item.pdtSiteGroupingId"
                :items="$store.state.admin.siteGroupings"
                item-text="name"
                item-value="id"
                @change="save(updateName.item, updateName.item.pdtSiteGroupingId)"
                append-icon="$mdi-chevron-down"
              )
        template(v-slot:item.code="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.code"
            @save="save(updateName.item)"
          ) {{ updateName.item.code }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.code"
                :rules="[max8chars]"
                label="Edit"
                single-line
                counter
              )
        template(v-slot:item.scheduleImg="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.scheduleImg"
            @save="save(updateName.item)"
          ) {{ updateName.item.scheduleImg }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.scheduleImg"
                label="Edit"
                single-line
                counter
              )
        template(v-slot:item.pdtTypeId="updateName")
          v-edit-dialog(
            :return-value.sync="newValue"
          ) {{ $store.state.admin.types.find(x => x.id === updateName.item.pdtTypeId) ? $store.state.admin.types.find(x => x.id === updateName.item.pdtTypeId).name : updateName.item.pdtTypeId }}
            template(v-slot:input)
              v-select(
                v-model="updateName.item.pdtTypeId"
                :items="$store.state.admin.types"
                @change="save(updateName.item, updateName.item.pdtTypeId)"
                item-text="name"
                item-value="id"
                append-icon="$mdi-chevron-down"
              )

        //- Information pour les articles de Presse
        template(v-slot:item.title="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.title"
            @save="save(updateName.item)"
          ) {{ updateName.item.title }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.title"
                label="Edit"
                single-line
                counter
              )
        template(v-slot:item.img="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.img"
            @save="save(updateName.item)"
          ) {{ updateName.item.img }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.img"
                label="Edit"
                single-line
                counter
              )
        template(v-slot:item.link="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.link"
            @save="save(updateName.item)"
          ) {{ updateName.item.link }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.link"
                label="Edit"
                single-line
                counter
              )
        template(v-slot:item.source="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.source"
            @save="save(updateName.item)"
          ) {{ updateName.item.source }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.source"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              )
        template(v-slot:item.date="updateName")
          v-edit-dialog(
            :return-value.sync="newValue"
            @save="save(updateName.item)"
          ) {{ updateName.item.date }}
            template(v-slot:input)
              v-menu(
                v-model="fromDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px")

                template(v-slot:activator="{ on }")
                  v-text-field(
                    v-model="updateName.item.date"
                    :label="column"
                    readonly
                    :value="fromDateDisp"
                    v-on="on")
                v-date-picker(
                  locale="fr-FR"
                  v-model="updateName.item.date"
                  @change="save(updateName.item, updateName.item.date)"
                  no-title
                  @input="fromDateMenu = false")

        //- Informations pour les comptes utilisateurs
        template(v-slot:item.firstname="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.firstname"
            @save="save(updateName.item)"
          ) {{ updateName.item.firstname }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.firstname"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              )
        template(v-slot:item.lastname="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.lastname"
            @save="save(updateName.item)"
          ) {{ updateName.item.lastname }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.lastname"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              )
        template(v-slot:item.tel="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.tel"
            @save="save(updateName.item)"
          ) {{ updateName.item.tel }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.tel"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              )
        template(v-slot:item.rank="updateName")
          v-edit-dialog(
            :return-value.sync="newValue"
          ) {{ updateName.item.rank }}
            template(v-slot:input)
              v-select(
                v-model="updateName.item.rank"
                :items="rankTable"
                @change="save(updateName.item, updateName.item.rank)"
                append-icon="$mdi-chevron-down"
              )
        template(v-slot:item.nbHome="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.nbHome"
            @save="save(updateName.item)"
          ) {{ updateName.item.nbHome }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.nbHome"
                :rules="[max2chars]"
                label="Modifier"
                single-line
                type="number"
                min="0"
                counter
              )
        template(v-slot:item.postalCode="updateName")
          v-edit-dialog(
            :return-value.sync="updateName.item.postalCode"
            @save="save(updateName.item)"
          ) {{ updateName.item.postalCode }}
            template(v-slot:input)
              v-text-field(
                v-model="updateName.item.postalCode"
                :rules="[max8chars]"
                label="Modifier"
                single-line
                counter
              )
        template(v-slot:item.pdtProviderId="updateName")
          v-edit-dialog(
            :return-value.sync="newValue"
          ) {{ $store.state.admin.providers.find(x => x.id === updateName.item.pdtProviderId).name }}
            template(v-slot:input)
              v-select(
                v-model="updateName.item.pdtProviderId"
                :items="$store.state.admin.providers"
                item-text="name"
                item-value="id"
                @change="save(updateName.item, updateName.item.pdtProviderId)"
                append-icon="$mdi-chevron-down"
              )
        template(v-slot:item.isVerified="updateName")
          v-edit-dialog(
            :return-value.sync="newValue"
          ) {{ updateName.item.isVerified ? 'Oui' : 'Non' }}
            template(v-slot:input)
              v-select(
                v-model="updateName.item.isVerified"
                :items="truthyOrFalsy"
                @change="save(updateName.item, updateName.item.isVerified)"
                append-icon="$mdi-chevron-down"
              )
        template(v-slot:item.isConfirmed="updateName")
          v-edit-dialog(
            :return-value.sync="newValue"
          ) {{ updateName.item.isConfirmed ? 'Oui' : 'Non' }}
            template(v-slot:input)
              v-select(
                v-model="updateName.item.isConfirmed"
                :items="truthyOrFalsy"
                @change="save(updateName.item, updateName.item.isConfirmed)"
                append-icon="$mdi-chevron-down"
              )
        template(v-slot:item.isOpen="updateName")
          v-edit-dialog(
            :return-value.sync="newValue"
          ) {{ updateName.item.isOpen ? 'Oui' : 'Non' }}
            template(v-slot:input)
              v-select(
                v-model="updateName.item.isOpen"
                :items="truthyOrFalsy"
                @change="save(updateName.item, updateName.item.isOpen)"
                append-icon="$mdi-chevron-down"
              )
        template( v-slot:body.append="{ headers }")
          tr
            td
            td
              v-icon(@click="addSetting")="$mdi-plus-circle"
            td(v-for="column in dataKeys")
              div(v-if="truthOrFalseList.includes(column) || specialSelect.includes(column) || column === 'date'")
                v-select(
                  v-if="column === 'pdtProviderId'"
                  v-model="newLabel[column]"
                  :items="$store.state.admin.providers"
                  item-text="name"
                  item-value="id"
                  append-icon="$mdi-chevron-down"
                )
                v-select(
                  v-if="column === 'pdtSiteGroupingId'"
                  v-model="newLabel[column]"
                  :items="$store.state.admin.siteGroupings"
                  item-text="name"
                  item-value="id"
                  append-icon="$mdi-chevron-down"
                )
                v-select(
                  v-if="column === 'pdtTypeId'"
                  v-model="newLabel[column]"
                  :items="$store.state.admin.types"
                  item-text="name"
                  item-value="id"
                  append-icon="$mdi-chevron-down"
                )
                v-select(
                  v-if="column === 'rank'"
                  v-model="newLabel[column]"
                  :items="rankTable"
                  append-icon="$mdi-chevron-down"
                )
                v-select(
                  v-if="truthOrFalseList.includes(column)"
                  v-model="newLabel[column]"
                  :label="column"
                  :items="truthyOrFalsy"
                  append-icon="$mdi-chevron-down"
                )
                v-menu(
                  v-if="column === 'date'"
                  v-model="modifyDateMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px")

                  template(v-slot:activator="{ on }")
                    v-text-field(
                      :label="column"
                      readonly
                      :value="fromDateDisp"
                      v-on="on")
                  v-date-picker(
                    locale="fr-FR"
                    v-model="newLabel[column]"
                    no-title
                    @input="modifyDateMenu = false")
              v-text-field(
                v-else
                v-model="newLabel[column]"
                :label="column"
                single-line
                counter
              )
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    idSelected: {
      type: Number,
      default: () => 0
    },
    dataSetting: {
      type: Array,
      default: () => []
    },
    actualService: {
      type: Object,
      default: () => {
        // default is an empty Object
      }
    },
    headers: {
      type: Array,
      default: () => []
    },
    dataKeys: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    singleSelected: true,
    statusPopup: false,
    fromDateMenu: false,
    modifyDateMenu: false,
    headerProps: {
      sortByText: 'Filtrer par'
    },
    newValue: {},
    expand: [],
    selected: [],
    messageError: { notif: 'Une erreur est survenue', types: 1 },
    search: '',
    newLabel: {
      isOpen: false,
      opening: new Date(),
      closing: new Date(),
      adress: '',
      packaging1: 1
    },
    max25chars: v => v.length <= 50 || 'Trop de caractères!',
    max8chars: v => v.length <= 8 || 'Trop de caractères!',
    max2chars: v => v.length <= 2 || 'Trop de caractères!',
    isSite: [
      { text: 'Site', value: true },
      { text: 'Fournisseur', value: false }
    ],
    isPrivate: [
      { text: 'Privé', value: true },
      { text: 'Public', value: false }
    ],
    truthyOrFalsy: [
      { text: 'Oui', value: true },
      { text: 'Non', value: false }
    ],
    rankTable: ['user', 'admin', 'kulteur'],
    truthOrFalseList: [
      'isSite',
      'isPrivate',
      'isConfirmed',
      'isVerified',
      'isOpen'
    ],
    specialSelect: ['pdtProviderId', 'rank', 'pdtSiteGroupingId', 'pdtTypeId']
  }),
  computed: {
    fromDateDisp () {
      return this.newLabel[this.dataKeys[4]]
    },
    nameTable () {
      let name
      switch (this.actualService.name) {
        case 'users':
          name = 'utilisateur'
          break
        case 'press':
          name = 'revue de presse'
          break
        case 'weight-unities':
          name = 'unités de mesure'
          break
        case 'distances':
          name = 'distance'
          break
        case 'site-groupings':
          name = 'groupement de site'
          break
        case 'providers':
          name = 'fournisseur/site'
          break
        case 'countries':
          name = 'pays'
          break
        case 'categorie':
          name = 'catégorie'
          break
        case 'types':
          name = 'type de légumes'
          break
        case 'kinds':
          name = 'genre de légumes'
          break
      }
      return name
    }
  },
  methods: {
    clicked (item) {
      if (item.id) {
        this.$emit('fetch-id-selected', item.id)
      } else {
        this.$emit('fetch-id-selected', item.userId)
      }
    },
    openPopupDelete () {
      this.statusPopup = !this.statusPopup
    },
    async deleteItem () {
      try {
        await this.actualService.remove(this.idSelected)
        this.$emit('fetch-setting', this.actualService)
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.openPopupDelete()
    },
    async addSetting () {
      try {
        if (this.actualService.name === 'users') {
          this.newLabel.password = process.env.DEFAULT_PASSWORD
        }
        await this.actualService.create(this.newLabel)
        this.$store.commit('notif/sendSuccess', 'Enregistrement effectué avec succés')
        this.newLabel = {
          isOpen: false,
          opening: new Date(),
          closing: new Date(),
          adress: '',
          packaging1: 1
        }
        this.$emit('fetch-setting', this.actualService)
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async save (value, newValue) {
      let { id } = value
      if (value.userId) {
        id = value.userId
        delete value.email
        delete value.verifyToken
        delete value.verifyShortToken
        delete value.verifyExpires
        delete value.verifyChanges
        delete value.resetToken
        delete value.resetExpires
      }
      try {
        await this.actualService.patch(id, value)
        this.$store.commit('notif/sendSuccess', 'Modification effectuée avec succés')
        this.$emit('fetch-setting', this.actualService)
        this.newValue = newValue
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-border {
  border: 2px $dark-green solid;
  border-radius: $table-admin-border-radius !important;
  padding: $table-admin-padding;
}
</style>
