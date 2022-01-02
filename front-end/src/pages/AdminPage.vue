<template>
  <div class="d-flex flex-column gap-5 m-auto">
    <div>
      <user-list>
      </user-list>
    </div>
    <div class="d-flex justify-content-center">
      <genre-list>
      </genre-list>
    </div>
    <div class="btns d-flex justify-content-between">
      <my-button @click="$router.back()"> Back </my-button>
      <my-button @click="showGenreDialog"> Add genre </my-button>
    </div>
    <my-dialog v-model:show="genreDialogVisible">
      <create-genre-form>
        <template v-slot:submit__name>
          Add
        </template>
      </create-genre-form>
    </my-dialog>
  </div>
</template>
<script>
import UserList from "../components/UserList";
import {mapActions, mapMutations, mapState} from "vuex";
import GenreList from "@/components/GenreList";
import CreateGenreForm from "../components/CreateGenreForm";

export default {
  name: "AdminPage",
  components: {CreateGenreForm, GenreList, UserList},
  data(){
    return{
      genreDialogVisible: false,
    }
  },
  beforeRouteEnter(to, from, next){
    next(vm => {
      if(!(vm.isAdmin && vm.isAuth)){
        vm.$store.state.errors.push('You are not an admin')
        vm.$router.push('/login')
      }
    })
  },
  beforeUnmount() {
    this.clearUsers()
    this.clearGenres()
  },
  methods: {
    ...mapMutations({
      clearErrors: 'clearErrors',
      clearGenres:'genre/clearGenreStore',
      clearUsers: 'user/clearUsers',
    }),
    showGenreDialog(){
      this.genreDialogVisible = true
    },

  },
  computed: {
    ...mapState({
      isAdmin: state => state.isAdmin,
      isAuth: state => state.isAuth,
      users: state => state.user.users,
      genres: state => state.genre.genres,
      genre: state => state.genre.genre,
    }),
  },
}
</script>

<style scoped>
</style>