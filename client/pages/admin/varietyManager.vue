<template lang="pug">
  v-container(fluid).silver
    v-row.justify-center
        v-card.elevation-0.silver
          v-card-title Gérer mes variétés
          v-card-text
            v-row
              v-col.col-12.col-sm-6.col-md-3
                v-select.mr-md-5(
                v-model="fruits"
                :items="$store.state.admin.types"
                item-text="name"
                item-value="id"
                @change="selectKind"
                label="Type de légumes"
                outlined
                dense
                append-icon="$mdi-chevron-down"
                )
              v-col.col-12.col-sm-6.col-md-3
                v-select.mr-md-5(
                v-model="pdtKindId"
                :items="kinds"
                item-text="name"
                item-value="id"
                @change="selectVariety"
                label="Genre de légumes"
                outlined
                dense
                append-icon="$mdi-chevron-down"
                )
              v-col.col-12.col-sm-6.col-md-3
                v-select.mr-md-5(
                v-model="variety"
                :items="varieties"
                item-text="name"
                return-object
                @change="manageVariety"
                outlined
                dense
                label="Variété de légumes"
                append-icon="$mdi-chevron-down"
              )
            v-row(v-if="loadingPage")
              v-img(src="/logoKnoir.png" max-height=500 contain)
            v-row(v-if="pdtKindId !== null && fruits && variety && displayFrom")
              v-col.col-12.col-sm-6
                v-text-field(
                  label="Nom de la variété"
                  v-model="setVariety.name"
                )
                v-text-field(
                  label="Photo de la variété"
                  v-model="setVariety.picture"
                )
                v-text-field(
                  label="Description de la variété"
                  v-model="setVariety.description"
                )
                v-text-field(
                  label="Conseil de préparation"
                  v-model="setVariety.preparationAdvice"
                )
                v-btn(
                  v-if="setVariety.description && setVariety.picture && setVariety.preparationAdvice  && setVariety.name.length > 2"
                  @click="postVariety"
                  color="primary"
                  :disabled="!setVariety.picture"
                ) {{onAddVariety ? 'Ajouter' : 'Modifier'}}
              v-col.col-12.col-sm-6.col-md-3
                v-img(
                  :src="setVariety.picture"
                  height="30vh"
                  width="100%"
                  position="center"
                  alt="legumes "
                ).picture
                v-row(no-gutters)
                  v-col.col-4.pt-0.pb-0
                    v-btn.btn-card(tile block height="100%" color="grey")
                      span(style="font-size: 150%;") -
                  v-col.col-4.pt-0.pb-0
                    v-btn.btn-card(tile block height="5vh" color="white") 0
                  v-col.col-4.pt-0.pb-0
                      v-btn.btn-card(
                        color="#6b8e23" height="100%" tile block)
                        span(style="font-size: 150%;") +
</template>

<script>
import { kindsService, varietiesService } from '@/api'

export default {
  data: () => ({
    kinds: [],
    varieties: [],
    onAddVariety: false,
    fruits: '',
    variety: '',
    pdtKindId: '',
    setVariety: {
      id: '',
      name: '',
      picture: null,
      description: '',
      preparationAdvice: ''
    },
    loadingPage: true
  }),
  methods: {
    async selectKind (e) {
      this.varieties = []
      this.setVariety = {}
      this.displayFrom = false
      try {
        const { data } = await kindsService.find({
          query: { pdtTypeId: e, $limit: 777 }
        })
        this.kinds = data
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    async selectVariety (e) {
      this.displayFrom = false
      this.loadingPage = true
      try {
        this.loadingPage = false
        const { data } = await varietiesService.find({
          query: { pdtKindId: e, $limit: 50 }
        })
        this.varieties = [
          ...data,
          { id: 0, name: ' + Ajouter une nouvelle variété' }
        ]
      } catch (e) {
        this.loadingPage = true
        this.$store.commit('notif/sendAlert')
      }
    },
    manageVariety (e) {
      this.displayFrom = true
      if (e.id === 0) {
        this.setVariety = {
          id: '',
          name: '',
          picture: '',
          preparationAdvice: ''
        }
        this.onAddVariety = true
      } else {
        this.onAddVariety = false
        this.setVariety = this.varieties.find(x => x === e)
      }
    },
    async postVariety () {
      try {
        if (this.onAddVariety) {
          if (this.isUniqueVariety()) {
            await varietiesService.create({
              ...this.setVariety,
              pdtKindId: this.pdtKindId
            })
          } else {
            this.$store.commit('notif/sendAlert', 'Cette variété existe déja !')

            return
          }
        } else {
          const { id } = this.setVariety
          await varietiesService.patch(id, {
            ...this.setVariety,
            pdtKindId: this.pdtKindId
          })
        }
        this.setVariety = {}
        this.variety = {}
        this.displayFrom = false
        this.$store.commit('notif/sendSuccess', 'Ajout de la variété avec succés')
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
    },
    isUniqueVariety () {
      let isUnique = true
      if (
        this.varieties.find(
          x => x.name.toLowerCase() === this.setVariety.name.toLowerCase()
        )
      ) {
        isUnique = false
      }
      return isUnique
    }
  }
}
</script>

<style lang="scss" scoped>
.picture {
  border-radius: 30px 30px 0px 0px !important;
}
.silver {
  background-color: $background-color-table;
}
</style>
