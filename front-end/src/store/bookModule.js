import {instance} from "@/router/instance";
import router from "@/router/router";


export const bookModule = {
    state: () => ({
        books: [],
        book: {
            name: "",
            author: "",
            content: "",
            price: "",
            count: 1,
            publication_date: null,
            ISBN: ""
        },
        isLoading: false,
        selectedSort: 'name',
        searchQuery: '',
        page: 0,
        limit: 10,
        defaultRoot: 'catalog/books',
        sortOptions: [
            {value: 'name', name: 'By name'},
            {value: 'author', name: 'By author'},
            {value: 'price', name: 'By price'},
            {value: 'publication_date', name: 'By date'},
        ],
    }),
    getters: {
        sortedBooks(state){
            return [...state.books].sort((book1, book2) => book2[state.selectedSort]?.toString().localeCompare(book1[state.selectedSort]))
        },
        sortedAndSearchedBooks(state, getters){
            return getters.sortedBooks.filter(e =>
                e.name.toLowerCase().includes(state.searchQuery.toLowerCase()))
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
            state.book = book;
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
            state.book = {
                name: "",
                author: "",
                content: "",
                price: "",
                count: 1,
                publication_date: null,
                ISBN: ""
            }
        },

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
            const path = `${state.defaultRoot}`
            await instance
                .get(path, {
                    params: {
                        skip: (state.page - 1) * state.limit,
                        take: state.limit
                    },
                })
                .then(res => {
                    console.log(res.data)
                    commit('addBooks', res.data)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.error)
                })
                .then(() => {
                    commit('setLoading', false)
                    if(rootState.errors.length !== 0)
                        router.push('/login')
                })
        },
        async getBook({state, commit, rootState, rootGetters}, book_id){
            const path = `${state.defaultRoot}/${book_id}`
            rootState.errors = []
            await instance
                .get(path)
                .then(res => {
                    commit('setBook', res.data)
                })
                .catch(error => {
                    console.log(error)
                    if(error.headers.status === 401) {
                        router.push('/login')
                    }
                    else
                        router.back()
                })
            return state.book
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
        async getBookImage({state}, image_name){
            const path = `${state.defaultRoot}/image`
            return await instance
                .get(path, {
                    responseType: 'blob',
                    params: {name: image_name}
                })
                .then(async response => {
                    return await new Blob(
                        [response.data],
                        {
                            type: response.headers['content-type']
                        })
                })
                .catch(error => {
                    rootState.errors.push(error)
                })
        }
    },
    namespaced: true

}