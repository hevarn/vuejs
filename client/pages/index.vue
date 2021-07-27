<template lang="pug">
  div
    Hero
    v-row.rowCustom(v-if='!$store.state.visitorNavbar.boutonClicked' class="ma-0")
      v-img.logo(src="/logoKnoir.png")
      div.title.col-sm-12.col-md-12(align="center")
        div(class="logoHome")
          h1(style="color:black") Qui veut faire sa part ?
          p(style="color:black; font-weight:bold") Paniers bio et cultivés au pied de chez vous
    v-row.row.ma-0(v-else)
      v-row.rowCustom.ma-0
        v-img.logo(src="/logoKnoir.png")
        div.title.col-sm-12.col-md-12(align="center")
          div.secondPart
            h1
              mark.titlekoncept Vous souhaitez être partenaire ?
            p
              mark.textkoncept Découvrez comment intégrer Kanopée Koncept dans votre offre et devenez acteurs de la transition !
    transition(name="slide-fade")
      VisitHomeService(v-if='$store.state.visitorNavbar.boutonClicked')
      VisitHomeConcept(v-else)
    VisitPartPartenaire
</template>

<script>
import Hero from '@/components/Hero'
export default {
  components: {
    Hero
  },
  layout: 'visitor'
}
</script>

<style lang="scss" scoped>
.row {
  position: inherit;
}
.rowCustom {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 600px;
  align-items: center;
}

.logo {
  max-width: 280px;
  margin: 0 auto;
}

.title {
  line-height: initial;
  margin-bottom: 150px;
}
.secondPart {
  width: 700px;
}

.titlekoncept {
  color: black;
  background-color: rgba(255, 255, 255, 0.5);
}

.textkoncept {
  color: black;
  background-color: rgba(255, 255, 255, 0.5);
  font-weight: bold;
}

@media screen and(min-width: 600px) and (max-width: 959px) {
  .secondPart {
    width: 100%;
  }

  .logo {
    max-width: 260px;
    margin: 0 auto;
  }
}

/* Mobile */
@media screen and (min-width: 458px) and (max-width: 599px) {
  .title {
    display: none;
  }
  .logo{
    margin: 7rem auto;
    align-self: start;
  }
}

@media screen and(max-width: 459px) {
  .title {
    display: none;
  }
  .logo{
    margin: 7rem auto;
    align-self: start;
  }
}
</style>
