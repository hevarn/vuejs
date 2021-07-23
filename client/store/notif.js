export const state = () => ({
  snackbar: false,
  notification: '',
  type: 'green'
})

export const mutations = {
  sendInfo (state, message) {
    state.notification = message
    state.type = 'blue'
    state.snackbar = true
  },
  sendSuccess (state, message) {
    state.notification = message
    state.type = 'green'
    state.snackbar = true
  },
  sendAlert (state, message) {
    state.notification = message || 'Une erreur est survenue.'
    state.type = 'red'
    state.snackbar = true
  },
  closeNotif (state) {
    state.snackbar = !state.snackbar
  }
}
