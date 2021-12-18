<template>
  <div>
    <table class="user__table">
      <caption>Users : </caption>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="body">
        <tr v-for="user in users" :key="user.id" class="user">
          <td>{{user.userName}}</td>
          <td>{{user.email}}</td>
          <td>{{user.firstName}}</td>
          <td>{{user.lastName}}</td>
          <td class="btns">
            <my-button @click="removeUser(user.id)"> Delete </my-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import {mapActions} from "vuex";

export default {
  name: "UserList",

  props: {
    users: {
      type: Array,
      required: true
    }
  },
  methods: {
    ...mapActions({
      removeUser: 'user/removeUser'
    }),

  },
}
</script>

<style scoped>

</style>