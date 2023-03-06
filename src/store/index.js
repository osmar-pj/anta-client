import { createStore } from 'vuex'
import { auth, get, post, putId, deleteId } from '../help/require'
import { getLocalUser } from '../help/require'

const user = getLocalUser()

const store = createStore({
    state() {
        return {
            status: '',
            user : user,
            loading: false,
            mac: null,
            place: null,
            device: null
        }
    },
    mutations: {
        request(state){
            state.status = 'loading'
        },
        auth_success(state, user){
            state.status = 'success'
            state.user = user
        },
        auth_error(state){
            state.status = 'error'
        },
        logout(state){
            state.status = ''
            state.user = null
        },
        saveMac(state, mac){
            state.mac = mac
        },
        savePlace(state, place){
            state.place = place
        },
        saveDevice(state, device){
            state.device = device
        }
    },
    actions: {
        login({commit}, data){
            return new Promise((resolve, reject) => {
                commit('request')
                auth('signin', data)
                .then(res => {
                    const user = Object.assign({}, res)
                    localStorage.setItem('user', JSON.stringify(user))
                    commit('auth_success', res)
                    resolve(res)
                })
                .catch(err => {
                    commit('auth_error')
                    localStorage.removeItem('user')
                    reject(err)
                })
            })
        },
        register({commit}, data){
            return new Promise((resolve, reject) => {
                commit('request')
                auth('signup', data)
                .then(resp => {
                    const token = resp.data.accessToken
                    const user = resp.data.user
                    localStorage.setItem('token', token)
                    axios.defaults.headers.common['Authorization'] = token
                    commit('auth_success', token, user)
                    resolve(resp)
                })
                .catch(err => {
                    commit('auth_error', err)
                    localStorage.removeItem('token')
                    reject(err)
                })
            })

        },
        logout({commit}){
            return new Promise((resolve) => {
                commit('logout')
                localStorage.removeItem('user')
                resolve()
            }
            )
        },
        get({commit}, data){
            return new Promise((resolve, reject) => {
                commit('request')
                get(data.route)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    commit('auth_error')
                    // localStorage.removeItem('user')
                    reject(err)
                })
            })
        },
        post({commit}, data){
            return new Promise((resolve, reject) => {
                commit('request')
                post(data.route, data.data)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    commit('auth_error')
                    // localStorage.removeItem('user')
                    reject(err)
                })
            })
        },
        getId({commit}, data){
            return new Promise((resolve, reject) => {
                commit('request')
                get(data.route, data.id)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    commit('auth_error')
                    // localStorage.removeItem('user')
                    reject(err)
                })
            })
        },
        putId({commit}, data){
            return new Promise((resolve, reject) => {
                commit('request')
                putId(data.route, data.data, data.id)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    commit('auth_error')
                    // localStorage.removeItem('user')
                    reject(err)
                })
            })
        },
        deleteId({commit}, data){
            return new Promise((resolve, reject) => {
                commit('request')
                deleteId(data.route, data.id)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    commit('auth_error')
                    // localStorage.removeItem('user')
                    reject(err)
                })
            })
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        authUser: state => state.user
    }
})

export default store