<template>
  <div>
    <my-title><slot name="title"></slot></my-title>
    <div class="app__btns">
      <slot name="create"></slot>
      <div class="d-flex gap-2 align-items-center">
        <my-select
            :model-value="selectedSort"
            @update:model-value="setSelectedSort"
            :options="sortOptions"
        />
        <input type="checkbox" id="switch" v-model="reverseSort.value"/>
        <label for="switch"></label>
      </div>
    </div>
    <book-list
        :books="sortedBooks"
        v-if="!isLoading"
        :is-creator="owner"
        @remove="removeBook"
    />
    <div v-else class="spinner-border">
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
  beforeUnmount() {
    this.clearBookStore()
  },
  methods: {
    ...mapMutations({
      setSearchQuery: 'book/setSearchQuery',
      setSelectedSort: 'book/setSelectedSort',
      clearBookStore: 'book/clearBookStore',
      clearErrors: 'clearErrors',
      setReverseSort: 'book/setReverseSort'
    }),
    ...mapActions({
      getBookList: 'book/getBookList',
      removeBook: 'book/removeBook'
    }),

  },
  computed: {
    ...mapState({
      isAuth: state => state.isAuth,
      books: state => state.book.books,
      isLoading: state => state.book.isLoading,
      selectedSort: state => state.book.selectedSort,
      searchQuery: state => state.book.searchQuery,
      sortOptions: state => state.book.sortOptions,
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

</style>