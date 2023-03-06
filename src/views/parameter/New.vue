<template>
    <div>
        <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
            <ul class="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                    <a class="text-500 no-underline line-height-3 cursor-pointer">Home</a>
                </li>
                <li class="px-2">
                    <i class="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                    <span class="text-900 line-height-3">Parameters</span>
                </li>
            </ul>
            <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div>
                    <div class="font-medium text-3xl text-900">Parametros fijos</div>
                    <div class="flex align-items-center text-700 flex-wrap">
                        <div class="mr-5 flex align-items-center mt-3">
                            <i class="pi pi-users mr-2"></i>
                            <span>16 sensores</span>
                        </div>
                        <div class="mr-5 flex align-items-center mt-3">
                            <i class="pi pi-globe mr-2"></i>
                            <span>23 actuadores</span>
                        </div>
                        <div class="mr-5 flex align-items-center mt-3">
                            <i class="pi pi-clock mr-2"></i>
                            <span>20 analogicos</span>
                        </div>
                        <div class="flex align-items-center mt-3">
                            <i class="pi pi-clock mr-2"></i>
                            <span>19 digitales</span>
                        </div>
                    </div>
                </div>
                <!-- <div class="mt-3 lg:mt-0">
                    <Button label="Add" class="p-button-outlined mr-2" icon="pi pi-user-plus"></Button>
                    <Button label="Save" icon="pi pi-check"></Button>
                </div> -->
            </div>
        </div>
        <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
            <label for="parameter" class="block text-900 font-medium mb-2">Parametro</label>
            <InputText id="parameter" type="text" class="w-auto mb-3" v-model="parameter" />

            <label for="icon" class="block text-900 font-medium mb-2">Icon</label>
            <InputText id="icon" type="text" class="w-auto mb-3" v-model="icon"/>

            <label for="category" class="block text-900 font-medium mb-2">Categoria</label>
            <CascadeSelect class="w-auto mb-3" v-model="category" :options="categories" optionGroupLabel="label" :optionGroupChildren="['types']" optionLabel="type" />

            <Button label="Register" icon="pi pi-tablet" class="block w-auto" @click.prevent="regParameter"></Button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
    setup() {
        const router = useRouter()
        const store = useStore()

        const parameter = ref()
        const icon = ref()
        const category = ref()

        const categories = ref([
            { 
                label: 'Sensor',
                types: [
                    { type: 'Analogico', category: 'Sensor' },
                    { type: 'Digital', category: 'Sensor' }
                ]
            },
            { 
                label: 'Actuador',
                types: [
                    { type: 'Analogico', cateogory: 'Actuador' },
                    { type: 'Digital', category: 'Actuador' }
                ]
            }
        ])

        const regParameter = async () => {
            await store.dispatch('post', { data: {parameter: parameter.value, icon: icon.value, category: category.value.category, type: category.value.type}, route: 'parameter' })
            router.replace('/parameters')
        }

        return { parameter, icon, categories, category, regParameter }
    }
}
</script>