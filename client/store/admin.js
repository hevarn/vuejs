import { settingService } from '@/api'

export const state = () => ({
  providers: [],
  countries: [],
  varieties: [],
  categories: [],
  types: [],
  unities: [],
  distances: [],
  kinds: [],
  siteGroupings: [],
  truthyFalsy: [
    { name: 'Oui', value: true },
    { name: 'Non', value: false }
  ],
  group: 0,
  providersBG: [],
  stockActions: [],
  view: false,
  selectedProvider: {},
  loadingPage: true,
  selectedMarket: {},
  marketList: []
})

export const actions = {
  async fetchSettings ({ commit }, type) {
    let query = { query: { mini: true } }
    let setMutations = 'setMiniSettings'
    if (type === 2) {
      query = { query: { basic: true } }
      setMutations = 'setBasicSettings'
    }
    if (type === 3) {
      query = { query: { advanced: true } }
      setMutations = 'setAdvancedSettings'
    }
    try {
      const settings = await settingService.find(query)
      commit(setMutations, settings)
    } catch (e) {
      this.$store.commit('notif/sendAlert', 'Le télechargement des paramettres a échoué')
    }
  }
}

export const mutations = {
  setMiniSettings (state, { groups, providers, distances, types }) {
    state.siteGroupings = groups
    state.providers = providers
    state.distances = distances
    state.types = types
  },
  setBasicSettings (
    state,
    { groups, providers, distances, countries, categories, unities, types }
  ) {
    state.siteGroupings = groups
    state.providers = providers
    state.distances = distances
    state.countries = countries
    state.categories = categories
    state.unities = unities
    state.types = types
  },
  setAdvancedSettings (
    state,
    {
      groups,
      providers,
      countries,
      varieties,
      categories,
      types,
      unities,
      distances,
      kinds
    }
  ) {
    state.siteGroupings = groups
    state.providers = providers
    state.distances = distances
    state.countries = countries
    state.categories = categories
    state.unities = unities
    state.varieties = varieties
    state.types = types
    state.kinds = kinds
  },
  addOneVarietyToSetting (state, variety) {
    state.varieties.push(variety)
  },
  changeGroup (state, group) {
    state.group = group
    state.providersBG = state.providers
      .filter(x => x.pdtSiteGroupingId === state.group.id)
      .sort((a, b) => a.isSite - b.isSite)
  },
  updateGroup (state, group) {
    state.group = group
  },
  updateMarket (state, info) {
    state.siteGroupings = info
  },
  tooggleView (state) {
    state.view = !state.view
  },
  addOneKindToSetting (state, kind) {
    state.kinds.push(kind)
  },
  updateMarketStatus (state, { id, isOpen }) {
    state.siteGroupings.find(x => x.id === id).isOpen = isOpen
  },
  changeSelectedProvider (state, provider) {
    state.selectedProvider = provider
  },
  launchLoadingPage (state) {
    state.loadingPage = true
  },
  removeLoadingPage (state) {
    state.loadingPage = false
  },
  updateSelectedMarket (state, market) {
    state.selectedMarket = market
  },
  updateMarketList (state, list) {
    state.marketList = list
  }
}
