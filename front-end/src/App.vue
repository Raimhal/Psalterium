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
        title: "<span style='color: #ffffff'>Oops...</span>",
        icon: 'warning',
        html: "<span style='color: #ffffff'>Token expired</span>"
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
html{
  background-color: rgb(23, 28, 33);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Merriweather', serif;
  font-weight: 300;
  color: white;
}
::-webkit-scrollbar-track
{
  border-radius: 50%;
}

::-webkit-scrollbar
{
  width: 0.5em;
  height: 0.5em;
}

::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  background-color: rgba(56, 58, 73, 0.9);
}

.app{
  padding: 20px;
  padding-top: 72px;
}

.body{
  min-height: 100vh;
  min-width: fit-content;
  background-color: rgb(23, 28, 33);
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

._table {
  border-collapse: collapse;
  width: 100%;
  min-width: 800px;
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
  max-width: 400px;
  width: 85vw;
}

.observer{
  height: 30px;
}

.app__btns{
  display: flex;
  justify-content:space-between;
  gap: 0.3rem

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