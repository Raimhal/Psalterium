import jwt_decode from 'jwt-decode'
import router from "@/router/router";
import {instance} from "@/router/instance";
import {Form} from "vee-validate";

export const userModule = {
    state: () => ({
        users: [],
        user: {},
        defaultRoot: 'users',
        isLoading: false,
        page: 0,
        limit: 10,
        isAll: false
    }),
    mutations: {
        setUsers(state, users){
            state.users = users
        },
        clearUsers(state){
            state.users = []
            state.page = 0
            state.isAll = false
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
        },
        setAll(state, bool){
            state.isAll = bool
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
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async getUserByEmail({state, rootState, rootGetters}, email){
            const path = `${state.defaultRoot}/${email}/email`
            return await instance
                .get(path, {headers: rootGetters.getHeaders})
                .then(response => response.data)
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async getUsers({state, commit, rootState, rootGetters}){
            if(!state.isAll) {
                rootState.errors = []
                state.page += 1
                await instance
                    .get(state.defaultRoot, {
                        params: {
                            skip: (state.page - 1) * state.limit,
                            limit: state.limit
                        },
                        headers: rootGetters.getHeaders
                    })
                    .then(response => {
                        if(response.data.length === 0)
                            commit('setAll', true)
                        response.data.forEach(user => {
                            user.role = user.role_id === 1
                            commit('pushUser', user)
                        })
                    })
                    .catch(error => {
                        rootState.errors.push(error.response.data.detail)
                    })
            }
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
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async changeRole({state, rootState, rootGetters}, obj){
            let path = `${state.defaultRoot}/${obj.id}/change_role`
            let role = 'Admin'
            if(obj.role === false)
                role = 'User'
            path += `?role_name=${role}`
            await instance
                .patch(path)
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
        async getCurrentUser({state, commit, rootState, rootGetters}){
            await commit('clearUser')
            const path = `${state.defaultRoot}/me`
            await instance
                .get(path, {headers: rootGetters.getHeaders})
                .then(response => {
                    commit('setUser', response.data)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
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