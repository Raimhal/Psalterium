import jwt_decode from 'jwt-decode'
import router from "@/router/router";
import {instance} from "@/router/instance";
import {Form} from "vee-validate";

export const userModule = {
    state: () => ({
        users: [],
        user: {},
        defaultRoot: 'users',
        isLoading: false
    }),
    mutations: {
        setUsers(state, users){
            state.users = users
        },
        clearUsers(state){
            state.users = []
        },
        clearUser(state){
            state.user = {}
        },
        setUser(state, user){
            state.user = user
        },
        pushUser(state, user){
            state.users.push(user)
        },
        setDefaultRoot(state, defaultRoot) {
            state.defaultRoot = defaultRoot
        },
        setDefaultUserRoot(state, defaultUserRoot) {
            state.defaultUserRoot = defaultUserRoot
        },
        setLoading(state, bool) {
            state.isLoading = bool
        }
    },
    actions: {
        async register({state, commit, rootState}){
            await commit('setLoading', true)
            rootState.errors = []
            await instance
                .post(state.defaultRoot, state.user)
                .then(response => {
                    state.user.id = response.data
                    commit('pushUser', state.user)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
                .then(() =>{
                    if(rootState.errors.length === 0)
                        router.push('/login')
                })
            await commit('setLoading', false)
        },
        async login({state, dispatch, rootState}){
            const path = `/token`
            const data = new FormData()
            data.append('username', state.user.email)
            data.append('password', state.user.password)
            rootState.errors = []
            await instance
                .post(path, data)
                .then(response =>{
                    rootState.accessToken = response.data.access_token
                    rootState.isAuth = true
                })
                .catch(() => {
                    rootState.errors.push("Incorrect email or password")
                })
                .then(() => {
                    if (rootState.errors.length === 0) {
                        dispatch('decodeRoleFromJWT')
                        router.push('/')
                    }
                })
        },
        async getUserById({state, commit, rootState, rootGetters}, user_id){
            const path = `${state.defaultRoot}/${user_id}`
            await instance
                .get(path, {headers: rootGetters.getHeaders})
                .then(response => {
                    commit('setUser', response.data)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.error)
                })
        },
        async getUserByEmail({state, rootState, rootGetters}, email){
            const path = `${state.defaultRoot}/${email}/email`
            return await instance
                .get(path, {headers: rootGetters.getHeaders})
                .then(response => response.data)
                .catch(error => {
                    rootState.errors.push(error.response.data.error)
                })
        },
        async getUsers({state, commit, rootState, rootGetters}){
            rootState.errors = []
            await instance
                .get(state.defaultRoot, {headers: rootGetters.getHeaders})
                .then(response => {
                    console.log(response.data)
                    response.data.forEach(user => {
                        user.role = user.role_id === 1
                    })
                    commit('setUsers', response.data)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.error)
                })
        },
        async removeUser({state, commit, rootState, rootGetters}, user_id){
            const path = `${state.defaultRoot}/${user_id}/delete`
            await instance
                .delete(path, {headers: rootGetters.getHeaders})
                .then(() =>
                    commit('setUsers',
                        [...state.users]
                            .filter(user => user.id !== user_id )
                    ),
                )
                .catch(error => {
                    rootState.errors.push(error.response.data.error)
                })
        },
        async changeRole({state, rootState, rootGetters}, obj){
            let path = `${state.defaultRoot}/${obj.id}/change_role`
            let role = 'Admin'
            console.log(obj.role)
            if(obj.role === false)
                role = 'User'
            path += `?role_name=${role}`
            await instance
                .patch(path)
                .then(() => console.log('ok'))
                .catch(error => {
                    console.log(error)
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async decodeRoleFromJWT({rootState}){
            const payload = jwt_decode(rootState.accessToken)
            rootState.isAdmin = payload.role === 'Admin';
            rootState.tokenExp = payload.exp
        },
        async GetCurrentUser({state, commit, rootState, rootGetters}){
            await commit('clearUser')
            const path = `${state.defaultRoot}/me`
            await instance
                .get(path, {headers: rootGetters.getHeaders})
                .then(response => {
                    commit('setUser', response.data)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.error)
                })
        },
        async updateUser({state, rootState, rootGetters}){
            const path = `${state.defaultRoot}/${state.user.id}/update`
            rootState.errors = []
            await instance
                .put(path, state.user, {headers: rootGetters.getHeaders})
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
        },
    },
    namespaced: true

}