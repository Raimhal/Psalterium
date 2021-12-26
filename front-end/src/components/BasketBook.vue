<template>
  <div :key="order.id" class="d-flex justify-content-between">
      <div class="d-flex">
        <img class="image" v-image-observer:[order.image]="getImage" alt="Card image cap">
        <div class="short__info p-2">
          <h5 class="title">{{cutText(order.name)}}</h5>
          <p>{{cutText(order.author)}}</p>
          <p>${{order.price}}</p>
          <p>Count : {{order.order_count}}</p>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <div class="d-flex flex-column text-center price p-2 gap-2">
          <span>${{order.price * order.order_count}}</span>
          <my-button class="h-25" @click="removeBook(order.id)">Remove</my-button>
        </div>
      </div>

  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import MyButton from "./UI/MyButton";

export default {
  name: "BasketBook",
  components: {MyButton},
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  beforeMount() {
    console.log(this.order)
  },
  data(){
    return {
      basketBook: this.book
    }
  },
  computed: {
    ...mapState({
      book: state => state.book.book
    })
  },
  methods: {
    ...mapActions({
      getBook: 'book/getBook',
      getImage: 'book/getBookImage',
      removeBook: 'basket/removeFromBasket'
    }),
    cutText(text){
      if(text.length > 30)
        return text.slice(0, 30) + '...'
      return text
    },
  }
}
</script>

<style scoped>
.image{
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.short__info{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.title{
  text-align: justify;
  word-break: break-word;
}

div.price{
  background-color: rgba(112, 114, 247, 0.2);
  border-radius: 5px;
  border: solid 2px rgba(112, 114, 247, 0.4);
}
</style>