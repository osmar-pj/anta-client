<template>
    <div class="surface-hidden h-screen px-1 py-3">
        <ul class="list-none p-0 m-0 flex align-items-center font-medium mb-3">
            <li>
                <a class="text-500 no-underline line-height-3 cursor-pointer">Mining</a>
            </li>
            <li class="px-2">
                <i class="pi pi-angle-right text-500 line-height-3"></i>
            </li>
            <li>
                <span class="text-900 line-height-3">Dispatch</span>
            </li>
        </ul>
        <div class="grid">
            <div class="col-12 md:col-8 md:h-screen">
                <div>
                    <Card class="mb-2">
                        <template #content>
                            <div class="h-10rem md:h-30rem">
                                <GoogleMap
                                    :center="{ lat: -9.553738, lng: -77.053072 }"
                                    :zoom="13"
                                    style="width: 100%; height: 100%"
                                    map-type-id="hybrid"
                                >
                                    <CustomMarker v-for="p in positionTrucks" :options="{ position: { lat: p.d.pos.y, lng: p.d.pos.x }, anchorPoint: 'BOTTOM_CENTER' }">
                                        <div style="text-align: center">
                                            <div class="text-white" style="font-size: 1rem"> {{ p.nm }} </div>
                                            <img src="../../assets/caterpillar.svg" width="35" height="35" style="margin-top: 8px" />
                                        </div>
                                    </CustomMarker>

                                    <Polyline v-for="t in trip" :options="{
                                        path: [
                                            {lat: t.coordinates.y, lng: t.coordinates.x},
                                            {lat: t.llegada.y, lng: t.llegada.x},
                                        ],
                                        geodesic: true,
                                        // color amarillo #FFFF00
                                        strokeColor: t.consumoCaudal < 50 ? '#00FFFF' : t.consumoCaudal < 70 ? '#FFFF00' : t.consumoCaudal < 100 ? '#FF0000' : '#00FF00',
                                        strokeOpacity: 1.0,
                                        strokeWeight: 2
                                    }" />

                                </GoogleMap>
                            </div>
                            <div>
                                <Chart height="50" class="chart" type="line" :options="options" :data="data"></Chart>
                                <div class="ml-6 mr-2">
                                    <DataTable :value="routes" responsiveLayout="scroll" class="text-sm" selectionMode="single" dataKey="id" @rowSelect="selectedTrip" :metaKeySelection="false">
                                        <Column v-for="i in 11">
                                            <template #body="slotProps">
                                                {{ slotProps.data.trip }}
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <Card>
                    <template #title v-if="tripSelected">
                        <div class="flex justify-content-between">
                            <div class="grid text-xs font-light">
                                <h1 class="text-xl"> Ruta seleccionada </h1>
                                <div class="col-9">
                                    <div class="">
                                        <h1 class="text-7xl mb-1 -mt-1 text-teal-500"> {{ tripSelected.consumed.toFixed(1) }} <span class="text-lg text-teal-300 -ml-1">gal</span></h1> 
                                    </div>
                                    <div cl4ss="">
                                        <div class="flex align-items-center mb-1">
                                            <i class="pi pi-circle-fill text-green-400 text-xs mr-1"></i>
                                            <span> {{ tripSelected.tripFrom }} </span><br>
                                        </div>
                                        <div class="flex align-items-center">
                                            <i class="pi pi-circle-fill text-yellow-400 text-xs mr-1"></i>
                                            <span> {{ tripSelected.tripTo }} </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-1 text-sm line-height-1">
                                    <p> {{ tripSelected.mileage.toFixed(1) }} km</p>
                                    <p> {{ (tripSelected.duration*60).toFixed(1) }} min</p>
                                    <p> {{ tripSelected.avgSpeed.toFixed(1) }} km/h</p>
                                </div>
                            </div>
                            <Divider layout="vertical" type="dashed"/>
                            <div class="grid text-xs font-light">
                                <h1 class="text-xl"> Ruta promedio standard </h1>
                                <div class="col-9">
                                    <div class="">
                                        <h1 class="text-7xl mb-1 -mt-1 text-teal-500"> {{ tripSample.consumed.toFixed(1) }} <span class="text-lg text-teal-300 -ml-1">gal</span></h1> 
                                    </div>
                                    <div cl4ss="">
                                        <div class="flex align-items-center mb-1">
                                            <i class="pi pi-circle-fill text-green-400 text-xs mr-1"></i>
                                            <span> {{ tripSample.tripFrom }} </span><br>
                                        </div>
                                        <div class="flex align-items-center">
                                            <i class="pi pi-circle-fill text-yellow-400 text-xs mr-1"></i>
                                            <span> {{ tripSample.tripTo }} </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-1 text-sm line-height-1">
                                    <p> {{ tripSample.mileage.toFixed(1) }} km</p>
                                    <p> {{ (tripSample.duration*60).toFixed(1) }} min</p>
                                    <p> {{ tripSample.avgSpeed.toFixed(1) }} km/h</p>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #content>
                        <div class="-mt-5">
                            <h5>Truck</h5>
                            <Dropdown v-model="truckSelected" :options="units" optionLabel="nm" placeholder="Selecciona..." class="p-inputtext-sm -mt-3 mr-2 mb-1" @change="truck(truckSelected)" />
                            <Dropdown v-model="truckSelected" :options="units" optionLabel="nm" placeholder="Selecciona..." class="p-inputtext-sm -mt-3" @change="truck(truckSelected)" />
                            <DataTable :value="routes" responsiveLayout="scroll" class="text-sm" selectionMode="single" dataKey="id" @rowSelect="selectedTrip" :metaKeySelection="false">
                                <Column header="Viaje">
                                    <template #body="slotProps">
                                        {{ slotProps.data.trip }}
                                    </template>
                                </Column>
                                <Column header="Fecha">
                                    <template #body="slotProps">
                                        <!-- {{ new Date(slotProps.data.mBegin*1000).toLocaleString() }} -->
                                        {{ slotProps.data.begin.t }}
                                    </template>
                                </Column>
                                <Column header="Consumo">
                                    <template #body="slotProps">
                                        {{ slotProps.data.consumed }} <span class="text-xs text-gray-400">gal</span>
                                    </template>
                                </Column>
                                <Column header="Distancia">
                                    <template #body="slotProps">
                                        {{ slotProps.data.mileage }} <span class="text-xs text-gray-400">km</span>
                                    </template>
                                </Column>
                                <Column header="Tiempo">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.duration*60).toFixed(1) }} <span class="text-xs text-gray-400">min</span>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, inject } from 'vue'
