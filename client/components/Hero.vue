<template>
  <div class="heroBlock">
    <v-carousel cycle hide-delimiter-background show-arrows-on-hover>
      <template #prev="{ on, attrs }">
        <v-btn color="success" v-bind="attrs" v-on="on">
          Previous slide
        </v-btn>
      </template>
      <template #next="{ on, attrs }">
        <v-btn color="info" v-bind="attrs" v-on="on">
          Next slide
        </v-btn>
      </template>
      <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" />
    </v-carousel>
  </div>
</template>

<script>
export default {
  name: 'Hero',
  data () {
    return {
      items: [
        {
          src: require('../assets/images/index-slide02.jpg')
        },
        {
          src: require('../assets/images/index-slide03.jpg')
        },
        {
          src: require('../assets/images/index-slide04.jpg')
        }
      ]
    }
  }
}
</script>
