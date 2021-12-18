<template>
  <div v-if="books.length > 0">
    <div class="books">
      <transition-group name="book-list">
        <book-item
            v-for="book in books"
            :key="book.id"
            :book="book"
            class="m-2"
            @remove="$emit('remove', book.id)"
        />
      </transition-group>
    </div>
  </div>
  <div  v-else class="empty__list">
    <h3 style="color: rgba(109, 165, 252, 0.9)">
      List is empty
    </h3>
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-list-item{
  display: inline-block;
  margin-right: 10px;
}
.book-list-enter-active,
.book-list-leave-active{
  transition: all 0.7s ease;
}

.book-list-enter-from,
.book-list-leave-to{
  opacity: 0;
  transform: translateX(130px);
}

.book-list-move{
  transition: transform 0.4s ease;
}
</style>


