<template lang="pug">
v-row
  v-chip.ma-2(
    v-for='provider in $store.state.admin.providersBG',
    :key='provider.id',
    color='primary',
    @click='$store.commit("admin/changeSelectedProvider", provider), $emit("fetch-product")',
    text-color='white'
  )
    v-avatar(left)
      v-icon {{ provider.isSite ? "$mdi-Warehouse" : "$mdi-Factory" }}
    h3 {{ provider.name }}
</template>
