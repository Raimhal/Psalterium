<template>
  <navbar></navbar>
  <div class="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  mounted() {
    console.log('show')
    console.log()
    if (Date.now() >= localStorage.getItem('tokenExp') * 1000) {
      this.$store.dispatch('logout')
      this.$store.errors.push('Token expired')
    }
    else if(JSON.parse(localStorage.getItem('isAuth'))){
      this.$store.commit('setToken', localStorage.getItem('accessToken'))
      this.$store.commit('setAuth', JSON.parse(localStorage.getItem('isAuth')))
      this.$store.commit('setAdmin', JSON.parse(localStorage.getItem('isAdmin')))
      this.$store.commit('setExp', JSON.parse(localStorage.getItem('tokenExp')))
    }
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'M PLUS 1', sans-serif;
  font-weight: 400;
}
body{
  background-color: rgba(0, 0, 0, 0.92);
}

.app{
  padding: 20px;
}
.user__form{
  color: rgb(255, 153, 0);
}
.error{
  color: rgba(255, 0, 0, 0.94);
  font-size: 14px;
}

.link{
  text-decoration: none;
}
.link:hover{
  text-decoration: underline;
}
</style>