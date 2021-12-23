<template>
  <template  v-if="errors.length">
    <ul class="m-1">
      <li v-for="message in errors" :key="message" class="error">{{ message }}</li>
    </ul>
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
}
</style>