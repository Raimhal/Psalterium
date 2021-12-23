import {instance} from "@/router/instance";
import router from "@/router/router";


export const bookModule = {
    state: () => ({
        books: [],
        book: {},
        isLoading: false,
        selectedSort: 'name',
        reverseSort: {
            value: false
        },
        searchQuery: {
            value: "",
            searched: false
        },
        page: 0,
        limit: 10,
        defaultRoot: 'catalog/books',
        sortOptions: [
            {value: 'name', name: 'By name'},
            {value: 'author', name: 'By author'},
            {value: 'price', name: 'By price'},
            {value: 'count', name: 'By count'},
            {value: 'publication_date', name: 'By date'},
        ],
        urlCreator: window.URL || window.webkitURL,
        order: {
            count: 1
        }
    }),
    getters: {
        sortedBooks(state){
            const query = state.selectedSort

            let books
            if(query === 'count' || query === 'price')
                books = [...state.books].sort((book1, book2) => book1[state.selectedSort] - book2[state.selectedSort])
            else
                books = [...state.books].sort((book1, book2) => book2[query]?.toString().localeCompare(book1[query]))

            if(state.reverseSort.value)
                books.reverse()
            return books
        },
    },
    mutations: {
        setBooks(state, books){
            state.books = books;
        },
        addBooks(state, books){
            state.books = [...state.books, ...books];
        },
        setBook(state, book){
            state.book = book
        },
        pushBook(state, book){
            state.books.push(book);
        },
        setLoading(state, bool){
            state.isLoading = bool;
        },
        setSelectedSort(state, selectedSort){
            state.selectedSort = selectedSort;
        },
        setSearchQuery(state, searchQuery){
            state.searchQuery = searchQuery;
        },
        setDefaultRoot(state, defaultRoot){
            state.defaultRoot = defaultRoot
        },
        setSortedBooks(state, sortedBooks){
            state.sortedEvents = sortedBooks
        },
        clearBookStore(state){
            state.books = []
            state.page = 0
        },
        clearBook(state) {
            state.book = {}
        },
        setSearchedMod(state, bool){
            state.searchQuery.searched = bool
        },
        setImage(state, image){
            state.book.image = image
        },
        setGenres(state, genres){
            state.book.genres = genres
        },
        setReverseSort(state, bool){
            state.reverseSort = bool
        }

    },
    actions: {
        async createBook({state, commit, rootState, rootGetters}) {
            rootState.errors = []
            const book = state.book
            book.publication_date = new Date(book.publication_date.toLocaleString()).toISOString()
            await instance
                .post(`${state.defaultRoot}`, book, {headers: rootGetters.getHeaders})
                .then(()=> {
                    commit('clearBook')
                    router.go()
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async getBookList({state, commit, rootState, rootGetters}, owner) {
            if(state.books.length === 0)
                commit('setLoading', true)
            state.page += 1

            let path = `${state.defaultRoot}`
            let params = {
                skip: (state.page - 1) * state.limit,
                take: state.limit
            }

            if(state.searchQuery.searched) {
                path += '/search'
                params.query = state.searchQuery.value
            }

            const config = { params: params }
            if(owner === true) {
                path += '/my'
                config.headers = rootGetters.getHeaders
            }

            console.log(config)

            await instance
                .get(path, config)
                .then(res => {
                    console.log(res.data)
                    commit('addBooks', res.data)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
                .then(() => {
                    commit('setLoading', false)
                })
        },
        async getBook({state, commit, rootState}, book_id){
            const path = `${state.defaultRoot}/${book_id}`
            console.log(path)
            rootState.errors = []

            await instance
                .get(path)
                .then(res => {
                    res.data.publication_date = new Date(res.data.publication_date).toISOString().split('T')[0]
                    res.data.update_date = new Date(res.data.update_date).toISOString().split('T')[0]
                    commit('setBook', res.data)

                })
                .catch(error => {
                    console.log(error)
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async updateBook({state, rootState, rootGetters}) {
            rootState.errors = []
            const book = state.book
            book.publication_date = new Date(book.publication_date.toLocaleString()).toISOString()
            const path = `${state.defaultRoot}/${state.book.id}/update`
            await instance
                .put(path, book, {headers: rootGetters.getHeaders})
                .then(() => router.go())
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async removeBook({state, commit, rootState, rootGetters}, book_id){
            const path = `${state.defaultRoot}/${book_id}/delete`
            await instance.delete(path, {headers: rootGetters.getHeaders})
                .then(() => {
                    commit('setBooks', state.books.filter(x => x.id !== book_id ))
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.error)
                })
        },
        async getBookImage({state, commit, rootState}, obj){
            const path = `${state.defaultRoot}/image`
            const image_name = obj.image_name
            const target = obj.target
            console.log(obj)
            if(obj.image_name !== undefined) {
                await instance
                    .get(path, {
                        responseType: 'blob',
                        params: {name: image_name}
                    })
                    .then(response => {
                        const blob = new Blob(
                            [response.data],
                            {
                                type: response.headers['content-type']
                            })
                        const url = state.urlCreator.createObjectURL(blob)
                        target.setAttribute('src', url);
                    })
                    .catch(error => {
                        console.log(error)
                        rootState.errors.push(error)
                    })
            }
        },
        async changeBookImage({state, commit, rootState}){
            await commit('setLoading', true)
            rootState.errors = []
            const form = new FormData(document.querySelector('#uploadForm'))
            const path = `${state.defaultRoot}/${state.book.id}/change_image`

            await instance
                .patch(path, form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${rootState.accessToken}`,
                    }})
                .then(response => {
                    console.log(response)
                    commit('setImage', response.data)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
            await commit('setLoading', false)
        },
        async addToBasket({state, rootState, rootGetters} ){
            const path = 'catalog/basket'
            const order = {
                count: state.order.count,
                book_id: state.book.id
            }
            if(state.book.count > 0) {
                await instance
                    .post(path, order, {headers: rootGetters.getHeaders})
                    .then(response => {
                        console.log(response)
                        state.book.count -= order.count
                    })
                    .catch(error => {
                        console.log(error)
                        rootState.errors.push(error)
                    })
            }
        },
        async changeGenres({state, commit, rootGetters}, genres){
            const path = `${state.defaultRoot}/${state.book.id}/set_genres`

            const entity = []
            genres.forEach(genre => { entity.push({name: genre}) })
            await instance
                .patch(path, entity, {headers: rootGetters.getHeaders})
                .then(() => commit('setGenres', entity))
                .catch(error => {
                    console.log(error)
                })
        }

    },
    namespaced: true

}