<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                    <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" /> -->
                </template>

                <template #end>
                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                    <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
                </template>
            </Toolbar>

            <DataTable ref="dt" :value="parameters" v-model:selection="selectedProducts" dataKey="id" 
                :paginator="true" :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
                <template #header>
                    <div class="table-header flex flex-column md:flex-row md:justiify-content-between">
						<h5 class="mb-2 md:m-0 p-as-md-center">Adminitracion de parametros</h5>
						<span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                        </span>
					</div>
                </template>

                <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
                <Column field="_id" header="Code" :sortable="true" style="min-width:6rem">
                    <template #body="slotProps">
                        <!-- get last 6 string of a character -->
                        {{ slotProps.data._id.substring(slotProps.data._id.length - 6) }}
                    </template>
                </Column>
                
                <Column field="parameter" header="Parameter" :sortable="true" style="min-width:8rem">
                    <template #body="slotProps">
                        {{ slotProps.data.parameter }}
                    </template>
                </Column>
                <Column field="icon" header="Icon" :sortable="true" style="min-width:6rem">
                    <template #body="slotProps">
                        {{ slotProps.data.icon }} 
                    </template>
                </Column>
                <Column field="category" header="Category" :sortable="true" style="min-width:10rem">
                    <template #body="slotProps">
                        {{ slotProps.data.category }}
                    </template>
                </Column>
                <Column field="type" header="Type" :sortable="true" style="min-width:10rem">
                    <template #body="slotProps">
                        {{ slotProps.data.type }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editParameter(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteParameter(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="parameterDialog" :style="{width: '450px'}" header="Detalles de parametro" :modal="true" class="p-fluid">
            <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <label for="parameter" class="block text-900 font-medium mb-2">Parametro</label>
                <InputText id="parameter" type="text" class="w-full mb-3" v-model="parameter" />

                <label for="icon" class="block text-900 font-medium mb-2">Icon</label>
                <InputText id="icon" type="text" class="w-full mb-3" v-model="icon"/>

                <label for="category" class="block text-900 font-medium mb-2">Categoria</label>
                <CascadeSelect class="w-8 mb-3" v-model="category" :options="categories" optionGroupLabel="label" :optionGroupChildren="['types']" optionLabel="type" />
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveParameter" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteParamaterDIalog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Estas seguro de querer eliminar<b>{{product.name}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteParamaterDIalog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteParameter" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteParametersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteParametersDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
            </template>
        </Dialog>
        <Toast/>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import { useToast } from 'primevue/usetoast'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
    setup() {
        const store = useStore()
        const route = useRoute()
        onMounted(async () => {
            parameters.value = await store.dispatch('get', { route: 'parameter' })
        })

        const parameters = ref()
        const id = ref()
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
        
        const dt = ref()
        const toast = useToast();
        const parameterDialog = ref(false)
        const deleteParamaterDIalog = ref(false)
        const deleteParametersDialog = ref(false)
        const selectedProducts = ref();
        const filters = ref({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        });
        const submitted = ref(false)
        const openNew = () => {
            id.value = null
            parameter.value = null
            icon.value = null
            category.value = null
            submitted.value = false
            parameterDialog.value = true
        }
        const editParameter = (p) => {
            id.value = p._id
            parameter.value = p.parameter
            icon.value = p.icon
            category.value = { category: p.category, type: p.type } || null
            parameterDialog.value = true;
        }
        const hideDialog = () => {
            id.value = null
            parameter.value = null
            icon.value = null
            category.value = null
            parameterDialog.value = false
            submitted.value = false
        }
        const confirmDeleteParameter = (p) => {
            id.value = p._id
            deleteParamaterDIalog.value = true;
        }
        const saveParameter = async () => {
            submitted.value = true
            if (!id.value) {
                await store.dispatch('post', { data: {parameter: parameter.value, icon: icon.value, category: category.value.category, type: category.value.type}, route: 'parameter' })
                toast.add({severity:'success', summary: 'Parametro creado', detail:'Se registro el nuevo parametro', life: 3000})
            } else {
                await store.dispatch('putId', { data: {parameter: parameter.value, icon: icon.value, category: category.value.category, type: category.value.type}, route: 'parameter', id: id.value})
                toast.add({severity:'success', summary: 'Parametro actualizado', detail:'Se actualizo el parametro', life: 3000})
            }
            parameterDialog.value = false;
            id.value = null
            parameter.value = null
            icon.value = null
            category.value = null
            submitted.value = false
            parameters.value = await store.dispatch('get', { route: 'parameter' })
        }
        const deleteParameter = async () => {
            await store.dispatch('deleteId', { route: 'parameter', id: id.value })
            deleteParamaterDIalog.value = false;
            id.value = null
            parameter.value = null
            icon.value = null
            category.value = null
            toast.add({severity:'warn', summary: 'Parametro eliminado', detail:'Se elimino el parametro de la BD', life: 3000});
            parameters.value = await store.dispatch('get', { route: 'parameter' })
        }
        const findIndexById = (id) => {
            let index = -1;
            for (let i = 0; i < products.value.length; i++) {
                if (products.value[i].id === id) {
                    index = i;
                    break;
                }
            }

            return index;
        }
        const createId = () => {
            let id = '';
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for ( var i = 0; i < 5; i++ ) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return id;
        }
        const exportCSV = () => {
            dt.value.exportCSV();
        }

        return { parameters, parameter, icon, category, categories, dt, parameterDialog, deleteParamaterDIalog, deleteParametersDialog,
            selectedProducts, filters, submitted, openNew, hideDialog, saveParameter, editParameter, confirmDeleteParameter, deleteParameter, 
            findIndexById, createId, exportCSV}
    }
}
</script>
4
<style lang="scss" scoped>
.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 960px) {
        align-items: start;
	}
}

.product-image {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
    width: 50px;
    margin: 0 auto 2rem auto;
    display: block;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}
@media screen and (max-width: 960px) {
	::v-deep(.p-toolbar) {
		flex-wrap: wrap;
        
		.p-button {
            margin-bottom: 0.25rem;
        }
	}
}
</style>