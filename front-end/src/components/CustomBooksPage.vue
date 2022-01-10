<template>
  <div>
    <my-title><slot name="title"></slot></my-title>
    <div class="app__btns d-flex flex-wrap">
      <div class="sort">
        <my-select
            :model-value="selectedSort"
            @update:model-value="setSelectedSort"
            :options="sortOptions"
            @change="getBookList(owner)"
        />
        <my-select
            :model-value="selectedGenre"
            @update:model-value="setSelectedGenresSort"
            :options="genresOptions"
            @change="getBookList(owner)"
        />
        <div class="d-flex align-content-center justify-content-center">
          <input type="checkbox" id="switch" v-model="reverseSort.value" :value="reverseSort.value" @change="reverseBooks" />
          <label for="switch"></label>
        </div>
      </div>
      <slot name="create"></slot>
    </div>
    <book-list
        :books="sortedBooks"
        v-if="!isLoading"
        :is-creator="owner"
        @remove="removeBook"
    />
    <div v-else class="spinner-grow">
    </div>
    <div
        v-intersection:[owner]="getBookList"
        class="observer"
    >
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import BookList from "./BookList";
export default {
  name: "BooksPage",
  components: {
    BookList,
  },
  props: {
    owner: {
      type: Boolean,
      default: false
    }
  },
  beforeMount() {
    this.getAllGenres()
  },
  beforeUnmount() {
    this.clearBookStore()
  },
  methods: {
    ...mapMutations({
      setSearchQuery: 'book/setSearchQuery',
      setSelectedSort: 'book/setSelectedSort',
      setSelectedGenresSort: 'genre/setSelectedSort',
      clearBookStore: 'book/clearBookStore',
      clearErrors: 'clearErrors',
      setReverseSort: 'book/setReverseSort',
      clearBooks: 'book/clearBooks',
    }),
    ...mapActions({
      getBookList: 'book/getSortedBookList',
      getAllGenres: 'genre/getAllGenres',
      removeBook: 'book/removeBook'
    }),
    reverseBooks(){
      this.clearBooks()
      this.getBookList()
    }
  },
  computed: {
    ...mapState({
      isAuth: state => state.isAuth,
      books: state => state.book.books,
      isLoading: state => state.book.isLoading,
      selectedSort: state => state.book.selectedSort,
      selectedGenre: state => state.genre.selectedSort,
      searchQuery: state => state.book.searchQuery,
      sortOptions: state => state.book.sortOptions,
      genresOptions: state => state.genre.sortOptions,
      reverseSort: state => state.book.reverseSort
    }),
    ...mapGetters({
      sortedBooks: 'book/sortedBooks',
    }),
  },
}
</script>

<style scoped>

input[type=checkbox]{
  height: 0;
  width: 0;
  visibility: hidden;
}

label {
  cursor: pointer;

  width: 40px;
  height: 20px;
  background: rgba(149, 149, 149, 0.34);
  display: block;
  border-radius: 100px;
  position: relative;
}
label:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 90px;
  transition: 0.3s;
}

input:checked + label {
  background: #7072F7;
}

input:checked + label:after {
  left: 100%;
  transform: translateX(-100%);
}

label:active:after {
  width: 70%;
}

.sort{
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

@media screen and (max-width: 450px){
  .sort{
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .sort>*{
    width: inherit;
  }
  .app__btns>button{
    width: 100%;
  }


}

</style>