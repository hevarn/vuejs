<template lang="pug">
  v-card(loading flat)
    v-img(src='/market/market_closed.png' class=' align-end justify-center')
      v-card-title.test
        slot(name="middle")
</template>

<style scoped>
.test {
  position: absolute;
  top: 35%;
  right: 40%;
}
</style>
