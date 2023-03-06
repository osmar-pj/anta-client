<template>
    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div class="text-700 text-center">
            <!-- <div class="text-blue-600 font-bold mb-3"><i class="pi pi-home"></i>&nbsp;POWERED BY PARANOID</div> -->
            <div class="text-900 font-bold text-5xl mb-3">Configurar, tengo la mac</div>
            <div class="text-700 text-xl mb-5">Escriba la MAC y continua el proceso de registro</div>

            <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <label for="mac" class="block text-900 font-medium mb-2">Mac:</label>
                <InputText id="mac" type="text" class="w-full mb-3" v-model="mac" />

                <Button label="Register" icon="pi pi-tablet" class="w-full" @click.prevent="createDevice"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
    name: 'Mac',
    setup() {
        const router = useRouter()
        const store = useStore()

        const mac = ref()

        
        const createDevice = () => {
            store.commit('saveMac', mac.value.toUpperCase())
            router.replace('/devices/wifi')
        }

        return { mac, createDevice }
    }
}
</script>