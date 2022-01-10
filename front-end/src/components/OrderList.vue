<template>
  <div>
    <table class="_table">
      <caption>
        <slot name="image"></slot>
        Orders :
      </caption>
      <thead>
      <tr>
        <th v-if="isAdmin">User</th>
        <th>Delivery date</th>
        <th>Destination</th>
        <th>Books</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <transition-group name="list">
        <tr v-for="order in orders" :key="order.id" >
          <td v-if="isAdmin">{{order.user_id}}</td>
          <td>{{new Date(order.deliver_date).toLocaleDateString()}}</td>
          <td>{{order.country}},  {{order.city}}, {{order.address}}</td>
          <td>
            <div class="d-flex flex-wrap gap-2">
              <router-link v-for="book in order.books" :key="book" class="text-decoration-none order p-1" :to="`/books/${book.book_id}`">
                <span>Count : {{book.order_count}}</span>
              </router-link>
            </div>
          </td>
          <td>
            <div class="btns">
              <my-button @click.once="removeOrder(order.id)"> Delete </my-button>
            </div>
          </td>
        </tr>
      </transition-group>
      <tr>
        <td>
          <div
              v-intersection:[isAdmin]="getOrders"
              class="observer"
          >
          </div>
        </td>
      </tr>
      </tbody>
    </table>

  </div>
</template>

<script>

import {mapActions, mapState} from "vuex";
import MyButton from "./UI/MyButton";
import UserForm from "./UserForm";
import MyDialog from "./UI/MyDialog";

export default {
  name: "OrderList",
  components: {MyButton, MyDialog},
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    ...mapState({
      order: state => state.order.order,
      orders: state => state.order.orders,
      email: state => state.user.user.email,
    }),

  },
  methods: {
    ...mapActions({
      removeOrder: 'order/removeOrder',
      getOrders: 'order/getOrders'
    }),
  },
}
</script>

<style scoped>
caption {
  background: rgba(56, 58, 73, 0.9);
  color: azure;
  padding: 10px;
  text-align: left;
  font-size: 20px;
  caption-side: top;
}
th {
  border-bottom: 3px solid rgba(56, 58, 73, 0.9);
  padding: 10px;
  text-align: left;
}
td {
  padding: 10px;
}
tr{
  min-width: 100%;
}
tr:nth-child(odd) {
  background: rgba(72, 86, 95, 0.2);
}
tr:nth-child(even) {
  background-color: rgba(56, 58, 73, 0.9);
}
.btns{
  display: flex;
  gap: 2px;
  justify-content: space-evenly;
}

tbody{
  display: block;
  overflow-y: auto;
  height: 70vh;
}

table thead, table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.order{
  background-color: rgba(112, 114, 247, 0.3);
  border: 1px solid rgba(112, 114, 247, 0.5);
  border-radius: 5px;
  margin: 0;
  white-space: nowrap;
  text-decoration: none;
}

</style>