import { GoogleMap, CustomMarker, Polyline } from 'vue3-google-map'
export default {
    components: { GoogleMap, CustomMarker, Polyline },
    setup() {
        const socket = inject('socket')

        const positionTrucks = ref([])
        const units = ref([])
        const routes = ref([])
        const trips = ref([])
        const trip = ref([])
        const tripSelected = ref(null)
        const tripSample = ref(null)
        const path = ref({
            path: [
                {lat: -9.53, lng: -77.054},
                {lat: -9.5536, lng: -77.05742}
            ],
            geodesic: true,
            strokeColor: 'green',
            strokeOpacity: 1.0,
            strokeWeight: 2
        })

        socket.on('position', data => {
            positionTrucks.value = data.data
        })

        socket.on('realtime', data => {
            console.log(data)
        })
        
        fetch(`${import.meta.env.VITE_API_URL_SERVER}/api/v1/unit`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(data => {
            units.value = data.items
        })
        .catch(err => {
            console.log(err)
        })
        
        const range = ref(
            [
                { name: 'Hour', id: 'hour' },
                { name: 'Day', id: 'day' },
                { name: 'Week', id: 'week' },
                { name: 'Month', id: 'month' },
                { name: 'Year', id: 'year' }
            ]
        )
        const truckSelected = ref({
            nm: 'HT61'
        })
        const rangeSelected = ref()
        const routeSelected = ref()
        const truck = async (t) => {
            fetch(`${import.meta.env.VITE_API_URL_SERVER}/api/v1/geofence/${t.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(res => res.json())
            .then(data => {
                routes.value = data.data
            })
            .catch(err => {
                console.log(err)
            })
        }

        const selectedTrip = (e) => {
            fetch(`${import.meta.env.VITE_API_URL_SERVER}/api/v1/trip?id=${truckSelected.value.id}&start=${e.data.begin.v}&end=${e.data.end.v}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(res => res.json())
            .then(data => {
                trip.value = data.data
                trips.value = data.trips
                tripSelected.value = e.data
                console.log(tripSelected.value)
                tripSample.value = trips.value.find(i => i.trip == e.data.trip)
            })
        }

        const options = ref({
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    title: {
                        display: true,
                        text: 'Ruta',
                        color: '#495057'
                    }
                }
            }
        })

        const data = ref({
            labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
            datasets: [
                {
                    label: 'Analysis',
                    data: [0, 0, 0.1, 0.1, 0.4, 0.4, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        })

        return { units, truckSelected, range, rangeSelected, routeSelected, routes, positionTrucks, trip, tripSelected, tripSample, path, truck, selectedTrip, options, data }
    }
}
</script>

<style>
/* Dropdown hacerlo mas small */
.dropdown {
    font-size: 0.25rem;
    padding: 0.25rem 0.5rem;
    width: 95%;
    line-height: 0.25;
    border-radius: 0.25rem;
}
</style>