<template>
    <div>
        <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
            <ul class="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                    <a class="text-500 no-underline line-height-3 cursor-pointer" @click.prevent="() => router.replace('/')">Home</a>
                </li>
                <li class="px-2">
                    <i class="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                    <span class="text-900 line-height-3">Device</span>
                </li>
            </ul>
            <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div>
                    <div class="font-medium text-3xl text-900">Dispositivos registrados</div>
                    <div class="flex align-items-center text-700 flex-wrap">
                        <div class="mr-5 flex align-items-center mt-3">
                            <i class="pi pi-users mr-2"></i>
                            <span> {{ devices }} {{ devices > 1 ? 'dispositivos' : 'dispositivo' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
            <label for="mac" class="block text-900 font-medium mb-2">Mac:</label>
            <InputText id="mac" type="text" class="w-full mb-3" v-model="mac" />

            <label for="name" class="block text-900 font-medium mb-2">Lugar:</label>
            <InputText id="name" type="text" class="w-full mb-3" v-model="place" />

            <!-- <label for="fixed" class="block text-900 font-medium mb-2">Parametros</label>
            <MultiSelect class="w-full mb-5" v-model="fixed" :options="fixedParameters" optionLabel="parameter" placeholder="Select parameters" display="chip" /> -->

            <Button label="Register" icon="pi pi-tablet" class="w-full" @click.prevent="createDevice"></Button>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
    setup() {
        const router = useRouter()
        const store = useStore()

        onMounted(async () => {
            const d = await store.dispatch('get', { route: 'device' })
            devices.value = d.length
            d.some(i => i.mac === store.state.mac) && skip(d)
            mac.value = store.state.mac
        })
        
        const mac = ref()
        const place = ref()
        const devices = ref()

        const createDevice = async () => {
            await store.dispatch('post', { data: { mac: mac.value, place: place.value }, route: 'device' })
            store.commit('saveDevice', { mac: mac.value, place: place.value })
            router.replace('/devices/param')
        }

        const skip = (d) => {
            const device = d.find(i => i.mac === store.state.mac)
            store.commit('saveDevice', { mac: device.mac, place: device.place } )
            router.replace('/devices/param')
        }

        return { mac, place, devices, createDevice, router }
    }
}
</script>