<template> 
    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div class="text-700 text-center">
            <div class="text-blue-600 font-bold mb-3"><i class="pi pi-cog"></i>&nbsp;&nbsp;&nbsp;&nbsp; {{ mac }} </div>
       </div>
       <div class="card">
            <h5>WiFi Configuracion</h5>
            <label for="ssid" class="block text-900 font-medium mb-2">SSID:</label>
            <InputText id="ssid" type="text" class="w-full mb-3" v-model="ssid" />
            <label for="password" class="block text-900 font-medium mb-2">Password:</label>
            <InputText id="password" type="text" class="w-full mb-3" v-model="password" />
            <Divider />
            <Button label="Enviar" icon="pi pi-send" @click.prevent="wifiCredentials" />
            <Button label="Saltar" class="p-button-help p-button-outlined ml-8" @click.prevent="skip"></Button>
       </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'ConfigDevice',
    setup() {
        const store = useStore()
        const router = useRouter()

        onMounted(async () => {
            mac.value = store.state.mac
        })

        const mac = ref()
        const ssid = ref()
        const password = ref()

        const wifiCredentials = async () => {
            await store.dispatch('post', { data : { ssid: ssid.value, password: password.value, mac: mac.value }, route: 'device/deviceConfiguring' })
            router.replace('/devices/new')
        }

        const skip = () => {
            router.replace('/devices/new')
        }

        return { mac, ssid, password ,wifiCredentials, skip }
    }
}

</script>