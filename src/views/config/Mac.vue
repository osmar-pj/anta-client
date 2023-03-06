<template>
    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div class="text-700 text-center">
            <!-- <div class="text-blue-600 font-bold mb-3"><i class="pi pi-home"></i>&nbsp;POWERED BY PARANOID</div> -->
            <div class="text-900 font-bold text-5xl mb-3">Visualizar la MAC de un dispositivo</div>
            <div class="text-700 text-xl mb-5">Presiona el boton del dispositivo por 1 segundo y aparecera la MAC</div>
            <Message severity="success" :closable="false" v-if="mac" >MAC: {{ mac }} </Message>
            <Button label="Copiar y verificar" icon="pi pi-paperclip" class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap" v-if="mac" @click.prevent="copyVerify"></Button>
        </div>
    </div>
</template>

<script>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
    name: 'Mac',
    setup() {
        const router = useRouter()
        const store = useStore()

        const mac = ref()
        // Usar socket
        const socket = inject('socket')
        socket.on('verify', (data) => {
            mac.value = data.mac
        })
        
        const copyVerify = () => {
            store.commit('saveMac', mac.value)
            router.replace('/devices/wifi')
        }

        return { mac, copyVerify }
    }
}
</script>