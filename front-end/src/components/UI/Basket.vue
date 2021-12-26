<template>
  <div @click="this.$store.commit('basket/setVisibility', false)">
    <my-dialog v-model:show="visible" >
      <div style="background-color: rgb(23, 28, 33); border-radius: 5px">
        <div class="basket">
          <div class="d-flex justify-content-between ps-3 pe-3 p-2 ">
            <h3 class="align-items-center text-center m-0 p-1">
              Basket
            </h3>
            <button @click="this.$store.commit('basket/setVisibility', false)" class="close">X</button>
          </div>
          <hr/>
          <div class="basket-body d-flex flex-column" :class="{'justify-content-center' : books.length === 0}">
            <transition-group name="list" v-if="books.length > 0">
              <basket-book v-for="book in books" :key="book.id" :order="book" class="p-2"></basket-book>
            </transition-group>
            <div v-else class="d-flex flex-column justify-content-center align-items-center">
              <img src="@/assets/bankrupt_negate.png" height="100" width="100"/>
              <span>Your basket is empty</span>
            </div>
            <div v-intersection="getBooks"></div>
          </div>
          <div v-if="books.length > 0" class="basket-btns">
            <hr/>
            <div class="d-flex justify-content-between p-3">
              <my-button @click="this.$store.commit('basket/setVisibility', false)" class="h-50 align-self-center">Back to shopping</my-button>
              <div class="d-flex align-items-center justify-content-end align-items-center gap-3 buy-btn p-2">
                <span>${{getTotalSum}}</span>
                <my-button @click="showCreateOrderDialog">Checkout</my-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <my-dialog v-model:show="createOrderDialogVisible" v-if="this.books.length > 0">
        <order-form>
          <template v-slot:submit__name>
            Checkout
          </template>
        </order-form>
      </my-dialog>
    </my-dialog>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import BasketBook from "../BasketBook";
import MyButton from "./MyButton";
import MyDialog from "./MyDialog";
import OrderForm from "../OrderForm";

export default {
  name: "Basket",
  components: {OrderForm, MyDialog, MyButton, BasketBook},
  data(){
    return{
      createOrderDialogVisible: false
    }
  },
  updated() {
    if(this.books.length === 0){
      this.createOrderDialogVisible = false
    }
  },
  computed: {
    ...mapState({
      isAuth: state => state.isAuth,
      visible: state => state.basket.visible,
      books: state => state.basket.books
    }),
    ...mapGetters({
      getTotalSum: 'basket/getTotalSum'
    })
  },
  methods: {
    ...mapActions({
      getBooks: 'basket/getBasketBooks'
    }),
    ...mapMutations({
      clearBasket: 'basket/clearBasket'
    }),
    async showCreateOrderDialog(){
      this.createOrderDialogVisible = true
    },
  }
}
</script>

<style scoped>
.basket{
  width: fit-content;
  max-width: 50vw;
  min-width: 400px;
  background-color: rgba(149, 149, 149, 0.3);
  border-radius: 5px;
  color: #292a5c;
}
.basket-body{
  overflow-y: auto;
  overflow-x: hidden;
  height: 60vh;
  padding: 10px;
}
hr{
  margin: 0;
}
.close{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: fit-content;
  background-color: inherit;
  border: none;
}


.close:hover{
  color: red;
}

.buy-btn{
  background-color: rgba(112, 114, 247, 0.2);
  border-radius: 5px;
  border: solid 2px rgba(112, 114, 247, 0.4);
}
</style>