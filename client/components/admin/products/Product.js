export default class Product {
  constructor (
    reference,
    {
      countries,
      providers,
      categories,
      types,
      unities,
      distances,
      kinds
    },
    providerId,
    varietyId,
    group,
    varietySelect
  ) {
    this.reference = reference
    this.providers = providers
    this.countries = countries
    this.varieties = varietySelect
    this.categories = categories
    this.types = types
    this.unities = unities
    this.distances = distances
    this.kinds = kinds
    this.providerId = providerId
    this.varietyId = varietyId
    this.categoryId = 0
    this.unityId = 0
    this.sharedRef = 0
    this.providerCode = 0
    this.distanceId = 0
    this.countryId = 0
    this.group = group
  }

  checkReference () {
    return this.reference
  }

  getCountryId () {
    if (
      this.reference.country &&
      this.countries.find(
        x => x.name.toLowerCase() === this.reference.country.toLowerCase()
      )
    ) {
      this.countryId = this.countries.find(
        x => x.name.toLowerCase() === this.reference.country.toLowerCase()
      ).id
      return this.countryId
    } else {
      return false
    }
  }

  getUnityId () {
    if (
      this.reference.unity &&
      this.unities.find(
        x => x.providerName.toLowerCase() === this.reference.unity.toLowerCase()
      )
    ) {
      this.unityId = this.unities.find(
        x => x.providerName.toLowerCase() === this.reference.unity.toLowerCase()
      ).id
      return this.unityId
    } else {
      return false
    }
  }

  getCategoryId () {
    if (
      this.reference.category &&
      this.categories.find(
        x => parseInt(x.providerName) === this.reference.category
      )
    ) {
      this.categoryId = this.categories.find(
        x => parseInt(x.providerName) === this.reference.category
      ).id
      return this.categoryId
    } else {
      return false
    }
  }

  getInfoRef () {
    if (this.reference.description) {
      return this.reference.description
    } else {
      return null
    }
  }

  getBuyPrice () {
    let buyPrice = {}
    if (this.reference.buyPrice1) {
      buyPrice = {
        buyPrice1: this.reference.buyPrice1,
        buyPrice2: this.reference.buyPrice2 || null,
        buyPrice3: this.reference.buyPrice3 || null,
        buyPrice4: this.reference.buyPrice4 || null,
        buyPrice5: this.reference.buyPrice5 || null
      }
    }
    return buyPrice
  }

  getProviderRef () {
    if (this.reference.providerReference) {
      return this.reference.providerReference
    } else {
      return false
    }
  }

  getPackage () {
    if (this.reference.package) {
      return this.reference.package
    } else {
      return false
    }
  }

  getProviderId () {
    if (this.providerId) {
      return this.providerId
    } else {
      return false
    }
  }

  getProviderCode () {
    if (this.providerId) {
      this.providerCode = this.providers.find(
        x => x.id === this.providerId
      ).code
      return this.providerCode
    } else {
      return false
    }
  }

  getDistanceId () {
    return this.distanceId
  }

  setDistanceId (e) {
    this.distanceId = e
  }

  setCategory (e) {
    this.categoryId = e
  }

  setCountryId (e) {
    this.countryId = e
  }

  setUnityId (e) {
    this.unityId = e
  }

  getSharedRef () {
    if (this.reference) {
      const variety = this.varieties.find(x => x.id === this.varietyId)
      const { name, pdtKindId } = variety
      let formatedVarietyName = name.substring(0, 8)
      const splitedNameVariety = name.split(' ')
      if (splitedNameVariety.length > 1) {
        formatedVarietyName = ''
        splitedNameVariety.forEach(word => {
          formatedVarietyName += word.substring(0, 1).toUpperCase() + word.substring(1, 4)
        })
      }
      const kind = this.kinds.find(x => x.id === pdtKindId).name
      this.sharedRef = `${kind.substring(0, 4)}_${formatedVarietyName}_${
        this.categoryId
      }_${this.unityId}_${this.distanceId}_${
        this.group
      }_${this.reference.country.substring(0, 3)}`
      return this.sharedRef
    } else {
      return false
    }
  }

  getReferenceRef () {
    this.getProviderCode()
    this.getSharedRef()
    if (this.reference.providerReference) {
      return `${this.sharedRef}_${this.providerCode}`
    } else {
      return ''
    }
  }
}
