<template>
    <div class="surface-hover">
        <Menubar :model="items" class="sticky top-0 z-5 bg-gray-50 text-white">
            <template #start>
                <RouterLink to="/">
                    <img src="../assets/gunjop.svg" alt="logo" class="w-4rem lg:w-5rem md:w-8rem">
                </RouterLink>
            </template>
            <template #end>
                <div class="flex justify-content-between align-items-center">
                    <h4 class="text-gray-700 mr-3"> {{  user.user  }} </h4>
                    <Avatar icon="pi pi-user" class="mr-2" shape="circle"/>
                </div>
            </template>
        </Menubar>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore} from 'vuex'

export default {
    setup() {
        const router = useRouter()
        const store = useStore()
        const user = ref(store.state.user)
        const visible = ref(false)
        visible.value = user.value.user === 'Admin' ? true : false
        
        const items = ref([
            {
                label: 'Users',
                icon: 'pi pi-fw pi-user',
                visible: visible.value,
                items: [
                    {
                        label: 'List',
                        icon: 'pi pi-fw pi-user-plus',
                        command: () => {
                            router.push('/users')
                        }
                    }
                ]
            },
            {
                label: 'Odometer',
                icon: 'pi pi-fw pi-hourglass',
                command: () => {
                    router.push('/horometer')
                }
            },
            {
                label: 'Wasser',
                icon: 'pi pi-fw pi-inbox',
                command: () => {
                    router.push('/hydragen')
                }
            },
            {
                label: 'Trip',
                icon: 'pi pi-fw pi-th-large',
                command: () => {
                    router.push('/dispatch')
                }
            },
            {
                label: 'Fuel',
                icon: 'pi pi-fw pi-chart-line',
                command: () => {
                    router.push('/fuel')
                }
            },
            {
                label: 'Devices',
                icon: 'pi pi-fw pi-file',
                visible: visible.value,
                items: [
                    {
                        label: 'Nuevo',
                        icon: 'pi pi-fw pi-plus',
                        command: () => {
                            router.push('/devices/new')
                        }
                    },
                    {
                        label: 'Registrados',
                        icon: 'pi pi-fw pi-list',
                        command: () => {
                            router.push('/devices')
                        }
                    }
                    // {label: 'Delete', icon: 'pi pi-fw pi-trash'},
                    // {separator: true},
                    // {label: 'Export', icon: 'pi pi-fw pi-external-link'}
                ]
            },
            {
                label: 'Parameters',
                icon: 'pi pi-fw pi-database',
                visible: visible.value,
                items: [
                    {
                        label: 'Nuevo',
                        icon: 'pi pi-fw pi-plus',
                        command: () => {
                            router.push('/parameters/new')
                        }
                    },
                    {
                        label: 'Registrados',
                        icon: 'pi pi-fw pi-list',
                        command: () => {
                            router.push('/parameters')
                        }
                    }
                ]
            },
            {
                label: 'Config',
                icon: 'pi pi-fw pi-pencil',
                visible: visible.value,
                items:[
                    {
                        label: 'Dispositivo',
                        icon: 'pi pi-fw pi-search',
                        command: () => {
                            router.push('/config/mac')
                        }
                    },
                    {
                        label: 'Tengo la MAC',
                        icon: 'pi pi-fw pi-pencil',
                        command: () => {
                            router.push('/config/set/mac')
                        }
                    }
                ]
            },
            {
                label: 'Exit',
                icon: 'pi pi-fw pi-sign-out',
                command: async () => {
                    await store.dispatch('logout')
                    router.push('/login')
                }
            }
        ])

        return {items, user}
    }
}
</script>