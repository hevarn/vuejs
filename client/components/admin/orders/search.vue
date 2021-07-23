<template lang="pug">
v-col(align='center')
  v-text-field(
    prepend-icon='$mdi-magnify',
    label='Rechercher',
    v-model='searchValue',
    @input='$emit("onSearch", searchValue)'
  )
</template>

<script>
export default {
  data: () => ({
    searchValue: ''
  })
}
</script>
