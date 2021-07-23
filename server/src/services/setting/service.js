
export default class Service {
  setup (app) {
    this.typeService = app.service('/api/types')
    this.kindsService = app.service('/api/kinds')
    this.varietiesService = app.service('/api/varieties')
    this.weightUnitiesService = app.service('/api/weight-unities')
    this.categoriesService = app.service('/api/categories')
    this.countriesService = app.service('/api/countries')
    this.distancesService = app.service('/api/distances')
    this.providersService = app.service('/api/providers')
    this.siteGroupingsService = app.service('/api/site-groupings')
  }

  async find ({ query }) {
    // 3 levels of setting to fetch
    const mini = [this.siteGroupingsService.find(), this.providersService.find(), this.distancesService.find(), this.typeService.find()]
    const basic = [...mini, this.categoriesService.find(), this.countriesService.find(), this.weightUnitiesService.find()]
    const advanced = [...basic, this.varietiesService.find(), this.kindsService.find()]
    // set the promise
    let datas = []
    if (query.mini) {
      datas = await Promise.all(mini)
    }
    if (query.basic) {
      datas = await Promise.all(basic)
    }
    if (query.advanced) {
      datas = await Promise.all(advanced)
    }
    // object expected
    const miniReturn = {
      groups: datas[0].data,
      providers: datas[1].data,
      distances: datas[2].data,
      types: datas[3]
    }
    let result = miniReturn
    if (query.basic || query.advanced) {
      const basicReturn = {
        ...miniReturn,
        categories: datas[4].data,
        countries: datas[5].data,
        unities: datas[6].data
      }
      result = basicReturn
      if (query.advanced) {
        const advancedReturn = {
          ...basicReturn,
          varieties: datas[7].data,
          kinds: datas[8].data
        }
        result = advancedReturn
      }
    }
    return result
  }
}
