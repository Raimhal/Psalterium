<template>
  <div>
    <custom-books-page :owner="true">
      <template v-slot:title>
        <img src="@/assets/book_negate.png" height="32" width="32" class="mb-2"/>
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
import {mapState} from "vuex";

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
  beforeRouteEnter(to, from, next){
   next(vm => {
     if(!vm.isAuth) {
       vm.errors.push('You are not authorized')
       vm.$router.push('/login')
     }
   })
  },
  methods: {
    async showDialog() {
      this.dialogVisible = true
    },
  },
  computed: {
    ...mapState({
      isAuth: state => state.isAuth,
      isAdmin: state => state.isAdmin,
      errors: state => state.errors
    })
  }
}
</script>

<style scoped>
</style>