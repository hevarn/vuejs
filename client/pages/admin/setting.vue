<template lang="pug">
  v-container(fluid).silver
    v-row(justify="center")
      v-col.col-12.col-sm-6.col-md-6.col-lg-3
        AdmSetgAdminSetter(@fetch-setting="fetchSetting")
      v-col(align="center").col-12
        v-btn(outlined text v-if="actualService.name === 'users'" @click='genCSV(true)') Export des comptes Actifs
        v-btn(outlined text v-if="actualService.name === 'users'" @click='genCSV(false)') Export des comptes Fermés
    v-row(justify="center")
      v-col
        AdmSetgTableSetter.box-border(
          v-if="dataSetting.length"
          :loading='loadingPage'
          loader-height="50"
          loading-text="Loading... Please wait"
          color="#010101"
          :dataSetting="dataSetting"
          :actualService="actualService"
          :headers="headers"
          :dataKeys="dataKeys"
          :idSelected="idSelected"
          @fetch-setting="fetchSetting"
          @fetch-id-selected="fetchIdSelected"
        )
    v-row(v-if="!dataSetting.length")
      v-img(src="/logoKnoir.png" max-height=500 contain)
</template>

<script>

export default {
  data: () => ({
    idSelected: 0,
    dataSetting: [],
    loadingPage: false,
    actualService: {},
    headers: [],
    dataKeys: []
  }),
  async mounted () {
    try {
      await this.$store.dispatch('admin/fetchSettings', 3)
    } catch (e) {
      this.$store.commit('notif/sendAlert')
    }
  },
  methods: {
    convertToCSV (objArray) {
      const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
      let str = ''
      for (let i = 0; i < array.length; i++) {
        let line = ''
        for (const index in array[i]) {
          if (line !== '') line += ','
          line += array[i][index]
        }

        str += `${line}\r\n`
      }
      return str
    },
    exportCSVFile (headers, items, fileTitle) {
      items = items.map(({ firstname, lastname, email, tel, createdAt, pdt_provider: { name } }) => {
        return {
          firstname, lastname, email, tel, createdAt, siteName: name
        }
      })
      const jsonObject = JSON.stringify(items)
      if (headers) {
        items.unshift(headers)
      }
      const csv = this.convertToCSV(jsonObject)
      const exportedFilenmae = `${fileTitle}.csv` || 'export.csv'
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae)
      } else {
        const link = document.createElement('a')
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', exportedFilenmae)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    },
    genCSV (activesUser) {
      const headers = {
        firstname: 'Prénom',
        lastname: 'Nom',
        email: 'Email',
        tel: 'Telephone',
        createdAt: 'DateCreation',
        siteName: 'Site'
      }
      let users = this.dataSetting.filter(({ isVerified }) => isVerified)
      let title = 'utilisateurs Actifs'
      if (!activesUser) {
        users = this.dataSetting.filter(({ isVerified }) => !isVerified)
        title = 'comptes utilisateurs cloturées'
      }
      this.exportCSVFile(headers, users, title)
    },
    fetchIdSelected (idSelect) {
      this.idSelected = idSelect
    },
    async fetchSetting (service) {
      this.idSelected = 0
      this.loadingPage = true
      try {
        this.actualService = service
        const query = { query: {} }
        if (this.actualService.name === 'users') {
          query.query = { mini: true }
        }
        const data = await this.actualService.find(query)
        this.headers = []
        // TODO NEED REFACTO
        // in case of seuquelize query limit has been removed use data if limit
        // is false otherwise just data.data (old struct)
        this.dataSetting = data.data || data
        if (this.dataSetting.length) {
          this.dataKeys = Object.keys(this.dataSetting[0]).filter(x => (
            x !== 'createdAt' && x !== 'updatedAt' && x !== 'opening' && x !== 'closing' && x !== 'id'
          ))
        }
        this.dataKeys.unshift('id')
        if (this.actualService.name === 'providers') {
          this.dataKeys = [
            'id',
            'name',
            'isSite',
            'isPrivate',
            'pdtSiteGroupingId',
            'code',
            'scheduleImg'
          ]
        }
        if (this.actualService.name === 'users') {
          this.dataKeys = [
            'userId',
            'firstname',
            'lastname',
            'email',
            'tel',
            'rank',
            'nbHome',
            'postalCode',
            'isVerified',
            'isConfirmed',
            'pdtProviderId'
          ]
        }
        if (this.actualService.name === 'press') {
          this.dataKeys = ['id', 'title', 'img', 'link', 'source', 'date']
        }
        this.dataKeys.forEach(element => {
          this.headers.push({ text: element, value: element })
        })
        this.dataKeys.shift()
        if (!this.dataSetting.length) {
          this.dataSetting = [{ id: null }]
        }
      } catch (e) {
        this.$store.commit('notif/sendAlert')
      }
      this.loadingPage = false
    }
  }
}
</script>

<style lang="scss" scoped>
.silver {
  background-color: $background-color-table;
}
</style>
