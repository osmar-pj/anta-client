<template>
    <div class="grid" v-if="loading">
        <div class="col-8 col-offset-4">
            <Card class="m-4 w-30rem">
                <template #title>
                    <Skeleton class="mb-2 w-8rem h-2rem"></Skeleton>
                </template>
                <template #content>
                    <div class="flex">
                        <Skeleton size="2rem" class="h-15rem m-1" v-for="i in 10"></Skeleton>
                        <Skeleton size="2rem" class="h-15rem m-1"></Skeleton>
                    </div>
                </template>
                <template #footer>
                    <div class="flex">
                        <Skeleton class="w-6rem" v-for="i in 3"></Skeleton>
                    </div>
                </template>
            </Card>
        </div>
    </div>

    <div class="px-4 py-5 md:px-6 lg:px-8" v-if="!loading">
        <ul class="list-none p-0 m-0 flex align-items-center font-medium mb-3">
            <li>
                <a class="text-500 no-underline line-height-3 cursor-pointer">Mining</a>
            </li>
            <li class="px-2">
                <i class="pi pi-angle-right text-500 line-height-3"></i>
            </li>
            <li>
                <span class="text-900 line-height-3">Fuel consumption</span>
            </li>
        </ul>

        <div class="flex align-items-center justify-content-center mb-4">            
            <Card class="" style="width:1200px">
                <template #title>
                    <div class="flex justify-content-between">
                        <div>
                            <h1 class="text-900 text-xl"> {{ unitSelected.nm }} </h1>
                            <p class="text-xs font-light text-gray-900 -my-2">Analisis periodico</p>
                        </div>
                        <div>
                            <Dropdown v-model="unitSelected" :options="units" optionLabel="nm" placeholder="Selecciona..." class="p-inputtext-sm mr-2" @change="truck"/>
                            <CascadeSelect v-model="rangeSelected" :options="range" optionLabel="name" optionGroupLabel="name" :optionGroupChildren="['options']" style="minWidth: 14rem" placeholder="Selecciona..." @change="truck" class="p-inputtext-sm mr-2"/>
                            <!-- <Dropdown v-model="optionSelected" :options="options" optionLabel="name" optionValue="value" placeholder="Selecciona..." class="p-inputtext-sm mr-2" />
                            <Dropdown v-model="optionSelected" :options="options" optionLabel="name" optionValue="value" placeholder="Selecciona..." class="p-inputtext-sm" /> -->
                        </div>
                    </div>
                </template>

                <template #content>
                    <div class="md:flex md:justify-content-between">
                        <div class="flex align-items-center justify-content-evenly text-center mb-6 md:flex-column md:align-items-start md:text-left">
                            <div class="md:h-4rem">
                                <h1 class="md:text-5xl"> {{ (datos.filter(i => i.turn == 'Dia').reduce((acc, d) => acc + d.consumed, 0)).toFixed(1) }} <span class="text-sm">gal</span></h1>
                                <p class="text-gray-400 -my-4 text-xs md:text-sm">Total Dia</p>
                            </div>
                            <div class="md:h-4rem">
                                <h1 class="md:text-5xl"> {{ (datos.filter(i => i.turn == 'Noche').reduce((acc, d) => acc + d.consumed, 0)).toFixed(1) }} <span class="text-sm">gal</span></h1>
                                <p class="text-gray-400 -my-4 text-xs md:text-sm">Total Noche</p>
                            </div>
                            <div class="md:h-4rem md:mt-5">
                                <h1 class="md:text-4xl"> {{ ((datos.filter(i => i.turn == 'Dia').reduce((acc, d) => acc + d.consumed, 0))/datos.filter(i => i.turn == 'Dia').length).toFixed(1) }} <span class="text-sm">gal</span></h1>
                                <p class="text-gray-400 -my-4 text-xs">Promedio turno dia</p>
                            </div>
                            <div class="md:h-4rem">
                                <h1 class="md:text-4xl"> {{ ((datos.filter(i => i.turn == 'Noche').reduce((acc, d) => acc + d.consumed, 0))/datos.filter(i => i.turn == 'Noche').length).toFixed(1) }} <span class="text-sm">gal</span></h1>
                                <p class="text-gray-400 -my-4 text-xs">Promedio turno noche</p>
                            </div>
                            <div class="hidden md:inline-flex mt-5">
                                <Button label="Last month" class="p-button-md md:p-button p-button-warning"></Button>
                            </div>
                        </div>
                        <div class="">
                            <Chart class="chart" type="bar" :options="basicOptions" :data="basicData"></Chart>
                        </div>
                    </div>
                </template>
                <template #footer></template>
            </Card>
        </div>        
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'

