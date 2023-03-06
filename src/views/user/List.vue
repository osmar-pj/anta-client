<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                    <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" /> -->
                </template>

                <template #end>
                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" disabled/>
                    <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" disabled />
                </template>
            </Toolbar>

            <DataTable ref="dt" :value="users" v-model:selection="selectedProducts" dataKey="id" 
                :paginator="true" :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
                <template #header>
                    <div class="table-header flex flex-column md:flex-row md:justiify-content-between">
						<h5 class="mb-2 md:m-0 p-as-md-center">User Management</h5>
						<span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
					</div>
                </template>

                <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
                <Column field="_id" header="Code" :sortable="true" style="min-width:6rem">
                    <template #body="slotProps">
                        <!-- get last 6 string of a character -->
                        {{ slotProps.data._id.substring(slotProps.data._id.length - 4) }}
                    </template>
                </Column>
                
                <Column field="name" header="Name" :sortable="true" style="min-width:8rem">
                    <template #body="slotProps">
                        {{ slotProps.data.name }}
                    </template>
                </Column>
                <Column field="lastname" header="Lastname" :sortable="true" style="min-width:6rem">
                    <template #body="slotProps">
                        {{ slotProps.data.lastname }} 
                    </template>
                </Column>
                <Column field="email" header="Email" :sortable="true" style="min-width:6rem">
                    <template #body="slotProps">
                        {{ slotProps.data.email }} 
                    </template>
                </Column>
                <Column field="valid" header="Valid" :sortable="true" style="min-width:6rem">
                    <template #body="slotProps">
                        <i class="pi pi-check text-green-600" v-show="slotProps.data.valid"></i>
                        <i class="pi pi-times text-red-600" v-show="!slotProps.data.valid"></i>
                    </template>
                </Column>
                <Column field="roles" header="Roles" :sortable="true" style="min-width:10rem">
                    <template #body="slotProps">
                        <div class="flex align-items-center flex-column sm:flex-row" v-for="p in slotProps.data.roles">
                            <Chip :label="p.name" class="mr-2 mb-2 custom-chip text-xs" />
                        </div>
                    </template>
                </Column>
                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editUser(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteUser(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="Detalles de parametro" :modal="true" class="p-fluid">
            <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <label for="name" class="block text-900 font-medium mb-2">Name</label>
                <InputText id="name" type="text" class="w-full mb-3" v-model="name" />

                <label for="lastname" class="block text-900 font-medium mb-2">Lastname</label>
                <InputText id="lastname" type="text" class="w-full mb-3" v-model="lastname" />

                <label for="email" class="block text-900 font-medium mb-2">Email</label>
                <InputText id="email" type="text" class="w-full mb-3" v-model="email" />

                <label for="password" class="block text-900 font-medium mb-2">Password</label>
                <Password v-model="password" class="mb-3"/>

                <label for="valid" class="block text-900 font-medium mb-2">Valid</label>
                <Checkbox v-model="valid" :binary="true" class="mb-3 text-xl" />

                <label for="roles" class="block text-900 font-medium mb-2">Roles</label>
                <InputText id="roles" type="text" class="w-full mb-3" v-model="roles" />
        </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveUser" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteUserDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Estas seguro de querer eliminar<b>{{product.name}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteUsersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUsersDialog = false"/>
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
            users.value = await store.dispatch('get', { route: 'user' })
        })

        const users = ref([])
        const id = ref()
        const name = ref()
        const lastname = ref()
        const email = ref()
        const password = ref()
        const valid = ref(false)
        
        const dt = ref()
        const toast = useToast();
        const userDialog = ref(false)
        const deleteUserDialog = ref(false)
        const deleteUsersDialog = ref(false)
        const selectedProducts = ref();
        const filters = ref({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        });
        const submitted = ref(false)
        const openNew = () => {
            id.value = null
            name.value = null
            lastname.value = null
            email.value = null
            password.value = null
            submitted.value = false
            userDialog.value = true
        }
        const editUser = (p) => {
            id.value = p._id
            name.value = p.name
            lastname.value = p.lastname
            email.value = p.email
            userDialog.value = true;
        }
        const hideDialog = () => {
            id.value = null
            name.value = null
            lastname.value = null
            email.value = null
            userDialog.value = false
            submitted.value = false
        }
        const confirmDeleteUser = (p) => {
            id.value = p._id
            deleteUserDialog.value = true;
        }
        const saveUser = async () => {
            submitted.value = true
            if (!id.value) {
                await store.dispatch('post', { data: {name: name.value, lastname: lastname.value, email: email.value, valid: valid.value, password: password.value}, route: 'user' })
                toast.add({severity:'success', summary: 'Usuario creado', detail:'Se registro el nuevo usuario', life: 3000})
            } else {
                await store.dispatch('putId', { data: {name: name.value, lastname: lastname.value, email: email.value, valid: valid.value}, route: 'user', id: id.value})
                toast.add({severity:'success', summary: 'Usuario actualizado', detail:'Se actualizo el usuario', life: 3000})
            }
            userDialog.value = false;
            id.value = null
            name.value = null
            lastname.value = null
            email.value = null
            submitted.value = false
            users.value = await store.dispatch('get', { route: 'user' })
        }
        const deleteUser = async () => {
            await store.dispatch('deleteId', { route: 'user', id: id.value })
            deleteUserDialog.value = false;
            id.value = null
            name.value = null
            lastname.value = null
            email.value = null
            toast.add({severity:'warn', summary: 'Dispositivo eliminado', detail:'Se elimino el usuario de la BD', life: 3000});
            users.value = await store.dispatch('get', { route: 'user' })
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

        return { users, name, lastname, email, valid, password, dt, userDialog, deleteUserDialog, deleteUsersDialog,
            selectedProducts, filters, submitted, openNew, hideDialog, saveUser, editUser, confirmDeleteUser, deleteUser, 
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
.p-chip.custom-chip {
    background: var(--red-400);
    color: var(--primary-color-text);
}
</style>