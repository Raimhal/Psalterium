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
  <div  v-else class="empty__list">
    <img src="@/assets/wrong_negate.png" height="128" width="128"/>
    <h4>
      No books
    </h4>
  </div>
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

.empty__list{
  min-height: 60vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>


