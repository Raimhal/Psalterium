<template>
  <div v-if="books.length > 0">
    <div class="books">
      <transition-group name="list">
        <book-item
            v-for="book in books"
            :key="book.id"
            :book="book"
            :is-creator="isCreator"
            class="mb-3 m-2 text-center"
            @remove="$emit('remove', book.id)"
        />
      </transition-group>
    </div>
  </div>
  <empty-list v-else>No books</empty-list>
</template>

<script>
import BookItem from "./BookItem";

export default {
  name: "BookList",
  components: {BookItem},
  props: {
    books: {
      type: Array,
      required: true
    },
    isCreator: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style scoped>
.books{
  padding: 15px;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: stretch;
}

@media screen and (max-width: 500px) {
  .books{
    padding: 15px 0 !important;
  }
}
</style>


