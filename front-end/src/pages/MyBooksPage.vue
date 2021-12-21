<template>
  <div>
    <custom-books-page :owner="true">
      <template v-slot:title>
        Your Books
      </template>
      <template v-slot:create>
        <my-button @click="showDialog"> Add book </my-button>
        <my-dialog v-model:show="dialogVisible">
          <book-form>
            <template v-slot:submit__name>
              Add
            </template>
          </book-form>
        </my-dialog>
      </template>
    </custom-books-page>
  </div>
</template>

<script>
import CustomBooksPage from "@/components/CustomBooksPage";
import BookForm from "@/components/BookForm";

export default {
  name: "StoreBooksPage",
  components: {
    BookForm,
    CustomBooksPage
  },
  data(){
    return{
      dialogVisible: false
    }
  },
  methods: {
    async showDialog() {
      this.dialogVisible = true
    },
  },
}
</script>

<style scoped>
</style>