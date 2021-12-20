<template>
  <div class="navbar">
    <div @click="$router.push('/')"><div class="logo">PSALT<span>ERIUM</span></div></div>
    <div class="navbar__btns">
      <div>
<!--        <my-button @click="this.$store.commit('book/setSearchedMod', false)"/>-->
        <my-search/>
      </div>
      <div v-if="!isAuth">
        <router-link to="/login"><my-button>Log in</my-button></router-link>
        <router-link to="/register"><my-button>Register</my-button></router-link>
      </div>
      <div v-else>
        <router-link to="/account"><my-button>Account</my-button></router-link>
        <router-link to="/">
          <my-button
            @click="this.$store.dispatch('logout')"
          >
            Log out
          </my-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import MyButton from "./MyButton";

export default {
  name: "Navbar",
  components: {MyButton},
  computed: {
    ...mapState({
      searchQuery: state => state.book.searchQuery
    }),
    isAuth(){
      return JSON.parse(this.$store.state.isAuth)
    }
  },
  methods: {
    ...mapActions({
      search: 'book/search'
    }),
    ...mapMutations({
      setSearchQuery: 'book/setSearchQuery'
    })
  }
}
</script>

<style scoped>
.logo{
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
}
.logo>span{
  color: #7072F7;
}
.navbar{
  height: 50px;
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 10px 15px;
}

.navbar__btns{
  margin-left: auto;
}
.navbar__btns, .navbar__btns>div{
  display: flex;
  gap: 10px;
}
</style>