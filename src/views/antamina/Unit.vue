<template>
    <div>
        <div class="surface-hover px-4 py-8 md:px-6 lg:px-8 text-center">
            <div class="mb-3 font-bold text-2xl">
                <span class="text-900">Bienvenido, </span>
                <span class="text-teal-500">Antamina Hydragen Systems</span>
            </div>
            <div class="text-700 text-sm mb-6">Seguimiento de tonelaje por cada km gal consumido (km/gal*km) </div>

            <div class="grid">
                <div class="col-6">
                    <div class="grid">
                        <div class="col-4">
                            <p>TAG 1</p>
                            <h1 class="text-green-500">23 km/gal</h1>
                        </div>
                        <div class="col-4">
                            <p>TAG 2</p>
                            <h1 class="text-blue-500">23 km/gal</h1>
                        </div>
                        <div class="col-4">
                            <p>TAG 3</p>
                            <h1 class="text-yellow-500">23 km/gal</h1>
                        </div>
                    </div>
                    <div class="">
                        <Chart class="chart" type="line" :options="basicOptions" :data="{
                            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                            datasets: [
                                {
                                    label: 'HT57',
                                    backgroundColor: '#22c55e',
                                    data: [65, 59, 80, 81, 56, 55, 40, 35, 36, 37, 38, 35]
                                },
                                {
                                    label: 'HT61',
                                    backgroundColor: '#3b82f6',
                                    data: [60, 50, 70, 75, 50, 45, 30, 25, 26, 27, 28, 25]
                                },
                                {
                                    label: 'HT62',
                                    backgroundColor: '#eab308',
                                    data: [80, 70, 90, 95, 70, 65, 50, 45, 46, 47, 48, 45]
                                }
                            ]
                        }">
                        </Chart>
                    </div>
                </div>
                
                <div class="col-6">
                    <h1 class="text-left text-teal-700">HT61</h1>
                    <div class="flex">
                        <div class="flex align-items-center justify-content-evenly text-center mb-6 md:flex-column md:align-items-start md:text-left">
                            <div class="md:h-4rem">
                                <h1 class="md:text-5xl"> {{ datos ? (datos.filter(i => i.nm == 'HT61').reduce((acc, d) => acc + d.consumed, 0)).toFixed(1) : 0 }} </h1>
                                <p class="text-gray-400 -my-4 text-xs md:text-sm md:-my-5">Consumo total</p>
                            </div>
                            <div class="md:h-4rem md:mt-3">
                                <h1 class="md:text-4xl"> {{ datos ? (datos.filter(i => i.nm == 'HT61').reduce((acc, d) => acc + d.consumed, 0) / datos.filter(i => i.nm == 'HT61').length).toFixed(1) : 0  }} </h1>
                                <p class="text-gray-400 -my-4 text-xs">Consumo promedio</p>
                            </div>
                            <div class="hidden md:inline-flex mt-5">
                                <Button label="Ultimo mes" class="p-button-sm md:p-button"></Button>
                            </div>
                        </div>
                        <div class="w-30rem ml-5">
                            <Chart class="chart" type="bar" :options="basicOptions" :data="basicData1">
                            </Chart>
                        </div>
                    </div>
                    <hr>
                    <h1 class="text-left text-teal-700">HT62</h1>
                    <div class="flex">
                        <div class="flex align-items-center justify-content-evenly text-center mb-6 md:flex-column md:align-items-start md:text-left">
                            <div class="md:h-4rem">
                                <h1 class="md:text-5xl"> {{ datos ? (datos.filter(i => i.nm == 'HT62').reduce((acc, d) => acc + d.consumed, 0)).toFixed(1) : 0 }} </h1>
                                <p class="text-gray-400 -my-4 text-xs md:text-sm md:-my-5">Consumo total</p>
                            </div>
                            <div class="md:h-4rem md:mt-3">
                                <h1 class="md:text-4xl"> {{ datos ? (datos.filter(i => i.nm == 'HT62').reduce((acc, d) => acc + d.consumed, 0) / datos.filter(i => i.nm == 'HT62').length).toFixed(1) : 0  }} </h1>
                                <p class="text-gray-400 -my-4 text-xs">Consumo promedio</p>
                            </div>
                            <div class="hidden md:inline-flex mt-5">
                                <Button label="Ultimo mes" class="p-button-sm md:p-button"></Button>
                            </div>
                        </div>
                        <div class="w-30rem ml-5">
                            <Chart class="chart" type="bar" :options="basicOptions" :data="basicData2">
                            </Chart>
                        </div>
                    </div>
        
                    <div class="grid" v-for="d in devices">
                        <!-- <h5> {{ d.place }} </h5> -->
                        <div class="col-12 md:col-6 lg:col-3 xl:col-2 mb-4 px-5" v-for="(s, i) in d.s">
                            <div class="surface-card shadow-1 p-3 border-round h-12rem flex flex-column justify-content-around">
                                <div class="flex justify-content-between ">
                                    <div>
                                        <span class="block text-500 text-xs "> {{ d.place }} </span>
                                    </div>
                                    <div>
                                        <i class="pi pi-circle text-gray-300 text-sm mr-2"></i>
                                    </div>
                                </div>
                                <div class="">
                                    <InputSwitch v-model="s.value" class="" v-if="s.type == 'ad'" @change="publish(d.mac, s, i)"/>
                                    <i :class="`pi pi-mobile ${s.value ? 'text-green-500' : 'text-red-500'} text-5xl`" v-if="s.type == 'sd'" ></i>
                                    <p v-if="s.type == 'aa'"> <span class="text-3xl font-medium"> {{ (s.value + s.x0).toFixed(1) }} </span> <span> {{ s.unit }} </span> </p>
                                    <Slider v-if="s.type == 'aa'" v-model="s.value"  @slideend="publish(d.mac, s)" />
                                    <p v-if="s.type == 'sa'"> <span class="text-5xl font-semibold"> {{ (s.value + s.x0).toFixed(1) }} </span> <span> {{ s.unit }} </span> </p>
                                    <i v-if="((s.value > s.max || s.value < s.min) && s.type == 'sa' )" :class="`pi pi-exclamation-triangle text-yellow-300 animation-duration-500 scalein animation-iteration-infinite`"></i>
                                    <Button v-if="s.type == 'ad'" icon="pi pi-power-off" class="p-button-rounded p-button-outlined p-button-success" />
                                </div>
                                <div class="flex align-items-center justify-content-center mt-2">
                                    <i class="pi pi-minus text-blue-500 text-sm mr-2"></i>
                                    <span class="text-900 font-medium text-md"> {{ s.nm }} </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, inject, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { Subject } from 'rxjs'

