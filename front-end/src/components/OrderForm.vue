<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="schema" as="div" class="order__form">
    <my-error-list :errors="errors"></my-error-list>
    <form @submit="handleSubmit($event, action)" method="post" class="d-flex flex-column form" >
      Country : <my-field
        v-model="order.country"
        name="country"
    />
      <my-error-message name="country" />
      City : <my-field
        v-model="order.city"
        name="city"
    />
      <my-error-message name="city" />
      Address : <my-field
        v-model="order.address"
        name="address"
    />
      <my-error-message name="address" />
      Delivery date: <my-field
        v-model="order.deliver_date"
        type="date"
        name="deliver"
    />
      <my-error-message name="deliver" />
      <div v-if="isLoading" class="spinner-grow align-self-center m-2"></div>
      <my-button
          v-else
          type="submit"
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
  name: "OrderForm",
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
      createOrder: 'order/createOrder',
    }),
    async action(){
      const dialog = document.querySelector('.dialog')
      await this.createOrder()
      this.$swal({
        title: "<span style='color: #ffffff'>Success</span>",
        html: "<span style='color: #ffffff'>Order successfully created</span>",
        icon: 'success',
        showConfirmButton: false,
        timer: 1000
      })
      dialog.click()
    },
  },
  computed: {
    ...mapState({
      order: state => state.order.order,
      errors: state => state.errors,
      isLoading: state => state.order.isLoading
    }),
    schema() {
      return  yup.object().shape({
        country: yup.string().required().label('Country'),
        city: yup.string().required().label('City'),
        address: yup.string().required().label('Address'),
        deliver: yup.date().min(new Date(), 'Delivery date must be later than today').required().label('Delivery date'),
      })
    },
  },
}
</script>

<style scoped>
.order__form{
  width: 25vw;
  min-width: 200px;
  max-width: 500px;
}
</style>