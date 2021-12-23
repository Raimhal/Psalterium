<template>
  <div class="item" :key="book.id" >
    <header class="mb-3 d-flex justify-content-center w-100">
      <img class="image" v-image-observer:[book.image]="getImage" :key="book.id" alt="Card image cap" @click="$router.push(`/books/${book.id}`)">
      <div class="p-4 short__info">
        <div>
          <h5 class="text-center mb-4 title">{{book.name}}</h5>
          <p>Author : {{book.author}}</p>
          <p>Price : ${{book.price}}</p>
          <div v-if="isAuth">
            <p v-if="book.count > 0">Available : {{book.count}} pcs.</p>
            <p v-else class="error">Not available</p>
          </div>
        </div>
        <div>
          <div v-if="book.count > 0 && isAuth">
            <form @submit.prevent="action" method="post" class="order__form">
              <my-input class="order" v-model="order.count" type="number" id="count"/>
              <my-button class="order" type="submit">Add to card</my-button>
            </form>
          </div>
        </div>
      </div>
    </header>
    <div>
      <p>Publication : {{ new Date(book.publication_date).toLocaleDateString()}}</p>
      <p>Last update date : {{new Date(book.update_date).toLocaleDateString()}}</p>
      <p id="ISBN">ISBN : #{{book.ISBN}}</p>
      <div v-if="book.genres.length > 0" class="m-auto">
        <p class="text-center mt-3 mb-2">
        Genres
        </p>
        <p class="row justify-content-center">
        <span v-for="genre in book.genres" :key="genre.name" class="text-center genre m-1 col-auto">{{genre.name}}</span>
        </p>
      </div>
      <div v-if="book.content.length > 0" class="mt-3">
        <p class="align-self-center text-center">Plot</p>
        <hr/>
        <p class="plot">{{book.content}}</p>
        <hr/>
      </div>
    </div>
    <div class="d-flex justify-content-between mt-3">
      <my-button @click="$router.back()">Back</my-button>
      <div class="d-flex gap-3" v-if="isCreator">
        <my-button @click="showChangeGenresDialog">Change genres</my-button>
        <my-button @click="showBookUpdateDialog">Update</my-button>
        <my-button @click="showImageDialog">Change image</my-button>
      </div>
    </div>
    <my-dialog v-model:show="imageDialogVisible">
      <Form v-slot="{ handleSubmit }" as="div">
        <my-error-list :errors="errors" class="text-center text-break"></my-error-list>
        <form @submit="handleSubmit($event, changeBookImage)" enctype="multipart/form-data" method="post" id="uploadForm" class="form">
          <label for="files" class="label text-break mb-2" id="file_label">Select image</label>
          <my-field type="file" name="file" id="files" v-focus class="file" @change="changeFileStatus" accept="image/*" required/>
          <my-error-message name="file"/>
          <my-button type="submit">Submit</my-button>
          <div v-if="isLoading">Loading...</div>
        </form>
      </Form>
    </my-dialog>
    <my-dialog v-model:show="updateBookDialogVisible">
      <book-form :modified="true">
        <template v-slot:submit__name>
          Save
        </template>
      </book-form>
    </my-dialog>
    <my-dialog v-model:show="changeGenresDialogVisible">
      <genre-form></genre-form>
    </my-dialog>
  </div>
</template>

<script>
import BookItem from "@/components/BookItem";
import {mapActions, mapMutations, mapState} from "vuex";
import BookForm from "@/components/BookForm";
import MyErrorList from "@/components/UI/MyErrorList";
import MyField from "@/components/UI/MyField";
import MyErrorMessage from "@/components/UI/MyErrorMessage";
import {Form} from "vee-validate";
import GenreForm from "@/components/GenreForm";


export default {
  name: "StoreBookPage",
  components: {GenreForm, BookForm, BookItem, MyErrorList, MyField, MyErrorMessage, Form},
  async beforeMount() {
    await this.getBook(this.$router.currentRoute.value.params.id).then(() => {
      if (this.book.count > 0)
        this.setBookLimits()
      this.isCreator = this.book.owner_id === JSON.parse(localStorage.user_id) || this.isAdmin
    })
  },
  data(){
    return{
      updateBookDialogVisible: false,
      imageDialogVisible: false,
      changeGenresDialogVisible: false,
      isCreator: false
    }
  },
  computed: {
    ...mapState({
      isAuth: state => state.isAuth,
      isAdmin: state => state.isAdmin,
      book: state => state.book.book,
      order: state => state.book.order,
      errors: state => state.errors,
      isLoading: state => state.book.isLoading
    }),
  },
  async beforeUnmount() {
    await this.clearBook()
  },
  methods: {
    ...mapActions({
      getBook: 'book/getBook',
      getImage: 'book/getBookImage',
      addToBasket: 'book/addToBasket',
      changeImage: 'book/changeBookImage'
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
    async showImageDialog(){
      this.imageDialogVisible = true
    },
    async showChangeGenresDialog(){
      this.changeGenresDialogVisible = true
    },
    setBookLimits(){
      const order_count = document.querySelector('#count')
      order_count.setAttribute('min', 1)
      order_count.setAttribute('max', this.book.count)
    },
    changeFileStatus(event){
      const image = event.target
      const label = document.querySelector('#file_label')
      if(image.files.length === 0)
        label.innerHTML = `Select image`
      else
        label.innerHTML = `${image.files[0].name}`
    },
    async changeBookImage(){
      const image = document.querySelector('.image')
      await this.changeImage()
      await this.getImage({target: image, image_name: this.book.image})
    }
  },

}
</script>

<style scoped>
.item{
  background-color: inherit;
  border:none;
  width: 60vw;
  min-height: 90vh;
  margin: auto;
  overflow-wrap: break-word;
}
.image{
  width: 300px;
  max-height: 400px;
  object-fit: contain;
  border-radius: 15px;
}
header{
  display: grid;
  grid-template-columns: 25vw 10vw;
}
p{
  margin: 0;
  line-height: 27px;
}

.order{
  width: 100%;
  max-width: 200px;
  min-width: 120px;
}

.order__form{
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.short__info{
  display: flex;
  max-width: 25vw;
  flex-direction: column;
  justify-content: space-around;
}

.file{
  color: #FFF587;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.label {
  width: 180px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  font: 14px/50px 'Merriweather', serif;
  transition: all 0.3s ease-in-out;
  color: #FFF587;
  line-height: 22px !important;

}

.label:hover {
  color: #ffffff;
}

.genre{
  background-color: rgba(149, 149, 149, 0.34);
}

.title{
  font-weight: bold;
  font-style: italic;
}

.plot{
  text-align: justify;
}
</style>