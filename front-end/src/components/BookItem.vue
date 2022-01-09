<template>
  <div class="card item bg-gradient" :class="{ 'gray' : book.count === 0}" @click="$router.push(`/books/${book.id}`)">
    <div>
      <img class="image" v-image-observer:[book.image]="getImage" alt="Book image">
    </div>
    <div class="card-body item-body">
      <h5 class="card-title">{{book.name}}</h5>
      <p class="card-text text">
        <span>{{book.author}}</span>
        <span>${{book.price}}</span>
        <span id="ISBN">#{{book.ISBN}}</span>
      </p>
      <my-button @click.stop="$emit('remove', book.id)" v-if="isCreator" class="w-50 align-self-center">
        Delete
      </my-button>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "BookItem",
  props:{
    book: {
      type: Object,
      required: true,
    },
    isCreator: {
      type: Boolean,
      default: false
    }
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
  background-color: rgba(149, 149, 149, 0.3);
  border: none;
}
.item:hover{
  cursor: pointer;
}
.item-body{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
#ISBN{
  font-size: 12px;
  color: #909090;
}
.image{
  width: 100%;
  max-height: 380px;
  min-height: 380px;
  border-radius: 3px 3px 0 0;
  filter: saturate(107%);
}

.image:hover{
  cursor: pointer;
}
.text{
  display: flex;
  flex-direction: column;
}

.gray{
  filter: opacity(.8) brightness(.5)  saturate(.2);
}

</style>