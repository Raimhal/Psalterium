<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="schema" as="div"  class="dialog">
    <my-error-list :errors="errors"></my-error-list>
    <form @submit="handleSubmit($event, action)" method="post" class="d-flex flex-column">
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
        name="publication"
    />
      <my-error-message name="publication" />
      Description : <my-field
        v-model="book.content"
        name="content"
    />
      <my-error-message name="content" />
      <my-button
          type="submit"
          class="btn"
      >
        <slot name="submit__name"></slot>
      </my-button>
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
      if(this.modified)
        await this.updateBook(this.book.id)
      else {
        await this.createBook()
      }
    },
  },
  computed: {
    ...mapState({
      book: state => state.book.book,
      errors: state => state.errors
    }),
    schema() {
      return  yup.object().shape({
        name: yup.string().max(100).required().label('Title'),
        author: yup.string().max(50).required().label('Author'),
        count: yup.number().typeError("Count is a number field").integer('Invalid decimal').min(1).required().label('Count'),
        price: yup.number().typeError("Count is a number field").min(1).required().label('Price'),
        ISBN: yup.string().length(13).required().label('ISBN'),
        publication: yup.date().min(new Date(1), 'Start date is a required field').required().label('Date of publication'),
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
}
</style>