<template>
  <div class="card item gray">
    <img class="image" v-image-observer:[book.image]="getImage" alt="Book image" @click="$router.push(`/books/${book.id}`)">
    <div class="card-body">
      <h5 class="card-title">{{book.name}}</h5>
      <p class="card-text text">
        <span>{{book.author}}</span>
        <span>${{book.price}}</span>
        <span id="ISBN">#{{book.ISBN}}</span>
      </p>
      <my-button @click="$emit('remove', book.id)">Delete</my-button>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import MyButton from "./UI/MyButton";

export default {
  name: "BookItem",
  components: {MyButton},
  props:{
    book: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapActions({
      getImage: 'book/getBookImage'
    }),
  }

}
</script>

<style scoped>
.item{
  width: 17rem;
  background-color: rgba(149, 149, 149, 0.34);
}
#ISBN{
  font-size: 12px;
  color: #909090;
}
.image{
  height: 15rem;
  border-radius: 3px;
}
.text{
  display: flex;
  flex-direction: column;
}
</style>