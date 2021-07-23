<template lang="pug">
div
  v-row(class="elevation-5 ma-0" align="center")
    v-col.text-center.text-md-left.col-12.col-xs-12.col-sm-8.offset-sm-2.col-md-3.offset-md-2
      h2(:style="fontSize.title") Permaculture urbaine
      img.logo_header(src="/traitperma.png" width="100%")
    v-col.sizeContent.col-12.col-xs-12.col-sm-12.col-md-4.offset-md-2.mt-4.mb-4.px-3(align-self="center")
      span(style="color:#aecd6b;line-height: initial" :style="fontSize.wordSize") Notre vocation :
      span(:style="fontSize.wordSizeContent")
        |  Valoriser les espaces urbains libres (espaces verts, esplanades, toits),
        | et les rendre productifs de nourriture
        | saine tout en créant du bien-être et du lien social.
  v-container(fluid)
    div(v-for="(card, index) in content" :key="index")
      card(:card="card" :reverseStyle="indicatorRow(index)")
  v-container(fluid)
    v-card.my-10.py-8(class="elevation-24")
      p.text-center(:style="fontSize.postFooterP" style="color:#316827;line-height: 1.1") Consommons local et bio et  recréons du lien dans nos villes !
      v-card-actions(style="justify-content:space-around")
        v-btn(color='primary' :style="fontSize.postFooterButton" @click="getButtonPath()") C'est parti !
</template>

<script>
import card from '@/components/visitor/card/card'

export default {
  components: {
    card
  },
  data () {
    return {
      slides: 5,
      active: 1,
      content: [
        {
          image: '/KonceptPartOne.jpg',
          title: 'Des paniers de fruits et légumes 0 kilomètre ou bio',
          content: `Nos systèmes de culture sont adaptés à l'environnement urbain, et permettent une production de fruits
                    et légumes sains et de saison. <span class="wordSelect">Faîtes votre marché</span>
                    et venez récupérer votre commande toutes les semaines sur votre site de culture.`,
          logo: './traitperma.png',
          link: 'Faire son marché'
        },
        {
          image: '/KonceptPartTwo.jpg',
          title: 'Des ateliers pour se reconnecter ',
          content: `Chaque lieu de culture est animé et entretenu par un maraîcher : le
                    <span class="wordSelect">Kanopée Kulteur</span>. Venez participer aux «Rencontres Durables» pour apprendre
                    sur les fruits et légumes, les techniques de culture, la permaculture,
                    ou des préparations simples de vos légumes favoris !<br>
                    Nous souhaitons que chacun puisse se reconnecter à son environnement.`,
          logo: '/traitperma.png',
          link: "M'inscrire à un atelier"
        },
        {
          image: '/KonceptPartThree.png',
          title: 'Une Kommunauté locale',
          content: `Rencontrez vos voisins au moment de la collecte des paniers hebdomadaires. <br>
                    Venez vous cultiver lors des «Rencontres Durables».
                    <span class="wordSelect">Échangez</span> entre vous sur vos lieux de culture et en vous connectant à notre site.`,
          logo: '/traitperma.png',
          link: 'Je rejoins la Kommunauté'
        },
        {
          image: '/KonceptPartFour.jpg',
          title:
            'Entreprises, Promoteurs, Collectivités ? Mettez la permaculture dans vos projets !',
          content: `Créons ensemble des espaces qui font sens et proposez un service qualitatif à vos employés ou à vos résidents.
                    Nous proposons un <span class="wordSelect">service sur mesure et clé-en-main</span>, en synergie avec votre contexte,
                    depuis sa conception ; en passant par son installation et son entretien, jusqu'à l’animation de ce nouveau lieu de bien-être.`,
          logo: './traitperma.png',
          link: 'En apprendre davantage'
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
          result.postFooterP = '34px'
          result.postFooterButton = '16px'
          break
        case 'sm':
          result.title = '32px'
          result.wordSizeContent = '22px'
          result.wordSize = '34px'
          result.postFooterP = '34px'
          result.postFooterButton = '18px'
          break
        case 'md':
          result.title = '24px'
          result.wordSizeContent = '16px'
          result.wordSize = '24px'
          result.postFooterP = '30px'
          result.postFooterButton = '16px'
          break
        case 'lg':
          result.title = '24px'
          result.wordSizeContent = '16px'
          result.wordSize = '24px'
          result.postFooterP = '30px'
          result.postFooterButton = '16px'
          break
        case 'xl':
          result.title = '32px'
          result.wordSizeContent = '22px'
          result.wordSize = '32px'
          result.postFooterP = '32px'
          result.postFooterButton = '18px'
          break
        default:
          result.title = '24px'
          result.wordSizeContent = '16px'
          result.wordSize = '24px'
          result.postFooterP = '16px'
          result.postFooterButton = '16px'
          break
      }
      return {
        title: `font-size: ${result.title}`,
        wordSizeContent: `font-size: ${result.wordSizeContent}`,
        wordSize: `font-size: ${result.wordSize}`,
        postFooterP: `font-size: ${result.postFooterP}`,
        postFooterButton: `font-size: ${result.postFooterButton}`
      }
    }
  },
  mounted () {
    this.fetchUser()
  },
  methods: {
    fetchUser () {
      try {
        if (this.$store.state.auth.user.isVerified) {
          this.auth = false
        }
      } catch (e) {
        this.auth = true
      }
    },
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
    },
    getButtonPath () {
      if (!this.auth) {
        this.$router.push('/user/items')
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.logo_header {
  position: relative;
  margin-top: -25px;
  padding-bottom: 8px;
}
</style>
