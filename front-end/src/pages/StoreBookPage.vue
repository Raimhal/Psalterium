<template>
  <div class="item">
    <div class="d-flex justify-content-center w-100 top-content">
      <img class="image align" v-image-observer:[book.image]="getImage" :key="book.id" alt="Card image cap" @click="showImageDialog">
      <div class="p-4 short__info">
        <div class="mb-2">
          <h5 class="text-center mb-4 title">{{book.name}}</h5>
          <p>Author : {{book.author}}</p>
          <p>Price : ${{book.price}}</p>
          <div>
            <p v-if="book.count > 0">Available : {{book.count}} pcs.</p>
            <p v-else class="error">Not available</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="d-flex justify-content-between pe-lg-5 ps-lg-5 mt-3">
        <div class="d-flex flex-column justify-content-evenly">
          <span>Publication : {{ new Date(book.publication_date).toLocaleDateString()}}</span>
          <span>Last update date : {{new Date(book.update_date).toLocaleDateString()}}</span>
          <span id="ISBN">ISBN : #{{book.ISBN}}</span>
        </div>
        <div class="d-flex content">
          <div v-if="book.count > 0 && isAuth" class="d-flex justify-content-center">
            <form @submit.prevent="action" method="post" class="order__form addToBasket gap-2 p-2">
              <my-input v-model="order.count" type="number" id="count"/>
              <div v-if="isCartLoading" class="spinner-grow align-self-center m-2"></div>
              <my-button v-else type="submit">Add to card</my-button>
            </form>
          </div>
        </div>
      </div>
      <div v-if="book.genres.length > 0" class="m-auto">
        <p class="text-center mb-3">
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
    <div class="d-flex justify-content-between mt-3 gap-3">
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
          <div v-if="isLoading" class="spinner-grow align-self-center m-2"></div>
          <my-button v-else type="submit">Submit</my-button>
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
    await this.getBook(this.$router.currentRoute.value.params.id)
    if(this.book.count > 0 && this.isAuth) {
      this.setBookLimits()
    }
    this.isCreator = this.book.owner_id === JSON.parse(localStorage.user_id) || this.isAdmin
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
      order: state => state.basket.order,
      errors: state => state.errors,
      isLoading: state => state.book.isLoading,
      isCartLoading: state => state.basket.isLoading
    }),
  },
  async beforeUnmount() {

    await this.clearBook()
  },
  methods: {
    ...mapActions({
      getBook: 'book/getBook',
      getImage: 'book/getBookImage',
      addToBasket: 'basket/addToBasket',
      changeImage: 'book/changeBookImage'
    }),
    ...mapMutations({
      clearBook: 'book/clearBook'
    }),
    async action(){
      if(!this.isAuth)
        this.$router.push('/login')
      else {
        this.$swal({
          title: "<span style='color: #ffffff'>Success</span>",
          html: "<span style='color: #ffffff'>The book has been successfully added to your cart</span>",
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
        await this.addToBasket(this.book)
        if(this.book.count > 0)
          this.setBookLimits()
      }
    },
    async showBookUpdateDialog(){
      this.updateBookDialogVisible = true
    },
    async showImageDialog(){
      if(this.isCreator)
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
      const dialog = document.querySelector('.dialog')
      const image = document.querySelector('.image')
      await this.changeImage()
      await this.getImage({target: image, image_name: this.book.image})
      if(this.errors.length === 0){
        this.$swal({
          title: "<span style='color: #ffffff'>Success</span>",
          html: "<span style='color: #ffffff'>The image has been successfully changed</span>",
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })
        dialog.click()
      }
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
  max-height: 450px;
  border-radius: 15px;
}
.top-content{
  display: grid;
  grid-template-columns: 25vw 10vw;
}
p{
  margin: 0;
  line-height: 27px;
}

.order__form>button, .order__form>input {
  margin: 0;
  width: 100%;
}

.order__form{
  width: 15vw;
  max-width: 200px;
  min-width: 150px;
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

.addToBasket{
  background-color: rgba(112, 114, 247, 0.2);
  border-radius: 5px;
  border: solid 2px rgba(112, 114, 247, 0.4);
  height: fit-content;
}

@media screen and (max-width: 900px){
  .item>div{
    flex-direction: column;
    align-items: center;
  }
  .image{
    justify-self: center;
  }
  .short__info{
    max-width: 100vw;
    width: 100%;
    padding: 0 !important;
  }
  .item>div:last-child{
    gap: 0.5rem;
    flex-direction: column-reverse;
    align-items: center;
  }
  .item>div:last-child>div{
    gap: 0.5rem !important;
    width: 100%;
    flex-direction: column;
  }
  .item>div:last-child button{
    width: 100%;
  }
}

@media  screen and (max-width: 750px){
  .item{
    margin: 0 !important;
    width: 100%;
  }
}

@media screen and (max-width: 650px) {

  .item>div:nth-child(2)>div:first-child{
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    gap: 0.6rem;
  }

  .order__form{
    width: 60vw;
    max-width: 60vw;
  }

  .content{
    justify-content: center;
  }


}
img:hover{
  cursor: pointer;
}
</style>