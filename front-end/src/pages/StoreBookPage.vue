<template>
  <div class="item text-break" :key="book.id" >
    <header class="mb-3 d-flex justify-content-evenly">
      <img class="image" v-image-observer:[book.image]="getImage" :key="book.id" alt="Card image cap" @click="$router.push(`/books/${book.id}`)">
      <div class="p-4 short__info">
        <h5>{{book.name}}</h5>
        <p>Author : {{book.author}}</p>
        <p>Price : ${{book.price}}</p>
        <form @submit.prevent="action" method="post" class="order__form" v-if="book.count > 0">
          <my-input class="order" v-model="order.count" type="number" id="count"/>
          <my-button class="order" type="submit">Add to card</my-button>
        </form>
        <p v-else class="error">Not available</p>
      </div>
    </header>
    <div>
      <p>Publication : {{ new Date(book.publication_date).toLocaleDateString()}}</p>
      <p>Last update date : {{new Date(book.update_date).toLocaleDateString()}}</p>
      <p id="ISBN">ISBN : #{{book.ISBN}}</p>
      <div v-if="book.genres.length > 0">
        Genres :
        <p v-for="genre in book.genres" :key="genre.name">{{genre.name}}</p>
      </div>
      <div v-if="book.content.length > 0" class="mt-3">
        <p class="align-self-center text-center">Plot</p>
        <p>{{book.content}}</p>
      </div>
    </div>
    <div class="d-flex justify-content-between mt-3">
      <my-button @click="$router.back()">Back</my-button>
      <div class="d-flex gap-3">
        <my-button @click="showBookUpdateDialog">Update</my-button>
        <my-button>Change image</my-button>
      </div>
    </div>
    <my-dialog v-model:show="updateBookDialogVisible">
      <book-form :modified="true">
        <template v-slot:submit__name>
          Save
        </template>
      </book-form>
    </my-dialog>
  </div>
</template>

<script>
import BookItem from "@/components/BookItem";
import {mapActions, mapMutations, mapState} from "vuex";
import BookForm from "@/components/BookForm";
export default {
  name: "StoreBookPage",
  components: {BookForm, BookItem},
  async beforeMount() {
    await this.getBook(this.$router.currentRoute.value.params.id).then(() => {
      if (this.book.count > 0)
        this.setBookLimits()
    })
  },
  data(){
    return{
      updateBookDialogVisible: false
    }
  },
  computed: {
    ...mapState({
      isAuth: state => state.isAuth,
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
      addToBasket: 'book/addToBasket'
    }),
    ...mapMutations({
      clearBook: 'book/clearBook'
    }),
    async action(){
      if(!this.isAuth)
        this.$router.push('/login')
      else {
        await this.addToBasket()
        if(this.book.count > 0)
          this.setBookLimits()
      }
    },
    async showBookUpdateDialog(){
      this.updateBookDialogVisible = true
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