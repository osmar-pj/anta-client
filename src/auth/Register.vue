<template>
    <div class="">
        <div class="flex align-items-center justify-content-center h-screen">
            <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4" v-if="user.user != 'Admin'" >
                <div class="text-center mb-5">
                    <!-- <img src="images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-3"> -->
                    <div class="text-900 text-3xl font-medium mb-3">Aviso, detectando IP de consulta...</div>
                    <span class="text-600 font-medium line-height-3">No tienes acceso para este espacio</span>
                    <router-link class="font-medium no-underline ml-2 text-blue-500 cursor-pointer" to="/login">Regresar</router-link>
                </div>
            </div>
            <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4" v-if="user.user == 'Admin'" >
                <div class="text-center mb-5">
                    <!-- <img src="images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-3"> -->
                    <div class="text-900 text-3xl font-medium mb-3">Registrate</div>
                    <span class="text-600 font-medium line-height-3">Ya tienes una cuenta?</span>
                    <router-link class="font-medium no-underline ml-2 text-blue-500 cursor-pointer" to="/login">Sign In!</router-link>
                </div>

                <div>
                    <label for="name" class="block text-900 font-medium mb-2">Username</label>
                    <InputText id="name" type="text" class="w-full mb-3" v-model="username" />

                    <label for="email" class="block text-900 font-medium mb-2">Email</label>
                    <InputText id="email" type="text" class="w-full mb-3" v-model="email" />

                    <label for="password" class="block text-900 font-medium mb-2">Password</label>
                    <InputText id="password" type="password" class="w-full mb-3" v-model="password" />

                    <Button label="Sign Up" icon="pi pi-user" class="w-full" @click.prevent="register" ></Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
export default {
    setup() {
        const store = useStore()

        const username = ref('')
        const email = ref('')
        const password = ref('')
        const user = ref({})

        onMounted(() => {
            user.value = store.getters['authUser']
        })

        const register = () => {
            store.dispatch('register', { username: username.value, email: email.value, password: password.value, roles: 'user' })
        }
        return { username, email, password, user, register }
    }
}
</script>

<style scoped></style>