<template>
  <div class="user__page">
    <Form v-slot="{ handleSubmit }" :validation-schema="schema" as="div" class="user__form">
      <my-title class="title">
        <img src="@/assets/login_negate.png" height="32" width="32" class="mb-2"/>
        Log in
      </my-title>
      <my-error-list :errors="errors"></my-error-list>
      <form @submit="handleSubmit($event, login)" class="form">
        <MyField
            v-model="user.email"
            name="email"
            placeholder="email@gmail.com"
        />
        <MyErrorMessage name="email" />
        <MyField
            v-model="user.password"
            name="password"
            type="password"
            placeholder="password"
        />
        <MyErrorMessage name="password" />
        <my-button
            type="submit"
        >
          Log in
        </my-button>
      </form>
      <p>
        I don't have an account :
        <router-link to="/register" class="link">Sign up</router-link>
      </p>
    </Form>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {Form} from 'vee-validate'

import * as yup from 'yup'
import MyField from "@/components/UI/MyField";
import MyErrorMessage from "@/components/UI/MyErrorMessage";
import MyErrorList from "@/components/UI/MyErrorList";
import MyTitle from "../components/UI/MyTitle";

export default {
  name: "LoginPage",
  components:{
    MyTitle,
    MyErrorList,
    MyField,
    Form, MyErrorMessage
  },
  async beforeUnmount() {
    if(this.isAuth) {
      await this.getCurrentUser()
      localStorage.accessToken = this.accessToken
      localStorage.refreshToken = this.refreshToken
      localStorage.isAuth = this.isAuth
      localStorage.isAdmin = this.isAdmin
      localStorage.tokenExp = this.tokenExp
      localStorage.user_id = this.user.id
    }
    this.clearErrors()
  },
  computed: {
    ...mapState({
      accessToken: state => state.accessToken,
      refreshToken: state => state.refreshToken,
      isAuth: state => state.isAuth,
      isAdmin: state => state.isAdmin,
      user: state => state.user.user,
      tokenExp: state => state.tokenExp,
      errors: state => state.errors
    }),
    schema() {
      return yup.object().shape({
        email: yup.string().email().max(50).required().label('Email'),
        password: yup.string().min(5).required().label('Password'),
      })
    }
  },
  methods: {
    ...mapActions({
      login: 'user/login',
      getCurrentUser: 'user/getCurrentUser'
    }),
    ...mapMutations({
      clearErrors: 'clearErrors'
    })

  }
}

</script>

<style scoped>

</style>