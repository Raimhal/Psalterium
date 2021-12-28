<template>
  <div>
    <custom-books-page>
      <template v-slot:title>
        <img src="@/assets/shop_negate.png" height="32" width="32" class="mb-2"/>
        Shop
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