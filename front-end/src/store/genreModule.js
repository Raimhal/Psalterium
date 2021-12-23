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

    },
    namespaced: true

}