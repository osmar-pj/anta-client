<template> 
    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div class="text-700 text-center">
            <div class="text-blue-600 font-bold mb-3 text-xl"><i class="pi pi-cog"></i>&nbsp;&nbsp;&nbsp;&nbsp; {{ device.mac }} </div>
       </div>
       <div class="card">
           <div class="surface-section">
               <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row mb-3">
                   <div>
                       <div class="font-medium text-3xl text-900 mb-3">Parametros</div>
                       <div class="text-500 mb-5">Verificar los parametros de los datos enviados en tiempo real</div>
                   </div>
               </div>
               
               <DataTable :value="deviceData.s" :responsive="true" responsiveLayout="scroll">
                    <Column field="id" header="Id" :sortable="true" />
                    <Column field="type" header="Tipo" :sortable="true" />
                    <Column field="value" header="Valor" :sortable="true">
                        <template #body="slotProps">
                            <span v-if="(slotProps.data.type == 'sd' || slotProps.data.type == 'sa')" class="text-xl"> {{ slotProps.data.value }} </span>
                            <!-- <Button v-if="(slotProps.data.type == 'ad')" v-model="slotProps.data.value" /> -->
                            <InputSwitch v-if="(slotProps.data.type == 'ad')" v-model="slotProps.data.value" @change="active(slotProps)" />
                            <h4  v-if="(slotProps.data.type == 'aa')"> {{ slotProps.data.value }} </h4>
                            <Slider v-if="(slotProps.data.type == 'aa')" v-model="slotProps.data.value" @slideend="active(slotProps)"/>
                        </template>
                    </Column>
                    <Column field="" header="Parametrizar" :sortable="true" >
                        <template #body="slotProps">
                            <Button class="p-button p-component p-button-text p-button-icon-only p-button-icon-left" @click="select(slotProps)">
                                <span class="p-button-icon-left pi pi-angle-right"></span>
                            </Button>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <Button label="Finalizar" icon="pi pi-angle-paperclip" class="p-button mr-2" @click="finalizar" />
    </div>
    <Dialog header="Parametrizar" v-model:visible="displayModal" :modal="true">
        <div class="field">
            <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <label for="description" class="block text-900 font-medium mb-2">Descripcion</label>
                <InputText id="description" type="text" class="w-auto mb-3" v-model="nm" />

                <label for="icon" class="block text-900 font-medium mb-2">Icono</label>
                <InputText id="icon" type="text" class="w-auto mb-3" v-model="icon"/>

                <label for="unit" class="block text-900 font-medium mb-2">Unidad</label>
                <InputText id="unit" type="text" class="w-auto mb-3" v-model="unit"/>

                <label for="unit" class="block text-900 font-medium mb-2">Valor inicial</label>
                <InputNumber id="initial" class="w-auto mb-3" v-model="x0" mode="decimal" :minFractionDigits="1"/>

                <label for="max" class="block text-900 font-medium mb-2">Max</label>
                <InputNumber id="max" class="w-auto mb-3" v-model="max" mode="decimal" :minFractionDigits="1"/>

                <label for="min" class="block text-900 font-medium mb-2">Min</label>
                <InputNumber id="min" class="w-auto mb-3" v-model="min" mode="decimal" :minFractionDigits="1"/>
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" class="p-button-text"></Button>
            <Button label="Guardar" @click.prevent="saveParameter"></Button>
        </template>
    </Dialog>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'ConfigDevice',
    setup() {
        const store = useStore()
        const router = useRouter()
        
        const device = ref()
        const deviceId = ref()
        const deviceData = ref({})
        const displayModal = ref(false)
        const nm = ref()
        const icon = ref()
        const unit = ref()
        const x0 = ref()
        const max = ref()
        const min = ref()
        let index = 0

        device.value = store.state.device
        
        const socket = inject('socket')
        socket.on('deviceData', (data) => {
            if (data.mac == device.value.mac) {
                deviceData.value = data
            }
        })
        
        onMounted(async () => {
            // llamar los actuadores que pudiera tener un dispositivo final
            deviceId.value = await store.dispatch('get', { route: `help/device/${device.value.mac}` })
        })

        // ENVIA DATOS PARA ACTUADORES
        const active = (data) => {
            store.dispatch('post', { route: `help/device/${device.value.mac}`, data: { value: data } })
        }

        // LLAMADA AL MODAL Y SLEECCOINA EL INDEX
        const select = (data) => {
            displayModal.value = true
            index = data.index
        }

        // DEBE ACTUALIZAR LOS DATOS EN EL INDEX CORRECTO DEL DEVICE en el S
        const saveParameter = async () => {
            // guardar los datos de parametros
            const data = {
                nm: nm.value,
                icon: icon.value,
                unit: unit.value,
                x0: x0.value,
                max: max.value,
                min: min.value
            }
            await store.dispatch('putId', { route: `device`, data: { data, index, s: deviceData.value.s[index] }, id: deviceId.value._id })
            displayModal.value = false
        }

        const finalizar = () => {
            router.replace('/')
        }

        return { deviceData, device, displayModal, nm, icon, unit, x0, max, min, active, select, saveParameter, finalizar }
    }
}

</script>