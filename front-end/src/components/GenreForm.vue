<template>
  <div class="container">
    <div class="form">
      <div v-for="genre in genres" :key="genre.id" class="d-flex align-items-center inputGroup">
        <input :id="genre.id" :value="genre.name" name="genre"  v-model="genreList" type="checkbox"/>
        <label :for="genre.id">{{genre.name}}</label>
      </div>
      <div
          v-intersection="getGenres"
          class="observer"
      >
      </div>
    </div>
    <div class="d-flex flex-column">
      <div v-if="isLoading" class="spinner-grow align-self-center m-2"></div>
      <my-button v-else class="mt-3 w-100" @click="action(genreList)">Save</my-button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "GenreForm",
  mounted(){
    this.getGenres()
    this.genreList = this.book_genres.map(genre => genre.name)
  },
  data(){
    return{
      genreList: []
    }
  },
  computed: {
    ...mapState({
      genres: state => state.genre.genres,
      book_genres: state => state.book.book.genres,
      isLoading: state => state.book.isLoading
    })
  },
  methods: {
    ...mapActions({
      getGenres: 'genre/getGenres',
      changeGenres: 'book/changeGenres'
    }),
    async action(list){
      const dialog = document.querySelector('.dialog')
      await this.changeGenres(list)
      this.$swal({
        html: "<span style='color: #ffffff'>The genres have been successfully changed</span>",
        title: '<span style=\'color: #ffffff\'>Success</span>',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000
      })
      dialog.click()
    }

  }


}
</script>

<style scoped>
.inputGroup {
  background-color: #fff;
  margin: 3px 0;
  position: relative;
  padding: 0;
}

label {
  padding: 12px 30px;
  width: 50vw;
  min-width: 320px;
  text-align: left;
  color: #3C454C;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: color 200ms ease-in;
  overflow: hidden;
}

label:after {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  content: '';
  background-color: #7072F7;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale3d(1, 1, 1);
  transition: all 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
  opacity: 0;
  z-index: -1;
}

label:before {
  width: 32px;
  height: 32px;
  content: '';
  background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.414 11L4 12.414l5.414 5.414L20.828 6.414 19.414 5l-10 10z' fill='%23fff' fill-rule='nonzero'/%3E%3C/svg%3E ");
  background-repeat: no-repeat;
  background-position: 4px 5px;
  border-radius: 50%;
  z-index: 2;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: all 200ms ease-in;
}


input:checked ~ label {
  color: #fff;
  /*width: 100%;*/
}
input:checked ~ label:after {
  transform: translate(-50%, -50%) scale3d(56, 56, 1);
  opacity: 1;
}

input:checked ~ label:before {
  background-color: #54E0C7;
  border: none;
}

input {
  width: 0;
  height: 0;
  order: 1;
  z-index: 2;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  visibility: hidden;
}
.form {
  max-width: 550px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 500px;

}

code {
  background-color: #9AA3AC;
  padding: 0 8px;
}

.container{
  min-width: max-content;
}

@media screen and (max-width: 750px){
  label{
    width: 90vw;
  }
}

</style>