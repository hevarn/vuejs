<template lang="pug">
  v-container(fluid).ma-0
    #app
      #mapid(:style="heightCarto.height")
</template>

<script>
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Creating map optionss

export default {
  data () {
    return {
      map: null,
      iconMarker: L.icon({
        iconUrl: '/markerMap2.png',
        iconSize: [30, 30]
      })
    }
  },
  computed: {
    heightCarto () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.height = '300px'
          break
        case 'sm':
          result.height = '400px'
          break
        case 'md':
          result.height = '545px'
          break
        case 'lg':
          result.height = '545px'
          break
        case 'xl':
          result.height = '545px'
          break
        default:
          result.height = '300px'
          break
      }
      return {
        height: `height: ${result.height}`
      }
    }
  },
  mounted () {
    this.drawMap(this.options)
  },
  methods: {
    drawMap (mapOptions) {
      if (this.map !== null) {
        this.map.remove()
      }
      // Creating a map object at init
      this.map = L.map('mapid', {
        center: [44.840023, -0.637281],
        zoom: 11
      })

      //   Add base map
      const layer = new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')

      // create marker

      // first Marker
      const customPop =
        '<strong>Siège Social</strong><br><img width=140px src="icon.png"><br><strong>Espace Copernic</strong><br><strong>60 pl. de la république<br> 33160 St-Médard-enJ</strong>'
      const markerSitePrincipal = L.marker([44.8927484, -0.7157023], {
        icon: this.iconMarker
      })
        .bindPopup(customPop)
        .addTo(this.map)

      // Second Marker
      const customPopLadera =
        '<strong>Serre Ladéra</strong><br><img width=140px src="contact1.jpg"><br><strong>Résidence Ladéra</strong><br><strong>Rue de la Lamproie<br> 33270 Floirac</strong>'
      const markSiteLadera = L.marker([44.827049, -0.52735], {
        icon: this.iconMarker
      })
        .bindPopup(customPopLadera)
        .addTo(this.map)

      // third Marker
      const custompopUpVatel =
        '<strong>Kanopée de Vatel</strong><br><img width=140px src="contact2.jpg"><br><strong>Les Tables de Vatel</strong><br><strong>4 cours du Médoc<br>33000 Bordeaux</strong>'
      const markSiteVatel = L.marker([44.855974, -0.564322], {
        icon: this.iconMarker
      })
        .bindPopup(custompopUpVatel)
        .addTo(this.map)

      // create group to display all
      const markers = L.layerGroup([
        markerSitePrincipal,
        markSiteLadera,
        markSiteVatel
      ]).addTo(this.map)

      // Adding layer to the map
      this.map.addLayer(layer, markers)
    }
  }
}
</script>
