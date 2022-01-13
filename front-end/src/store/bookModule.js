import {instance} from "@/router/instance";
import router from "@/router/router";


export const bookModule = {
    state: () => ({
        books: [],
        book: {},
        isLoading: false,
        isFormLoading: false,
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
        isAll: false
    }),
    getters: {
        sortedBooks(state){
            return state.books
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
        setFormLoading(state, bool){
            state.isFormLoading = bool;
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
            state.searchQuery.searched = false
            state.isAll = false
        },
        clearBooks(state){
            state.books = []
            state.page = 0
            state.isAll = false
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
        },
        setBookCount(state, count){
            state.book.count = count
        },
        setAll(state, bool){
            state.isAll = bool
        },

    },
    actions: {
        async createBook({state, commit, rootState, rootGetters}) {
            await commit('setFormLoading', true)
            rootState.errors = []
            const book = state.book
            book.publication_date = new Date(book.publication_date.toLocaleString()).toISOString()
            await instance
                .post(`${state.defaultRoot}`, book, {headers: rootGetters.getHeaders})
                .then(response => {
                    book.id = response.data
                    book.image = 'default.png'
                    commit('pushBook', book)
                    commit('clearBook')
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
            await commit('setFormLoading', false)
        },
        async getSortedBookList({state, commit, rootState, rootGetters}, owner) {
            if(!state.isAll) {
                if (state.books.length === 0) {
                    commit('setLoading', true)
                }
                state.page += 1

                let path = `${state.defaultRoot}`
                let params = {
                    skip: (state.page - 1) * state.limit,
                    limit: state.limit,
                    query: state.selectedSort,
                    reverse: state.reverseSort.value,
                    genre: rootState.genre.selectedSort
                }


                if (state.searchQuery.searched) {
                    path += '/search'
                    params.searchQuery = state.searchQuery.value
                }

                const config = {params: params}
                if (owner === true) {
                    path += '/my'
                    config.headers = rootGetters.getHeaders
                }

                await instance
                    .get(path, config)
                    .then(async response => {
                        if(response.data.length === 0)
                            commit('setAll', true)
                        await response.data.forEach(async book => {
                            if (state.books.filter(b => b.id === book.id).length === 0)
                                commit('pushBook', book)
                        })
                    })
                    .catch(error => {
                        rootState.errors.push(error.response.data.detail)
                    })
                await commit('setLoading', false)
            }
        },

        async getBook({state, commit, rootState}, book_id){
            const path = `${state.defaultRoot}/${book_id}`
            rootState.errors = []

            await instance
                .get(path)
                .then(response => {
                    response.data.publication_date = new Date(response.data.publication_date).toISOString().split('T')[0]
                    response.data.update_date = new Date(response.data.update_date).toISOString().split('T')[0]
                    commit('setBook', response.data)
                })
                .catch(error => {
                    if (error.response.status === 404)
                        router.push({name: 'NotFound'})
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async updateBook({state, commit, rootState, rootGetters}) {
            await commit('setFormLoading', true)
            rootState.errors = []
            const book = {...state.book}
            book.publication_date = new Date(book.publication_date.toLocaleString()).toISOString()
            const path = `${state.defaultRoot}/${book.id}/update`
            await instance
                .put(path, book, {headers: rootGetters.getHeaders})
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
            await commit('setFormLoading', false)
        },
        async removeBook({state, commit, rootState, rootGetters}, book_id){
            const path = `${state.defaultRoot}/${book_id}/delete`
            await instance.delete(path, {headers: rootGetters.getHeaders})
                .then(() => {
                    commit('setBooks', state.books.filter(x => x.id !== book_id ))
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async getBookImage({state, commit, rootState}, obj){
            const path = `${state.defaultRoot}/image`
            const image_name = obj.image_name
            const target = obj.target
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
                    commit('setImage', response.data)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
            await commit('setLoading', false)
        },
        async changeGenres({state, commit, rootGetters}, genres){
            await commit('setLoading', true)
            const path = `${state.defaultRoot}/${state.book.id}/set_genres`

            const entity = []
            genres.forEach(genre => { entity.push({name: genre}) })
            await instance
                .patch(path, entity, {headers: rootGetters.getHeaders})
                .then(() => commit('setGenres', entity))
                .catch(error => {
                    console.log(error)
                })
            await commit('setLoading', false)
        },

    },
    namespaced: true

}