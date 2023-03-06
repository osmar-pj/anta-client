import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/login', component: () => import('../auth/Login.vue')},
        { path: '/register', component: () => import('../auth/Register.vue')},
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') },
        { 
            path: '/', 
            name: 'Home', 
            component: () => import('../views/Home.vue'), 
            meta: { requireAuth: true },
            children: [
                { path: '/', name: 'Main', component: () => import('../views/Main.vue')},

                { path: '/horometer', name: 'Horometer', component: () => import('../views/antamina/Horometer.vue'), meta: { requireAuth: true } },
                { path: '/hydragen', name: 'Hydragen', component: () => import('../views/antamina/Hydragen.vue'), meta: { requireAuth: true } },
                { path: '/dispatch', name: 'Dispatch', component: () => import('../views/antamina/Dispatch.vue'), meta: { requireAuth: true } },
                { path: '/fuel', name: 'Fuel', component: () => import('../views/antamina/Fuel.vue'), meta: { requireAuth: true } },

                { path: '/users', name: 'User', component: () => import('../views/user/List.vue'), meta: { requireAuth: true } },
                { path: '/parameters', name: 'Parameter', component: () => import('../views/parameter/List.vue'), meta: { requireAuth: true } },
                { path: '/parameters/new', name: 'ParameterCreate', component: () => import('../views/parameter/New.vue'), meta: { requireAuth: true } },
                { path: '/devices', name: 'Device', component: () => import('../views/device/List.vue'), meta: { requireAuth: true } },
                { path: '/devices/new', name: 'DeviceCreate', component: () => import('../views/device/New.vue'), meta: { requireAuth: true } },
                { path: '/devices/wifi', name: 'DeviceConfig', component: () => import('../views/device/Config.vue'), meta: { requireAuth: true } },
                { path: '/devices/param', name: 'DeviceParam', component: () => import('../views/device/Param.vue'), meta: { requireAuth: true } },
                { path: '/config/mac', name: 'ConfigMac', component: () => import('../views/config/Mac.vue'), meta: { requireAuth: true } },
                { path: '/config/set/mac', name: 'ConfigSetMac', component: () => import('../views/config/SetMac.vue'), meta: { requireAuth: true } }
            ]
        },
    ]
})

router.beforeEach((to, from, next) => {
    const requireAuth = to.matched.some(record => record.meta.requireAuth)
    const currentUser = store.state.user
    if(requireAuth && !currentUser) {
        // remove credentials if exist
        next('/login')
    } else if (to.path == '/login' && currentUser) {
        next('/')
    } else {
        next()
    }
})

router.onError(error => {
    console.log('ERROR LA PTM')
    console.error(error.response)
})


// axios.interceptors.response.use(null, (error) => {
//   if(error.response.status == 401) {
//     store.commit('logout')
//     router.push('/login')
//   }
//   return Promise.reject(error)
// })

export default router