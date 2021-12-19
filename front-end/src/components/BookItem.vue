<template>
  <div class="card item text-center">
    <img class="card-img-top image" v-image-observer:[book.image]="getUrl" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">{{book.name}}</h5>
      <p class="card-text text">
        <span>{{book.author}}</span>
        <span>{{book.price}}</span>
        <span id="ISBN">#{{book.ISBN}}</span>
      </p>
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
    async getUrl(target, image_name){
      console.log('back')
      const blob = await this.getImage(image_name)
      console.log(blob)
      const url = this.urlCreator.createObjectURL(blob)
      console.log(JSON.stringify(url))
      target.setAttribute('src', url);
    },
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
  height: 65%;
}
.text{
  display: flex;
  flex-direction: column;
}
</style>