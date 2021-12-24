import {instance} from "@/router/instance";
import router from "@/router/router";


export const genreModule = {
    state: () => ({
        genres: [],
        genre: {},
        page: 0,
        limit: 100,
        defaultRoot: 'catalog/genres',
    }),
    mutations: {
        setGenres(state, genres){
            state.genres = genres;
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
        }
    },
    actions: {
        async getGenres({state, commit, rootState}){
            rootState.errors = []
            let params = {
                skip: 0,
                limit: state.limit
            }
            const config = { params: params }
            await instance
                .get(state.defaultRoot, config)
                .then(response => {
                    commit('setGenres', response.data)
                })
                .catch(error => {
                    rootState.errors.push(error.response.data.detail)
                })
        },
        async createGenre({state, commit, rootState, rootGetters}){
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