import {instance} from "@/router/instance";
import router from "@/router/router";


export const bookModule = {
    state: () => ({
        books: [],
        book: {},
        isLoading: false,
        selectedSort: 'name',
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
            {value: 'publication_date', name: 'By date'},
        ],
        urlCreator: window.URL || window.webkitURL,
        order: {
            count: 1
        }
    }),
    getters: {
        sortedBooks(state){
            return [...state.books].sort((book1, book2) => book2[state.selectedSort]?.toString().localeCompare(book1[state.selectedSort]))
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
        clearBook(state){
            state.book = {}
        },
        setSearchedMod(state, bool){
            state.searchQuery.searched = bool
        }

    },
    actions: {
        async createBook({state, commit, rootState, rootGetters}) {
            rootState.errors = []
            await instance
                .post(`${state.defaultRoot}`, state.book, {headers: rootGetters.getHeaders})
                .then(response => {
                    state.event.id = response.data
                    commit('pushBook', state.event)
                    commit('clearBook')
                    rootState.errors = []
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.error)
                    router.push('/login')
                })
        },
        async getBookList({state, commit, rootState}) {
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

            console.log(path)
            console.log(params)

            await instance
                .get(path, { params: params })
                .then(res => {
                    console.log(res.data)
                    commit('addBooks', res.data)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.error)
                })
                .then(() => {
                    commit('setLoading', false)
                })
        },
        async getBook({state, commit, rootState, rootGetters}, book_id){
            const path = `${state.defaultRoot}/${book_id}`
            console.log(path)
            rootState.errors = []
            await instance
                .get(path)
                .then(res => {
                    commit('setBook', res.data)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        async updateBook({state, rootState, rootGetters}) {
            rootState.errors = []
            const path = `${state.defaultRoot}/${state.book.id}/update`
            await instance
                .put(path, state.book, {headers: rootGetters.getHeaders})
                .catch(error => {
                    rootState.errors.push(error.response.data.error)
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
    },
    namespaced: true

}