<template>
  <div class="card item text-center">
<!--    <img class="card-img-top image" :src="getUrl(book.image)" alt="Card image cap">-->
    <div class="card-body">
      <h5 class="card-title">{{book.name}}</h5>
      <p class="card-text">{{book.author}}<br>{{book.price}}<br>{{book.ISBN}}</p>
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
  },
  data(){
    return {
      urlCreator: window.URL || window.webkitURL
    }
  },
  methods: {
    ...mapActions({
      getImage: 'book/getBookImage'
    }),
    async getUrl(image_name){
      const blob = await this.getImage(image_name)
      console.log(blob)
      const url = this.urlCreator.createObjectURL(blob)
      console.log(JSON.stringify(url))
      return JSON.stringify(url)

    },
  }

}
</script>

<style scoped>
.item{
  width: 18rem;
  background-color: rgba(0, 0, 0, 0.34);
}
</style>