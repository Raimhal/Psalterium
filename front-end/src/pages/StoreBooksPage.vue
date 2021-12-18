<template>
  <div>
    <custom-books-page>
      <template v-slot:title>
        Books
      </template>
    </custom-books-page>
  </div>
</template>

<script>
import CustomBooksPage from "@/components/CustomBooksPage";

export default {
  name: "StoreBooksPage",
  components: {
    CustomBooksPage
  },
}
</script>

<style scoped>
</style>