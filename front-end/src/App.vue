<template>
  <div class="body">
    <navbar></navbar>
    <div class="app">
      <router-view></router-view>
    </div>
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
  font-family: 'Merriweather', serif;
  font-weight: 300;
  color: white;
}
.app{
  padding: 20px;
}

.body{
  min-height: 100vh;
  background-color: rgb(23, 28, 33);
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.form{
  display: flex;
  flex-direction: column;
}

.input {
  padding: 10px 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #292a5c;
}

.user__page{
  display: flex;
  justify-content: center;
}

.user__form{
  width: 400px;
}

.observer{
  height: 30px;
}

.app__btns{
  margin: 15px 0;
  display: flex;
  justify-content:space-between;

}

.page{
  margin: auto;
  width: 70vw;
}

.link{
  color: #7072F7;
  text-decoration: none;
}

</style>