export default ({ $fb, app }) => {
  app.router.afterEach(() => {
    /**
         * Automatically track PageView
         */
    if ($fb) {
      $fb.track('PageView')
    }
  })
}