export default {
    setup() {
        const loading = ref(false)
        const datos = ref([])
        // week in spanish array
        const week = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
        const units = ref([])
        const unitSelected = ref({
            nm: 'HT61'
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
        const range = ref([
            {
                name: 'Dia guardia',
                options: [
                    {
                        name: '1 semana',
                        value: 1,
                        axis: 'd'
                    },
                    {
                        name: '2 semanas',
                        value: 2,
                        axis: 'd'
                    },
                    {
                        name: '1 mes',
                        value: 4,
                        axis: 'd'
                    },
                    {
                        name: '2 meses',
                        value: 8,
                        axis: 'd'
                    }
                ]
            },
            {
                name: 'Semana guardia',
                options: [
                    {
                        name: '3 mes',
                        value: 24,
                        axis: 'w'
                    },
                    {
                        name: '6 meses',
                        value: 48,
                        axis: 'w'
                    },
                    {
                        name: '12 meses',
                        value: 96,
                        axis: 'w'
                    }
                ]
            },
            {
                name: 'Mes',
                options: [
                    {
                        name: '3 meses',
                        value: 1,
                        axis: 'm'
                    },
                    {
                        name: '6 meses',
                        value: 2,
                        axis: 'm'
                    },
                    {
                        name: '1 año',
                        value: 3,
                        axis: 'm'
                    }
                ]
            }
        ])
        const rangeSelected = ref({})
        const basicData = computed(() => {
            return {
                // labels in english
                labels: rangeSelected.value.axis == 'd' ? datos.value.filter(i => i.turn == 'Dia').map(i => `${week[i.weekday]} - ${i.day}/${i.month}`) : 
                    datos.value.filter(i => i.turn == 'Dia').map(i => `week ${i.week}`),
                // labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [
                    // {
                    //     label: 'Trend',
                    //     borderColor: '#B6D73F',
                    //     // dashed line
                    //     borderDash: [5, 5],
                    //     type: 'line',
                    //     data: datos.value.filter(i => i.turn == 'Dia').map(i => new Date(i.date).getDay())
                    // },
                    {
                        label: 'Turno dia',
                        backgroundColor: '#F5716C',
                        data: datos.value.filter(i => i.turn == 'Dia').map(i => i.consumed)
                    },
                    {
                        label: 'Turno noche',
                        backgroundColor: '#0A0E68',
                        data: datos.value.filter(i => i.turn == 'Noche').map(i => i.consumed)
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
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        },
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Periodo',
                            color: '#495057'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        },
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Consumo (gal)',
                            color: '#495057'
                        }
                    }
                }
                
            }
        )
        onMounted(() => {
            // loading.value = true
            fetch(`${import.meta.env.VITE_API_URL_SERVER}/api/v1/initialAnalysis`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                datos.value = data.data
                // loading.value = false
            })
        })

        const truck = () => {
            // loading.value = true
            console.log(unitSelected.value, rangeSelected.value)
            fetch(`${import.meta.env.VITE_API_URL_SERVER}/api/v1/analysis?id=${unitSelected.value.nm}&range=${rangeSelected.value.value}&axis=${rangeSelected.value.axis}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                datos.value = data.data
                // loading.value = false
            })
        }

        return { loading, basicData, basicOptions, unitSelected, rangeSelected, datos, units, range, truck }
    }
}
</script>

<style lang="scss" scoped>

.p-button-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    line-height: 1.5;
    border-radius: 0.2rem;
}

.button {
    // altura del grupo de botones
    height: 2rem;
}

@media (min-width: 600px) {
    .chart {
        width: 900px;
    }
    .p-button-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        line-height: 1.5;
        border-radius: 0.2rem;
    }
}
</style>