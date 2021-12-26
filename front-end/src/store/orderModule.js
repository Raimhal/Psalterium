import {instance} from "@/router/instance";


export const orderModule = {
    state: () => ({
        orders: [],
        order: {},
        defaultRoot: 'catalog/orders',
        isLoading: false
    }),
    getters: {

    },
    mutations: {
        setOrders(state, orders){
            state.orders = orders;
        },
        addOrders(state, orders){
            state.orders = [...state.orders, ...orders];
        },
        pushOrder(state, order){
            state.orders.push(order);
        },
        setVisibility(state, bool){
            state.visible = bool
        },
        setLoading(state, bool){
            state.isLoading = bool
        },
        clearOrder(state){
            state.order = {}
        }

    },
    actions: {
        async createOrder({state, commit, rootState, rootGetters}){
            await commit('setLoading', true)
            state.order.deliver_date = new Date(state.order.deliver_date.toLocaleString()).toISOString()
            await instance
                .post(state.defaultRoot, state.order, {headers: rootGetters.getHeaders})
                .then(response => {
                    state.order.id = response.data
                    state.order.books = [...rootState.basket.books]
                    commit('pushOrder', state.order)
                    commit('clearOrder')
                    rootState.basket.books = []
                })
                .catch(error => {
                    console.log(error)
                    rootState.errors.push(error.response.data.detail)
                })
            await commit('setLoading', false)
        },
        async getOrders({state, commit, rootState, rootGetters}){
            await commit('setLoading', true)
            rootState.errors = []
            await instance
                .get(`${state.defaultRoot}/my`, {headers: rootGetters.getHeaders})
                .then(response => {
                    commit('setOrders', response.data)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
            await commit('setLoading', false)
        },
        async removeOrder({state, commit, rootState, rootGetters}, order_id){
            const path = `${state.defaultRoot}/${order_id}/delete`
            await instance
                .delete(path, {headers: rootGetters.getHeaders})
                .then(() =>
                    commit('setOrders',
                        [...state.orders]
                            .filter(order => order.id !== order_id )
                    ),
                )
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
        },
    },
    namespaced: true

}