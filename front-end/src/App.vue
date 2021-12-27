<template>
  <div class="body">
    <navbar class="position-fixed w-100"></navbar>
    <div class="app">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    if (Date.now() >= localStorage.getItem('tokenExp') * 1000) {
      this.$store.dispatch('logout')
      this.$swal({
        title: "Oops...",
        text: 'Token expired',
        icon: 'error'
      })
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

::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.app{
  padding: 20px;
  padding-top: 72px;
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
  background-color: inherit;
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
.link{
  color: #7072F7;
  text-decoration: none;
}

.error{
  color: 	#FFF587;
}



.list-item{
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active{
  transition: all 0.7s ease;
}

.list-enter-from,
.list-leave-to{
  opacity: 0;
  transform: translateX(130px);
}

.list-move{
  transition: transform 0.4s ease;
}

</style>