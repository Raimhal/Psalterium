<template>
  <div class="navbar">
    <div class="logo" @click="$router.push('/')"><p>Psalt</p><p class="main">erium</p></div>
    <div class="navbar__btns">
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
export default {
  name: "Navbar",
  computed: {
    isAuth(){
      return JSON.parse(this.$store.state.isAuth)
    }
  }
}
</script>

<style scoped>
.navbar{
  height: 60px;
  background-color: rgba(0, 0, 0, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.78);
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.navbar__btns{
  margin-left: auto;
}
.navbar__btns, .navbar__btns>div{
  display: flex;
  gap: 10px;
}

.logo{
  color: rgb(255, 111, 0);
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
}
.main{
  color: #f30000;
}
</style>