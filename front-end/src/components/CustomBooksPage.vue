<template>
  <div>
    <my-title><slot name="title"></slot></my-title>
    <div class="app__btns">
      <my-select
          :model-value="selectedSort"
          @update:model-value="setSelectedSort"
          :options="sortOptions"
      />
    </div>
    <book-list
        :books="sortedBooks"
        v-if="!isLoading"
        @remove="removeBook"
    />
    <div v-else class="center">
      Loading...
    </div>
    <div
        v-intersection="getBookList"
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
  mounted() {
    if(!this.isAuth)
      this.$router.push('/login')
  },
  beforeUnmount() {
    this.clearBookStore()
    this.clearErrors()
  },
  methods: {
    ...mapMutations({
      setSearchQuery: 'book/setSearchQuery',
      setSelectedSort: 'book/setSelectedSort',
      clearBookStore: 'book/clearBookStore',
      clearErrors: 'clearErrors'
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
      sortOptions: state => state.book.sortOptions
    }),
    ...mapGetters({
      sortedBooks: 'book/sortedBooks',
    }),
  },
}
</script>

<style scoped>
.__creation{
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}
</style>