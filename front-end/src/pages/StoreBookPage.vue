<template>
  <div class="item">
    <header class="mb-3 d-flex justify-content-evenly">
      <img class="image" v-image-observer:[book.image]="getImage" :key="book.id" alt="Card image cap" @click="$router.push(`/books/${book.id}`)">
      <div class="p-4 short__info">
        <h5>{{book.name}}</h5>
        <p>Author : {{book.author}}</p>
        <p>Price : {{book.price}}</p>
        <form @submit.prevent="action" method="post" class="order__form" v-if="book.count > 0">
          <my-input class="order" v-model="order.count" type="number" id="count"/>
          <my-button class="order" type="submit">Buy</my-button>
        </form>
        <p v-else>not available</p>
      </div>
    </header>
    <div>
      <p>Publication : {{new Date(book.publication_date).toLocaleDateString()}}</p>
      <p>Last update date : {{new Date(book.update_date).toLocaleDateString()}}</p>
      <p id="ISBN">ISBN : #{{book.ISBN}}</p>
      <div>
        <p v-for="genre in book.genres" :key="genre.name">{{genre.name}}</p>
      </div>
      <p>{{book.content}}</p>
    </div>
  </div>
</template>

<script>
import BookItem from "@/components/BookItem";
import {mapActions, mapMutations, mapState} from "vuex";
export default {
  name: "StoreBookPage",
  components: {BookItem},
  async mounted() {
    const id = this.$router.currentRoute.value.params.id
    await this.getBook(id)
    if(this.book.count > 0)
      this.setBookLimits()
  },
  computed: {
    ...mapState({
      book: state => state.book.book,
      order: state => state.book.order,
      errors: state => state.errors
    }),
  },
  async beforeUnmount() {
    await this.clearBook()
  },
  methods: {
    ...mapActions({
      getBook: 'book/getBook',
      getImage: 'book/getBookImage',
    }),
    ...mapMutations({
      clearBook: 'book/clearBook'
    }),
    action(){
      console.log('buy')
    },
    setBookLimits(){
      const order_count = document.querySelector('#count')
      console.log(order_count)
      order_count.setAttribute('min', 1)
      order_count.setAttribute('max', this.book.count)
    }
  }
}
</script>

<style scoped>
.item{
  background-color: inherit;
  border:none;
  width: 50vw;
  min-height: 90vh;
  margin: auto;
}
.image{
  width: 25vw;
  height: 400px;
  border-radius: 15px;
}
header{
  display: grid;
  grid-template-columns: 25vw 1fr;
}
p{
  margin: 0;
  line-height: 27px;
}

.order{
  width: 100%;
}

.order__form{
  min-width: 60%;
  position: absolute;
  bottom: 0;
}

.short__info{
  position:relative;
}
</style>