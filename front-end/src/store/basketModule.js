import {instance} from "@/router/instance";


export const basketModule = {
    state: () => ({
        books: [],
        visible: false,
        isLoading: false,
        page: 0,
        limit: 5,
        defaultRoot: 'catalog/basket',
        order: {count: 1},
        isAll: false
    }),
    getters: {
        getTotalSum(state){
            if(state.books.length > 0)
                return ([...state.books]
                .map(book => book.price * book.order_count))
                .reduce((previous, next) => previous + next)
        }
    },
    mutations: {
        setBooks(state, books){
            state.books = books;
        },
        addBooks(state, books){
            state.books = [...state.books, ...books];
        },
        pushBook(state, book){
            state.books.push(book);
        },
        setVisibility(state, bool){
            if(!bool) {
                state.books = []
                state.page = 0
                state.isAll = false
            }
            state.visible = bool
        },
        clearBasket(state) {
            state.books = []
            state.isAll = false
            state.page = 0
        },
        setLoading(state, bool){
            state.isLoading = bool
        },
        setAll(state, bool){
            state.isAll = bool
        },


    },
    actions: {
        async addToBasket({state, commit, rootState, rootGetters}, book){
            commit('setLoading', true)
            const order = {
                count: state.order.count,
                book_id: book.id
            }
            if(book.count > 0) {
                const count = {...book}.count - order.count
                await instance
                    .post(state.defaultRoot, order, {headers: rootGetters.getHeaders})
                    .catch(error => {
                        console.log(error)
                        rootState.errors.push(error)
                    })
                    .then(() => {
                        if(rootState.errors.length === 0)
                            rootState.book.book.count = count
                    })
            }
            commit('setLoading', false)
        },
        async getBasketBooks({state, commit, dispatch, rootState, rootGetters}, isAdmin=false){
            if(!state.isAll) {
                if(state.books.length === 0) {
                    state.page = 0
                    await commit('setLoading', true)
                }
                rootState.errors = []
                state.page += 1
                let params = {
                    skip: (state.page - 1) * state.limit,
                    limit: state.limit
                }
                const config = {params: params}
                config.headers = rootGetters.getHeaders
                await instance
                    .get(state.defaultRoot, config)
                    .then(response => {
                        if(response.data.length === 0 && state.page !== 1)
                            commit('setAll', true)
                        response.data.forEach(async orderBook => {
                            const book = await dispatch('getBook', orderBook.book_id)
                            book.id = orderBook.id
                            book.book_id = orderBook.book_id
                            book.order_count = orderBook.count
                            await commit('pushBook', book)
                        })
                    })
                    .catch(error => {
                        rootState.errors.push(error.response.data.detail)
                    })
                await commit('setLoading', false)
            }
        },
        async getBook({state, commit, rootState}, book_id){
            const path = `catalog/books/${book_id}/dto`
            rootState.errors = []

            return await instance
                .get(path)
                .then(res => res.data)
                .catch(error => {
                    console.log(error)
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async removeFromBasket({state, commit, rootState, rootGetters}, obj){
            const path = `${state.defaultRoot}/${obj.id}/delete`
            await instance.delete(path, {headers: rootGetters.getHeaders})
                .then(() => {
                    rootState.book.book.count = +rootState.book.book.count + +obj.count
                        commit('setBooks', state.books.filter(x => x.id !== obj.id ))
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
        }

    },
    namespaced: true

}