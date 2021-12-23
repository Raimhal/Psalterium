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
import {mapState} from "vuex";

export default {
  name: "StoreBooksPage",
  components: {
    CustomBooksPage
  },
  computed: {
    ...mapState({
      isAuth: state => state.isAuth,
      isAdmin: state => state.isAdmin,
    })
  }
}
</script>

<style scoped>
</style>