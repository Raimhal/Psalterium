<template>
  <div class="card item text-center">
<!--    <img class="card-img-top image" :src="getUrl(book.image)" alt="Card image cap">-->
    <div class="card-body">
      <h5 class="card-title">{{book.name}}</h5>
      <p class="card-text">{{book.author}}<br>{{book.price}}<br><span id="ISBN">#{{book.ISBN}}</span></p>
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
  background-color: rgba(149, 149, 149, 0.34);
}
#ISBN{
  font-size: 12px;
  color: #909090;
}
</style>