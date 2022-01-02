<template>
  <div :key="order.id" class="d-flex justify-content-between item">
    <div>
      <img class="image" v-image-observer:[order.image]="getImage" alt="Card image cap">
    </div>
    <div class="short__info p-2">
      <h5 class="title">{{order.name}}</h5>
      <p>{{order.author}}</p>
      <p>${{order.price}}</p>
      <p>Count : {{order.order_count}}</p>
    </div>
    <div class="d-flex align-items-center">
      <div class="d-flex flex-column text-center price p-2 gap-2">
        <span>${{ Number(order.price * order.order_count).toFixed(2)}}</span>
        <my-button class="h-25" @click.once="removeBook({id: order.id, count: order.order_count})">Remove</my-button>
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
  margin-right: auto;
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

@media screen and (max-width: 1400px){
  .item{
    flex-direction: column;
    font-size: 1rem;
  }
  .item>div:first-child{
    display: flex;
    justify-content: center;
  }
  .price{
    width: 100%;
  }

}
</style>