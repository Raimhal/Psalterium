import {instance} from "@/router/instance";


export const basketModule = {
    state: () => ({
        books: [],
        visible: false,
        isLoading: false,
        page: 0,
        limit: 50,
        defaultRoot: 'catalog/basket',
        order: {count: 1}
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
            }
            state.visible = bool
        },
        clearBasket(state) {
            state.books = []
        }


    },
    actions: {
        async addToBasket({state, commit, rootState, rootGetters}, book){
            console.log(state.order.count)
            const order = {
                count: state.order.count,
                book_id: book.id
            }
            if(book.count > 0) {
                book.count -= order.count
                await instance
                    .post(state.defaultRoot, order, {headers: rootGetters.getHeaders})
                    .then(response => {
                        commit('book/setBookCount', book.count, {root: true})
                        const _book = {...book}
                        _book.id = response.data
                        _book.book_id = book.id
                        if(state.books.filter(b => b.book_id === _book.book_id).length === 0) {
                            _book.order_count = order.count
                            commit('pushBook', _book)
                        }
                        else {
                            const index = state.books.findIndex(b => b.book_id === _book.book_id)
                            state.books[index].order_count = +state.books[index].order_count + +order.count
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        rootState.errors.push(error)
                    })
            }
        },
        async getBasketBooks({state, commit, dispatch, rootState, rootGetters}){
            rootState.errors = []
            state.page += 1
            let params = {
                skip: (state.page - 1) * state.limit,
                limit: state.limit
            }
            const config = { params: params }
            config.headers = rootGetters.getHeaders
            await instance
                .get(state.defaultRoot, config)
                .then(async response => {
                    await response.data.forEach(async orderBook => {
                        const book = await dispatch('getBook', orderBook.book_id)
                        book.id = orderBook.id
                        book.book_id = orderBook.book_id
                        book.order_count = orderBook.count
                        if(state.books.filter(b => b.book_id === book.book_id).length === 0) {
                            commit('pushBook', book)
                        }
                        else {
                            const index = state.books.findIndex(b => b.book_id === book.book_id)
                            state.books[index].order_count += book.order_count
                        }
                    })
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
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
        async removeFromBasket({state, commit, rootState, rootGetters}, book_id){
            const path = `${state.defaultRoot}/${book_id}/delete`
            await instance.delete(path, {headers: rootGetters.getHeaders})
                .then(() => {
                    commit('setBooks', state.books.filter(x => x.id !== book_id ))
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
        }

    },
    namespaced: true

}