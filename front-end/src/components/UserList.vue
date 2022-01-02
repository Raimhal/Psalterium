<template>
  <div>
    <table class="_table">
      <caption>Users : </caption>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Admin</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      <transition-group name="list">
        <tr v-for="user in users" :key="user.id">
          <td>{{user.username}}</td>
          <td>{{user.email}}</td>
          <td>{{user.first_name}}</td>
          <td>{{user.last_name}}</td>
          <td>
            <div class="d-flex align-items-center">
              <input type="checkbox" class="disabled"
                     :id="user.id"
                     v-model="user.role"
                     @click="changeRole({role: !user.role, id: user.id})"
                     :checked="user.role_id === 1"
                     :disabled=current(user.id)
              />
              <label :for="user.id"></label>
            </div>
          </td>
          <td>
            <div class="btns">
              <my-button @click="showUserUpdateDialog(user)">Edit</my-button>
              <my-button @click.once="removeUser(user.id)" v-if="!current(user.id)"> Delete </my-button>
            </div>
          </td>
        </tr>
      </transition-group>
      <tr>
        <td>
          <div
              v-intersection="getUsers"
              class="observer"
          >
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <my-dialog v-model:show="userUpdateDialogVisible">
      <user-form :modified="true">
        <template v-slot:password>
          New password
        </template>
        <template v-slot:submit__name>
          Save
        </template>
      </user-form>
    </my-dialog>
  </div>
</template>

<script>

import {mapActions, mapState} from "vuex";
import MyButton from "./UI/MyButton";
import UserForm from "./UserForm";
import MyDialog from "./UI/MyDialog";

export default {
  name: "UserList",
  components: {UserForm, MyButton, MyDialog},
  data(){
    return{
      userUpdateDialogVisible: false,
    }
  },
  computed:{
    ...mapState({
      user: state => state.user.user,
      users: state => state.user.users
    }),

  },
  methods: {
    ...mapActions({
      removeUser: 'user/removeUser',
      changeRole: 'user/changeRole',
      getUsers: 'user/getUsers'
    }),
    showUserUpdateDialog(user){
      this.userUpdateDialogVisible = true
      this.$store.commit('user/setUser', user)
    },
    current(id){return JSON.parse(localStorage.user_id) === id}

  },
}
</script>

<style scoped>

caption {
  background: rgba(56, 58, 73, 0.9);
  color: azure;
  padding: 10px;
  text-align: left;
  font-size: 20px;
  caption-side: top;
}
th {
  border-bottom: 3px solid rgba(56, 58, 73, 0.9);
  padding: 10px;
  text-align: left;
}
td {
  padding: 10px;
  word-break: break-word;
}
tr{
  min-width: 100%;
}
tr:nth-child(odd) {
  background: rgba(72, 86, 95, 0.2);
}
tr:nth-child(even) {
  background-color: rgba(56, 58, 73, 0.9);
}
.btns{
  display: flex;
  gap: 2px;
  justify-content: space-evenly;
}

tbody{
  display: block;
  overflow-y: auto;
  max-height: 500px;
}

table thead, table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

input[type=checkbox]{
  height: 0;
  width: 0;
  visibility: hidden;
}
label {
  cursor: pointer;

  width: 40px;
  height: 20px;
  background: rgba(149, 149, 149, 0.34);
  display: block;
  border-radius: 100px;
  position: relative;
}
label:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 90px;
  transition: 0.3s;
}

input:checked + label {
  background: #7072F7;
}

input:disabled + label{
  background: rgb(255, 25, 25);
}

input:checked + label:after {
  left: 100%;
  transform: translateX(-100%);
}

label:active:after {
  width: 70%;
}

@media(max-width: 1200px) {

}

</style>