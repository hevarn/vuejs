<template lang="pug">
div
  v-row(class="elevation-5 ma-0" align="center")
    v-col.text-center.text-md-left.col-12.col-xs-12.col-sm-8.offset-sm-2.col-md-4.offset-md-2
      h2(:style="fontSize.title") Un modèle clé-en-main qui s'adresse aux acteurs de la transition écologique
      img.logo_header(src="/traitperma.png" width="100%")
    v-col.col-12.col-xs-12.col-sm-12.col-md-4.offset-md-1.mt-4.mb-2.px-4(align-self="center")
      span(style="color:#aecd6b;line-height: 1" :style="fontSize.wordSize") Notre vocation :
      span(:style="fontSize.wordSizeContent")
        |  Valoriser les espaces urbains libres (espaces verts, esplanades, toits),
        | et les rendre productifs de nourriture
        | saine tout en créant du bien-être et du lien social.
      v-col.text-center.text-sm-right.col-md-12.ml-md-5(align="end")
        v-btn(color='secondary' :style="fontSize.firstButton" to='/contact') Être rappelé
  VisitCarousel.mt-10.mb-10
  v-container(fluid)
    div(v-for="(card, index) in content" :key="index")
      VisitCard(:card="card" :reverseStyle="indicatorRow(index)")
  v-container(fluid)
    v-card.my-10.py-8(class="elevation-24")
      p.text-center(:style="fontSize.postFooterP" style="color:#316827;line-height: 1.1") Mettez de la culture et du sens au coeur de votre projet
      v-card-actions(style="justify-content:space-around")
        v-btn(color='primary' :style="fontSize.postFooterButton" to='/contact') Être rappelé
</template>

<script>
export default {
  data () {
    return {
      content: [
        {
          image: '/ServicePartOne.png',
          title: 'Co-Conception',
          content: `Que vous soyez une entreprise à la recherche d'une RSE durable, un employeur sensible au bien-être de ses
                    collaborateurs, ou un acteur de l'aménagement urbain (collectivité, bailleur, promoteur) avec la volonté
                    de revitaliser les villes ; nous étudions votre contexte en intégrant les parties prenantes. Nous créons
                    des lieux productifs et multi-fonctionnels autour des <span class="wordSelect">Modul'Kanop</span>.`,
          logo: '/traitperma.png'
        },
        {
          image: '/ServicePartTwo.jpg',
          title: 'Entretien et culture',
          content: `Un <span class="wordSelect">Kanopée Kulteur</span> vient s’occuper de votre site. Il devient responsable des
                    cultures, de l’entretien de l’espace, et anime également votre communauté autour des ateliers «Rencontres Durables».
                    C’est lui encore qui s’occupe de la distribution hebdomadaire des paniers de fruits et légumes.`,
          logo: '/traitperma.png'
        },
        {
          image: '/ServicePartThree.jpg',
          title: 'Agriculture en ville',
          content: `Les espaces comestibles installés sont imaginés pour vivre et évoluer avec les saisons. Nous veillons à adapter le nombre
                    de passages à la saisonnalité et ainsi de profiter de cet extérieur le plus longtemps possible. Agriculture en ville,
                    mais agriculture quand même. Chez <span class="wordSelect">Kanopée Koncept</span>, nous cultivons le vivant. Cette compétence
                    nécessite un savoir-faire et un savoir-être. Pour cette raison, les Kanopée-Kulteurs et les Kanopée-Kultrices sont issus de
                    formations agricoles et maraîchères.`,
          logo: '/traitperma.png'
        }
      ]
    }
  },
  computed: {
    fontSize () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.title = '27px'
          result.wordSizeContent = '18px'
          result.wordSize = '32px'
          result.firstButton = '16px'
          result.postFooterP = '34px'
          result.postFooterButton = '16px'
          break
        case 'sm':
          result.title = '32px'
          result.wordSizeContent = '22px'
          result.wordSize = '34px'
          result.firstButton = '16px'
          result.postFooterP = '34px'
          result.postFooterButton = '18px'
          break
        case 'md':
          result.title = '24px'
          result.wordSizeContent = '16px'
          result.wordSize = '24px'
          result.firstButton = '12px'
          result.postFooterP = '30px'
          result.postFooterButton = '16px'
          break
        case 'lg':
          result.title = '24px'
          result.wordSizeContent = '16px'
          result.wordSize = '24px'
          result.firstButton = '12px'
          result.postFooterP = '30px'
          result.postFooterButton = '16px'
          break
        case 'xl':
          result.title = '32px'
          result.wordSizeContent = '22px'
          result.wordSize = '32px'
          result.firstButton = '18px'
          result.postFooterP = '32px'
          result.postFooterButton = '18px'
          break
        default:
          result.title = '24px'
          result.wordSizeContent = '16px'
          result.wordSize = '24px'
          result.firstButton = '12px'
          result.postFooterP = '16px'
          result.postFooterButton = '16px'
          break
      }
      return {
        title: `font-size: ${result.title}`,
        wordSizeContent: `font-size: ${result.wordSizeContent}`,
        wordSize: `font-size: ${result.wordSize}`,
        firstButton: `font-size: ${result.firstButton}`,
        postFooterP: `font-size: ${result.postFooterP}`,
        postFooterButton: `font-size: ${result.postFooterButton}`
      }
    }
  },
  methods: {
    indicatorRow (id) {
      let row
      if (id % 2) {
        row = 'row-reverse'
      } else {
        row = 'row'
      }
      return {
        'flex-direction': `${row}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.logo_header {
  position: relative;
  margin-top: -25px;
  padding-bottom: 10px;
}
</style>
