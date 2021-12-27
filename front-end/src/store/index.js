import {createStore} from 'vuex'
import {userModule} from "./userModele"
import {bookModule} from "./bookModule"
import {genreModule} from "./genreModule"
import {basketModule} from "./basketModule";
import {orderModule} from "./orderModule";

export default createStore({
  state: {
    isAuth: false,
    isAdmin: false,
    accessToken: '',
    errors: [],
    tokenExp: null,
  },
  mutations: {
    setToken(state, access){
      state.accessToken = access
    },
    setAuth(state, bool) {
      state.isAuth = bool
    },
    setAdmin(state, bool){
      state.isAdmin = bool
    },
    setExp(state, exp){
      state.tokenExp = exp
    },
    clearErrors(state){
      state.errors = []
    }
  },
  getters: {
    getHeaders(state){
      return {
        Authorization: `Bearer ${state.accessToken}`,
      }
    },

  },
  actions: {
    async logout({state}){
      state.accessToken = ''
      state.isAuth = false
      state.isAdmin = false
      state.tokenExp = null
      state.errors = []
      localStorage.accessToken = state.accessToken
      localStorage.isAuth = state.isAuth
      localStorage.isAdmin = state.isAdmin
      localStorage.tokenExp = state.tokenExp
      localStorage.user_id = null
    },
  },

  modules: {
    user: userModule,
    book: bookModule,
    genre: genreModule,
    basket: basketModule,
    order: orderModule
  }
})