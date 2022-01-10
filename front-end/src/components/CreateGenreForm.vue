<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="schema" as="div" class="genre__form">
    <my-error-list :errors="errors"></my-error-list>
    <form @submit="handleSubmit($event, action)" method="post" class="form">
      Genre name : <my-field
        v-model="genre.name"
        name="title"
        v-focus
      />
      <my-error-message name="title" />
      <div v-if="isLoading" class="spinner-grow align-self-center m-2"></div>
      <my-button
          v-else
          type="submit"
          @click.once
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
import MyTitle from "./UI/MyTitle";

export default {
  name: "CreateGenreForm",
  components: {
    MyTitle,
    MyErrorList,
    Form, MyField, MyErrorMessage
  },
  props: {
    modified:{
      type: Boolean,
      default: false
    }
  },
  beforeUnmount() {
    this.clearGenre()
    this.clearErrors()
  },
  methods: {
    ...mapActions({
      createGenre: 'genre/createGenre',
      updateGenre: 'genre/updateGenre',
    }),
    ...mapMutations({
      clearGenre: 'genre/clearGenre',
      clearErrors: 'clearErrors'
    }),
    async action(){
      const dialog = document.querySelector('.dialog')
      if(this.modified) {
        await this.updateGenre()
        if(this.errors.length === 0) {
          this.$swal({
            title: "<span style='color: #ffffff'>Success</span>",
            html: "<span style='color: #ffffff'>The genre has been successfully updated</span>",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          dialog.click()
        }
      }
      else {
        await this.createGenre()
        if(this.errors.length === 0) {
          this.$swal({
            title: "<span style='color: #ffffff'>Success</span>",
            html: "<span style='color: #ffffff'>The genre has been successfully created</span>",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          dialog.click()
        }
      }
    }

  },
  computed: {
    ...mapState({
      genre: state => state.genre.genre,
      errors: state => state.errors,
      isLoading: state => state.genre.isLoading
    }),
    schema() {
      return yup.object().shape({
        title: yup.string().max(30).required().label('Genre name'),
      })
    },
  },
}
</script>

<style scoped>
.genre__form{
  width: 25vw;
  min-width: 200px;
}

</style>