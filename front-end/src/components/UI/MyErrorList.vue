<template>
  <template  v-if="errors.length">
      <li v-for="message in errors" :key="message" class="error">{{ message }}</li>
  </template>
</template>

<script>

export default {
  name: "MyErrorList",
  props: {
    errors: {
      type: Array,
      required: true
    }
  },
}
</script>

<style scoped>
li {
  list-style-type: none;
  overflow-wrap: break-word;
}
</style>