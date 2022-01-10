import {instance} from "@/router/instance";
import router from "@/router/router";


export const genreModule = {
    state: () => ({
        genres: [],
        genre: {},
        page: 0,
        limit: 10,
        defaultRoot: 'catalog/genres',
        isAll: false,
        isLoading: false,
        selectedSort: 'all',
        sortOptions: [
            {value: 'all', name: 'All'},
        ],
    }),
    mutations: {
        setGenres(state, genres){
            state.genres = genres;
        },
        addGenres(state, genres){
            state.genres = [...state.genres, ...genres];
        },
        setGenre(state, genre){
            state.genre = genre;
        },
        pushGenre(state, genre){
            state.genres.push(genre);
        },
        setLoading(state, bool){
            state.isLoading = bool;
        },
        setDefaultRoot(state, defaultRoot){
            state.defaultRoot = defaultRoot
        },
        clearGenre(state){
            state.genre = {}
        },
        setAll(state, bool){
            state.isAll = bool
        },
        clearGenreStore(state){
            state.genres = []
            state.page = 0
            state.isAll = false
        },
        setSortedOptions(state, options){
            state.sortOptions = [...state.sortOptions,...options]
        },
        pushOption(state, option){
            state.sortOptions.push(option)
        },
        setSelectedSort(state, selectedSort){
            state.selectedSort = selectedSort;
        },
    },
    actions: {
        async getGenres({state, commit, rootState}, isAdmin = false){
            if(!state.isAll) {
                rootState.errors = []
                state.page += 1
                let params = {
                    skip: (state.page - 1) * state.limit,
                    limit: state.limit
                }
                const config = {params: params}
                await instance
                    .get(state.defaultRoot, config)
                    .then(response => {
                        if(response.data.length === 0)
                            commit('setAll', true)
                        commit('addGenres', response.data)
                    })
                    .catch(error => {
                        rootState.errors.push(error.response.data.detail)
                    })
            }
        },
        async getAllGenres({state, commit, rootState}){
            if(state.sortOptions.length === 1) {
                rootState.errors = []
                const path = `${state.defaultRoot}/all`
                await instance
                    .get(path)
                    .then(response => {
                        response.data.forEach(genre => {
                            const option = {value: genre.name, name: genre.name}
                            commit('pushOption', option)
                        })
                    })
                    .catch(error => {
                        rootState.errors.push(error.response.data.detail)
                    })
            }
        },
        async createGenre({state, commit, rootState, rootGetters}){
            await commit('setLoading', true)
            rootState.errors = []
            await instance
                .post(state.defaultRoot, state.genre, {headers: rootGetters.getHeaders})
                .then(response => {
                    state.genre.id = response.data
                    commit('pushGenre', state.genre)
                    commit('clearGenre')
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
            await commit('setLoading', false)
        },
        async updateGenre({state, rootState, rootGetters}){
            rootState.errors = []
            const path = `${state.defaultRoot}/${state.genre.id}/update`
            await instance
                .put(path, state.genre, {headers: rootGetters.getHeaders})
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async removeGenre({state, commit, rootState, rootGetters}, genre_id){
            const path = `${state.defaultRoot}/${genre_id}/delete`
            await instance
                .delete(path, {headers: rootGetters.getHeaders})
                .then(() =>
                    commit('setGenres',
                        [...state.genres]
                            .filter(genre => genre.id !== genre_id )
                    ),
                )
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
        },

    },
    namespaced: true

}