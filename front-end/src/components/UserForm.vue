<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="schema" as="div" class="user__form">
    <my-title><slot name="header"></slot></my-title>
    <my-error-list :errors="errors"></my-error-list>
    <form @submit="handleSubmit($event, action)" method="post" class="form">
      Email : <my-field
        v-model="user.email"
        name="email"
        :disabled="this.modified"

      />
      <my-error-message name="email" />
      Username : <my-field
        v-model="user.username"
        name="username"
      />
      <my-error-message name="username" />
      First name : <my-field
        v-model="user.first_name"
        name="firstname"
      />
      <my-error-message name="firstname" />
      Last name : <my-field
        v-model="user.last_name"
        name="lastname"
      />
      <my-error-message name="lastname" />
      <slot name="password"></slot> :
      <my-field
        v-model="user.password"
        name="password"
        type="password"
      />
      <my-error-message name="password" />
      <my-button
          type="submit"
      >
        <slot name="submit__name"></slot>
      </my-button>
      <slot name="link"></slot>
    </form>
  </Form>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {Form} from 'vee-validate'

import * as yup from 'yup'
import MyField from "@/components/UI/MyField";
import MyErrorMessage from "@/components/UI/MyErrorMessage";
import MyErrorList from "./UI/MyErrorList";
import MyTitle from "./UI/MyTitle";

export default {
  name: "UserForm",
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
  methods: {
    ...mapActions({
      register: 'user/register',
      updateUser: 'user/updateUser'
    }),
    async action(){
      const dialog = document.querySelector('.dialog')
      if(this.modified) {
        this.updateUser()
        if(this.errors.length === 0) {
          this.$swal({
            title: "<span style='color: #ffffff'>Success</span>",
            html: "<span style='color: #ffffff'>Account updated successfully</span>",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          dialog.click()
        }
      }
      else {
        this.register()
      }
    }

  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      errors: state => state.errors
    }),
    schema() {
      let schema = yup.object().shape({
        email: yup.string().email().max(50).required().label('Email'),
        username: yup.string().max(50).required().label('Username'),
        firstname: yup.string().max(50).nullable().label('First name'),
        lastname: yup.string().max(50).nullable().label('Last name'),
      })

      let password
      if(!this.modified)
        password = {password: yup.string().min(5).required().label('Password')}
      else
        password = {password: yup.string().min(5).label('Password')}
      return schema.shape(password)
    },
  },
}
</script>

<style scoped>

</style>