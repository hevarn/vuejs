<template lang="pug">
  v-snackbar(
    v-model='$store.state.notif.snackbar'
    :color='$store.state.notif.type'
    timeout='6000'
  ) {{ $store.state.notif.notification }}
    template(v-slot:action="{ attrs }")
      v-btn(dark text @click="$store.commit('notif/closeNotif')" v-bind="attrs") Fermer
</template>
