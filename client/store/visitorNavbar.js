export const state = () => ({
  boutonClicked: false
})

export const mutations = {
  clickBouton (state) {
    state.boutonClicked = !state.boutonClicked
  },
  clickButton (state) {
    state.boutonClicked = true
  },
  clickButtonFalse (state) {
    state.boutonClicked = false
  }
}