export default {
    setup() {
        const store = useStore()
        const socket = inject('socket')
        
        const device$ = new Subject()

        const devices = ref([])
        const datos = ref([])
        const totalConsumed = ref(0)
        const avgConsumed = ref(0)
        let device

        fetch(`${import.meta.env.VITE_API_URL_SERVER}/api/v1/initialReport`)
            .then(res => res.json())
            .then(data => {
                datos.value = data.data
                // console.log('initial report', datos.value)
            })

        socket.on('deviceData', data => {
            device = devices.value.find(d => d.mac === data.mac)
            device ? updateDevice(device, data) : console.log('no device')
        })

        socket.on('data', data => {
            datos.value = data.data
            console.log(datos.value)
            avgConsumed.value = datos.value ? datos.value.filter(i => i.nm == 'HT61').reduce((acc, d) => acc + d.consumed, 0) / datos.value.length : 0
            totalConsumed.value = datos.value ? datos.value.filter(i => i.nm == 'HT61').reduce((acc, d) => acc + d.consumed, 0) : 0
        })
        const basicData1 = computed(() => {
            return {
                labels: datos.value.filter(i => i.nm == 'HT61').map(i => i.hour),
                datasets: [
                    {
                        label: 'vel Maxima (km/h)',
                        borderColor: '#B6D73F',
                        borderDash: [5, 5],
                        type: 'line',
                        data: datos.value.filter(i => i.nm == 'HT61').map(i => i.maxSpeed)
                    },
                    {
                        label: 'consumo (gal)',
                        backgroundColor: '#F5716C',
                        type: 'line',
                        data: datos.value.filter(i => i.nm == 'HT61').map(i => i.consumed)
                    }
                ]
            }
        })
        const basicData2 = computed(() => {
            return {
                labels: datos.value.filter(i => i.nm == 'HT62').map(i => i.hour),
                datasets: [
                    {
                        label: 'vel Maxima (km/h)',
                        borderColor: '#B6D73F',
                        borderDash: [5, 5],
                        type: 'line',
                        data: datos.value.filter(i => i.nm == 'HT62').map(i => i.maxSpeed)
                    },
                    {
                        label: 'consumo (gal)',
                        backgroundColor: '#F5716C',
                        type: 'line',
                        data: datos.value.filter(i => i.nm == 'HT62').map(i => i.consumed)
                    }
                ]
            }
        })
        const basicOptions = ref(
            {
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    },
                    // tooltip: {
                    //     mode: 'index',
                    //     intersect: false
                    // }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        },
                        // stacked: true
                    },
                    y: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        },
                        // stacked: true
                    }
                }

            }
        )
        onMounted(async () => {
            devices.value = await store.dispatch('get', {route: 'device'})
            
        })

        const updateDevice = (device, data) => {
            device.s = data.s
            device$.next(device)
        }

        const publish = (mac, s, i) => {
            store.dispatch('post', {route: `help/device/${mac}`, data: {value: { data: s, index: i }}})
        }

        return { devices, basicData1, basicData2, basicOptions, avgConsumed, totalConsumed, datos, publish }
    }
}
</script>