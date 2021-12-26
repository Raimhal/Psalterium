<template>
  <div class="navbar">
    <div @click="goToHome"><div class="logo">PSALT<span>ERIUM</span></div></div>
    <div class="navbar__btns">
      <div v-show="this.$router.currentRoute.value.fullPath === '/'">
        <my-search />
      </div>
      <div v-if="!isAuth">
        <router-link to="/login"><my-button>Log in</my-button></router-link>
        <router-link to="/register"><my-button>Register</my-button></router-link>
      </div>
      <div v-else>
        <router-link to="/admin" v-if="isAdmin"><my-button class="p-2">
          <img src="@/assets/settings.png" height="32" width="32" />
        </my-button></router-link>
        <router-link to="/orders"><my-button class="p-2">
          <img src="@/assets/sent.png" height="32" width="32" />
        </my-button></router-link>
        <router-link to=""><my-button class="p-2" @click="this.$store.commit('basket/setVisibility', true)">
          <img src="@/assets/cart.png" height="32" width="32" />
        </my-button></router-link>
        <router-link to="/"><my-button class="p-2">
          <img src="@/assets/shop.png" height="32" width="32" />
        </my-button></router-link>
        <router-link to="/my/books"><my-button class="p-2">
          <img src="@/assets/book.png" height="32" width="32" />
        </my-button></router-link>
        <router-link to="/account"><my-button class="p-2">
          <img src="@/assets/user.png" height="32" width="32" />
        </my-button></router-link>
        <router-link to="/">
          <my-button
            @click="this.$store.dispatch('logout')"
            class="p-2"
          >
            <img src="@/assets/logout.png" height="32" width="32" />
          </my-button>
        </router-link>
      </div>
    </div>
    <basket></basket>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
export default {
  name: "Navbar",
  computed: {
    ...mapState({
      searchQuery: state => state.book.searchQuery,
      isAdmin: state => state.isAdmin,
      isAuth: state => state.isAuth,
      books: state => state.basket.books
    }),
    isAuth(){
      return JSON.parse(this.$store.state.isAuth)
    },
    goToHome(){
      if(this.$router.currentRoute.value.fullPath === '/')
        this.$router.go()
      else
        this.$router.push('/')
    },
  },
  methods: {
    ...mapActions({
      search: 'book/search'
    }),
    ...mapMutations({
      setSearchQuery: 'book/setSearchQuery'
    }),
  },

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
  height: 62px;
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 10px 15px;
  background-color: rgb(23, 28, 33);
  box-shadow: 2px 5px 5px 5px rgba(23, 28, 33, 1);
  z-index: 100;
}

.navbar__btns{
  margin-left: auto;
}
.navbar__btns, .navbar__btns>div{
  display: flex;
  gap: 10px;
}
my-button{
  background-color: inherit;
}
</style>