<template lang="pug">
div
  h1(class='accent--text' :style="fontSize.title" align="center") Nos réalisations
  p.px-1(:style="fontSize.paragraph" align="center")
    | Nous exploitons des espaces cultivés pensés pour le bien-être et d’échange,
    | pour se reconnecter aux saisons, esthétiques, parfois productif, toujours pédagogique
  carousel-3d(
    :controls-visible="true"
    :controls-prev-html="'&#10092;'"
    :controls-next-html="'&#10093;'"
    width=400
    height=220
    disable3d=true
    :space="600"
    :display="3"
    :style="fontSize.paragraph"
  )
    slide(v-for="(slide,i) in slides" :index="i" :key="i")
      figure
        img(:src="slide.image" :lazy-src="slide.image")
        figcaption {{ slide.texts }}
</template>
<script>
import { Carousel3d, Slide } from 'vue-carousel-3d'

export default {
  components: {
    Carousel3d,
    Slide
  },
  data () {
    return {
      slides: [
        {
          image: 'Carousel1.jpg',
          texts: 'Ateliers à Ladéra'
        },
        {
          image: 'Carousel2.jpg',
          texts: 'Modul’Kanop sur mesure en terrasse'
        },
        {
          image: 'Carousel3.jpg',
          texts: 'Modul’Kanop Pergola – 10/2019'
        },
        {
          image: 'Carousel4.jpg',
          texts: 'Modul’Kanop Pergola – 10/2019'
        },
        {
          image: 'Carousel5.png',
          texts: 'Serre productive Ladéra – 01/2020'
        }
      ]
    }
  },
  computed: {
    fontSize () {
      const result = {}
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          result.title = '34px'
          result.paragraph = '18px'
          break
        case 'sm':
          result.title = '34px'
          result.paragraph = '18px'
          break
        case 'md':
          result.title = '24px'
          result.paragraph = '12px'
          break
        case 'lg':
          result.title = '26px'
          result.paragraph = '16px'
          break
        case 'xl':
          result.title = '26px'
          result.paragraph = '16px'
          break
        default:
          result.title = '24px'
          result.paragraph = '12px'
          break
      }
      return {
        title: `font-size: ${result.title}`,
        paragraph: `font-size: ${result.paragraph}`
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.carousel-3d-container figure {
  margin: 0;
  margin-right: -5px;
}

.carousel-3d-container figcaption {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  bottom: 0;
  padding: 10px;
  min-width: 100%;
  box-sizing: border-box;
  text-align: center;
}
</style>
