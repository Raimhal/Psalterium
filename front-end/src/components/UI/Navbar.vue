<template>
  <div class="navbar flex-nowrap d-flex gap-2">
    <div @click="goToHome">
      <div class="logo">PSALT<span>ERIUM</span>
      </div>
    </div>
    <div class="navbar__btns">
      <div v-show="this.currentRoute() === '/'">
        <my-search />
      </div>
      <my-button class="p-2" @click="showSidebar">
        <img src="@/assets/menu.png" height="20" width="20"/>
      </my-button>
      <my-dialog v-model:show="sidebarVisible">
        <div class="sidebar bg-gradient p-3 gap-2 d-flex flex-column h-100" @click="sidebarVisible = false">
          <router-link to="/">
            <my-button class="p-2" :class="{'target':this.currentRoute() === '/'}">
              <img src="@/assets/shop.png" height="32" width="32" />
            </my-button>
            <span>Shop</span>
          </router-link>
          <div v-if="!isAuth">
            <router-link to="/login">
              <my-button class="p-2" :class="{'target':this.currentRoute() === '/login'}">
                <img src="@/assets/login.png" height="32" width="32"/>
              </my-button>
              <span>Log in</span>
            </router-link>
            <router-link to="/register">
              <my-button class="p-2" :class="{'target':this.currentRoute() === '/register'}">
                <img src="@/assets/personal.png" height="32" width="32"/>
              </my-button>
              <span>Register</span>
            </router-link>
          </div>
          <div v-else>
            <router-link to="/admin" v-show="isAdmin">
              <my-button class="p-2" :class="{'target':this.currentRoute() === '/admin'}">
                <img src="@/assets/settings.png" height="32" width="32" />
              </my-button>
              <span>Admin</span>
            </router-link>
            <router-link to="/my/books">
              <my-button class="p-2" :class="{'target':this.currentRoute() === '/my/books'}">
                <img src="@/assets/book.png" height="32" width="32" />
              </my-button>
              <span>Your books</span>
            </router-link>
            <router-link to="/orders">
              <my-button class="p-2" :class="{'target':this.currentRoute() === '/orders'}">
                <img src="@/assets/sent.png" height="32" width="32" />
              </my-button>
              <span>Orders</span>
            </router-link>
            <router-link to="" @click="this.$store.commit('basket/setVisibility', true)">
              <my-button class="p-2">
                <img src="@/assets/cart.png" height="32" width="32" />
              </my-button>
              <span>Cart</span>
            </router-link>
            <router-link to="/account">
              <my-button class="p-2" :class="{'target':this.currentRoute() === '/account'}">
                <img src="@/assets/user.png" height="32" width="32" />
              </my-button>
              <span>Account</span>
            </router-link>
            <router-link to="/login" @click="this.$store.dispatch('logout')">
              <my-button
                  class="p-2"
              >
                <img src="@/assets/logout.png" height="32" width="32" />
              </my-button>
              <span>Log out</span>
            </router-link>
          </div>
        </div>
      </my-dialog>
    </div>
    <basket>
      <template v-slot:image>
        <img src="@/assets/cart_negate.png" height="32" width="32" class="mb-2"/>
      </template>
    </basket>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
export default {
  name: "Navbar",
  data(){
    return{
      sidebarVisible: false
    }
  },
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
      if(this.currentRoute() === '/')
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
    currentRoute(){return this.$router.currentRoute.value.fullPath},
    showSidebar(){this.sidebarVisible = true}
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
  font-size: inherit;
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

button.target{
  background-color: white;
  color: #292a5c;
  padding: 8px;
}

.sidebar{
  background-color: rgba(56, 58, 73, 0.8);
  width: 250px;
  height: 100vh;
  position: absolute;
  right: 0;
  top: 0;
}
.sidebar>div{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

}
a{
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 1rem;
}

span{
  font-size: 14px;
}


</style>