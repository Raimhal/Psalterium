import {instance} from "@/router/instance";


export const orderModule = {
    state: () => ({
        orders: [],
        order: {},
        defaultRoot: 'catalog/orders',
        isLoading: false,
        page: 0,
        limit: 10,
        isAll: false
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
        },
        setAll(state, bool){
            state.isAll = bool
        },
        clearOrderStore(state){
            state.orders = []
            state.isAll = false
            state.page = 0
        }

    },
    actions: {
        async createOrder({state, commit, rootState, rootGetters}){
            await commit('setLoading', true)
            state.order.deliver_date = new Date(state.order.deliver_date.toLocaleString()).toISOString()
            await instance
                .post(state.defaultRoot, state.order, {headers: rootGetters.getHeaders})
                .then(response => {
                    const order = {...state.order}
                    order.id = response.data
                    order.books = [...rootState.basket.books]
                    commit('pushOrder', order)
                    commit('clearOrder')
                    rootState.basket.books = []
                })
                .catch(error => {
                    console.log(error)
                    rootState.errors.push(error.response.data.detail)
                })
            await commit('setLoading', false)
        },
        async getOrders({state, commit, rootState, rootGetters}, isAdmin){
            if(!state.isAll) {
                await commit('setLoading', true)
                let path = state.defaultRoot
                state.page += 1
                const params =
                    {
                        skip: (state.page - 1) * state.limit,
                        limit: state.limit
                    }

                if (!isAdmin)
                    path += '/my'
                rootState.errors = []
                await instance
                    .get(path, {
                        params: params,
                        headers: rootGetters.getHeaders
                    })
                    .then(response => {
                        if(response.data.length === 0)
                            commit('setAll', true)

                        response.data.forEach(order => {
                            if (state.orders.filter(o => o.id === order.id).length === 0) {
                                order.books.forEach(book => book.order_count = book.count)
                                commit('pushOrder', order)
                            }
                        })
                    })
                    .catch(error => {
                        rootState.errors.push(error.response.data.detail)
                    })
                await commit('setLoading', false)
            }
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