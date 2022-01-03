<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="schema" as="div"  class="dialog">
    <my-error-list :errors="errors"></my-error-list>
    <form @submit="handleSubmit($event, action)" method="post" class="d-flex flex-column" name="book_form">
      <div class="scroll d-flex flex-column justify-content-between" >
        Title : <my-field
          v-model="book.name"
          name="name"
          v-focus
      />
        <my-error-message name="name" />
        Author : <my-field
          v-model="book.author"
          name="author"
      />
        <my-error-message name="author" />
        Count : <my-field
          v-model="book.count"
          name="count"
      />
        <my-error-message name="count" />
        Price : <my-field
          v-model="book.price"
          name="price"
      />
        <my-error-message name="price" />
        ISBN : <my-field
          v-model="book.ISBN"
          name="ISBN"
      />
        <my-error-message name="ISBN" />
        Date of publication : <my-field
          v-model="book.publication_date"
          type="date"
          class="w-100"
          name="publication"
      />
        <my-error-message name="publication" />
        Description : <textarea
          v-model="book.content"
          name="content"
          maxlength="5000"

      ></textarea>
        <my-error-message name="content" />
      </div>
      <div class="mt-2 d-flex justify-content-center">
        <div v-if="isLoading" class="spinner-grow align-self-center m-2"></div>
        <my-button
            v-else
            type="submit"
            class="w-100"
        >
          <slot name="submit__name"></slot>
        </my-button>
      </div>
    </form>
  </Form>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {Form} from 'vee-validate'

import * as yup from 'yup'
import MyField from "@/components/UI/MyField";
import MyErrorMessage from "@/components/UI/MyErrorMessage";
import MyErrorList from "./UI/MyErrorList";
import router from "../router/router";


export default {
  name: "BookForm",
  components: {Form, MyField, MyErrorList, MyErrorMessage},
  props: {
    modified:{
      type: Boolean,
      default: false
    },
  },
  mounted() {
    this.clearErrors()
  },
  methods: {
    ...mapMutations({
      clearErrors: 'clearErrors'
    }),
    ...mapActions({
      createBook: 'book/createBook',
      updateBook: 'book/updateBook'
    }),
    async action(){
      const dialog = document.querySelector('.dialog')
      if(this.modified) {
        await this.updateBook(this.book.id)
        if(this.errors.length === 0)
          this.$swal({
            title: "<span style='color: #ffffff'>Success</span>",
            html: "<span style='color: #ffffff'>The book has been successfully updated</span>",
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })
        dialog.click()

      }
      else {
        await this.createBook()
        if(this.errors.length === 0)
          this.$swal({
            title: "<span style='color: #ffffff'>Success</span>",
            html: "<span style='color: #ffffff'>The book has been successfully created</span>",
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })
        dialog.click()
      }
    },
  },
  computed: {
    ...mapState({
      book: state => state.book.book,
      errors: state => state.errors,
      isLoading: state => state.book.isFormLoading,
    }),
    schema() {
      return  yup.object().shape({
        name: yup.string().max(100).required().label('Title'),
        author: yup.string().max(50).required().label('Author'),
        count: yup.number().typeError("Count is a number field").integer('Invalid decimal').min(1).required().label('Count'),
        price: yup.number().typeError("Count is a number field").min(1).required().label('Price'),
        ISBN: yup.string().matches('^(?=(?:\\D*\\d){10}(?:(?:\\D*\\d){3})?$)[\\d-]+$', 'Enter the correct ISBN').required().label('ISBN'),
        publication: yup.date().min(new Date(1)).required().label('Date of publication'),
        content: yup.string().max(5000).label('Description'),
      })
    },
  },
}
</script>

<style scoped>
.dialog{
  width: 50vw;
  max-width: 500px;
  min-width: 350px;
}

.scroll{
  height: 85vh;
  min-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
}

textarea{
  color: #292a5c;
  height: 20vh;
  min-height: 100px;
}

</style>