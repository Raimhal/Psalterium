<template>
  <div>
    <table class="genre__table">
      <caption>Genres : </caption>
      <thead>
      <tr>
        <th>Name</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <transition-group name="list">
        <tr v-for="genre in genres" :key="genre.id">
          <td>{{genre.name}}</td>
          <td>
            <div class="d-flex  justify-content-center gap-3">
              <my-button @click="showGenreUpdateDialog(genre)">Edit</my-button>
              <my-button @click.once="removeGenre(genre.id)"> Delete </my-button>
            </div>
          </td>
        </tr>
      </transition-group>
      <tr>
        <td>
          <div
              v-intersection="getGenres"
              class="observer"
          >
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <my-dialog v-model:show="genreUpdateDialogVisible">
      <create-genre-form :modified="true">
        <template v-slot:submit__name>
          Save
        </template>
      </create-genre-form>
    </my-dialog>
  </div>

</template>

<script>

import {mapActions, mapState} from "vuex";
import MyButton from "./UI/MyButton";
import CreateGenreForm from "./CreateGenreForm";
import MyDialog from "./UI/MyDialog";

export default {
  name: "GenreList",
  components: {CreateGenreForm, MyButton, MyDialog},
  data(){
    return{
      genreUpdateDialogVisible: false
    }
  },
  computed:{
    ...mapState({
      user: state => state.user.user,
      genres: state => state.genre.genres
    }),
  },
  methods: {
    ...mapActions({
      removeGenre: 'genre/removeGenre',
      getGenres: 'genre/getGenres'
    }),
    showGenreUpdateDialog(genre){
      this.genreUpdateDialogVisible = true
      this.$store.commit('genre/setGenre', genre)
    }

  },
}
</script>

<style scoped>
caption {
  background: rgba(56, 58, 73, 0.9);
  color: azure;
  padding: 10px;
  text-align: left;
  font-size: 20px;
  caption-side: top;
}
th {
  border-bottom: 3px solid rgba(56, 58, 73, 0.9);
  padding: 10px;
  text-align: left;
}
td {
  padding: 10px;
}
tr{
  min-width: 100%;
}
tr:nth-child(odd) {
  background: rgba(72, 86, 95, 0.2);
}
tr:nth-child(even) {
  background-color: rgba(56, 58, 73, 0.9);
}

tbody{
  display: block;
  overflow-y: auto;
  max-height: 500px;
}

table thead, table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}


</style>