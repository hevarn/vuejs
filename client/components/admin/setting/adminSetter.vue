<template lang="pug">
v-container
  v-select(
    label='Configurer mes tables',
    :items='tables',
    v-model='toSet',
    outlined,
    @change='changeCategory',
    dense,
    append-icon='$mdi-chevron-down'
  )
</template>

<script>
import {
  siteGroupingsService,
  countriesService,
  categoriesService,
  typesService,
  weightUnitiesService,
  distancesService,
  kindsService,
  providersService,
  userService,
  pressService
} from '@/api'
export default {
  data: () => ({
    tables: [
      { text: 'Utilisateurs', value: userService },
      { text: 'Revue de presse', value: pressService },
      { text: 'Unités de mesure', value: weightUnitiesService },
      { text: 'Distances', value: distancesService },
      { text: 'Groupement de sites', value: siteGroupingsService },
      { text: 'Fournisseurs/sites', value: providersService },
      { text: 'Pays', value: countriesService },
      { text: 'Catégories', value: categoriesService },
      { text: 'Type de légumes', value: typesService },
      { text: 'Genre de légumes', value: kindsService }
    ],
    toSet: ''
  }),
  methods: {
    changeCategory (e) {
      this.$emit('fetch-setting', e)
    }
  }
}
</script>
