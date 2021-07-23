<template lang="pug">
  v-container(fill-height).mt-8
    v-row
      v-col.col-6.col-md-4(align="center" align-self="center")
        h1 Vérification du mail en cours
      v-col.col-6.col-md-2(align="center" align-self="center")
        v-progress-circular(
          :rotate="-90"
          :size="70"
          :width="10"
          indeterminate
          color="primary"
        )
      v-col.col-12.col-md-6(align="center" align-self="center")
        v-img(src='/growingTree.png')
</template>
<script>
import { authManagementService } from '@/api'

export default {
  layout: 'visitor',
  mounted () {
    this.fetchUserVerify()
  },
  methods: {
    // Match verifyToken
    async fetchUserVerify () {
      try {
        await authManagementService.create({
          action: 'verifySignupLong',
          value: this.$route.query.token
        })
        this.$router.push('/login')
      } catch (e) {
        this.$store.commit('notif/sendAlert', 'Le lien a expiré ou vous avez déjà validé votre adresse e-mail.')
      }
    }
  }
}
</script>
