<template>
    <div>
        <div class="surface-hover flex p-3 justify-content-around">
            <div class="surface-card shadow-2 p-3 border-round w-15rem" v-for="card in cards">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3 text-sm"> {{ card.title }} </span>
                        <div class="text-900 font-medium text-xl"> {{ card.value }} </div>
                    </div>
                    <div class="flex align-items-center justify-content-center border-round" style="width:2.5rem;height:2.5rem">
                        <i :class="`pi ${card.icon} text-${card.color}-500 text-xl`"></i>
                    </div>
                </div>
                <span :class="`text-${card.subtitleColor}-400 font-medium`"> {{ card.subtitle }} </span>
                <span class="text-500 text-xs"> {{ card.subtitleText }} </span>
            </div>
        </div>
        <div class="grid p-3 flex justify-content-center">
            <div class="col-2 surface-card shadow-2 border-round pl-4">
                <h5 class="mb-3">Camiones:</h5>
                <Dropdown v-model="unit" :options="units" optionLabel="nm" optionValue="nm" placeholder="Selecciona..." @change="change_unit"/>
                
                <h5 class="mb-3">Periodos:</h5>
                <Dropdown v-model="period" :options="periods" optionLabel="nm" optionValue="id" placeholder="Selecciona..." @change="change_period"/>

                <h5 class="mb-3">Parametro:</h5>
                <Dropdown v-model="parameter" :options="parameters" optionLabel="nm" optionValue="id" placeholder="Selecciona..." @change="change_parameter"/>
                
                <h5 class="mb-3">Analizar por patrones:</h5>
                <Dropdown v-model="pattern" :options="patterns" optionLabel="nm" optionValue="id" placeholder="Selecciona..." @change="change_pattern"/>
            </div>
            <div class="col-6 surface-card shadow-2 p-6 border-round ml-3">
                <Chart type="bar" :options="basicOptions" :data="{
                    labels: labels,
                    datasets: [
                        {
                            label: 'Trend Dia',
                            type: 'line',
                            borderWidth: 1,
                            borderColor: '#f97d78',
                            backgroundColor: '#f97d78',
                            data: data_day_avg
                        },
                        {
                            label: 'Trend Noche',
                            type: 'line',
                            borderWidth: 1,
                            borderColor: '#706b6c',
                            backgroundColor: '#706b6c',
                            data: data_night_avg
                        },
                        {
                            label: 'Turno Dia',
                            type: pattern == null ? 'bar' : 'line',
                            backgroundColor: '#d8362f',
                            fill: false,
                            data: data_day,
                            tension: .4,
                            borderColor: '#d8362f',
                            borderWidth: 1
                        },
                        {
                            label: 'Turno Noche',
                            type: pattern == null ? 'bar' : 'line',
                            backgroundColor: '#33292a',
                            fill: false,
                            data: data_night,
                            tension: .4,
                            borderColor: '#33292a',
                            borderWidth: 1
                        }
                    ]
                }">
                </Chart>
                <p class="text-xs">El consumo promedio es:</p>
            </div>
            <div class="col-3 surface-card shadow-2 p-6 border-round ml-3">
                <h5 class="mb-3">Total</h5>
                <Chart type="doughnut" :data="{
                    labels: total.map(i => `${i.nm} - ${i.turn}`),
                    datasets: [
                        {
                            label: 'Combustible',
                            backgroundColor: ['#f97d78', '#706b6c', '#d8362f', '#33292a'],
                            data: total.map(i => i.consumed)
                        }
                    ]
                }">
                </Chart>
            </div>
        </div>
        <div class="grid p-3 flex justify-content-center">
            <div class="col-5 surface-card shadow-2 p-6 border-round ml-3">
                <DataTable :value="trips" responsiveLayout="scroll" class="p-datatable-sm">
                    <template #header>Ultimos viajes</template>
                    <Column header="route" field="route"></Column>
                    <Column header="date" field="date"></Column>
                    <Column header="time" field="time"></Column>
                    <Column header="fuel" field="fuel"></Column>
                </DataTable>
            </div>
            <div class="col-6 surface-card shadow-2 p-6 border-round ml-3">
                <h5></h5>
                <Chart type="bar" :options="horizontalOptions" :data="{
                    labels: ['ruta A', 'ruta B', 'ruta C', 'ruta D', 'ruta E', 'ruta F', 'ruta G', 'ruta H', 'ruta I', 'ruta J', 'ruta K', 'ruta L'],
                    datasets: [
                        {
                            label: 'Combustible',
                            backgroundColor: '#9876a4',
                            data: [81, 80, 65, 59, 56, 55, 40, 30, 20, 10, 5, 2]
                        }
                    ]
                }">
                </Chart>
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
        const days = ['Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes', 'Martes', 'Miercoles']
        const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00']
        onMounted(async () => {
            pattern.value = null
            const res = await fetch(`${import.meta.env.VITE_API_URL_SERVER}/api/v1/unit`)
            const data_units = await res.json()
            units.value = await data_units.items
            await dashboard('period')
            labels.value = data_dashboard.value.filter(i => i.turn == 'day').map((i) => new Date(i.date).toLocaleString())
            data_day.value = data_dashboard.value.filter(i => i.turn == 'day').map((i) => i[`${parameters.value.find(i => i.id == parameter.value).label}`])
            data_night.value = data_dashboard.value.filter(i => i.turn == 'night').map((i) => i[`${parameters.value.find(i => i.id == parameter.value).label}`])
            // crear un array con los promedios del array data_day
            data_day_avg.value = data_day.value.map((i, index) => {
                let sum = 0
                for (let j = 0; j <= index; j++) {
                    sum += data_day.value[j]
                }
                return sum / (index + 1)
            })
            // crear un array con los promedios del array data_night
            data_night_avg.value = data_night.value.map((i, index) => {
                let sum = 0
                for (let j = 0; j <= index; j++) {
                    sum += data_night.value[j]
                }
                return sum / (index + 1)
            })
        })
        const total = ref([])
        const units = ref([])
        const period = ref(4)
        const parameter = ref(3)
        const pattern = ref(null)
        const unit = ref('HT61')
        const data_dashboard = ref([])
        const labels = ref([])
        const data_day = ref([])
        const data_night = ref([])
        const data_day_avg = ref([])
        const data_night_avg = ref([])
        const cards = computed(() => {
            return [
                {
                    title: 'Total camiones',
                    icon: 'pi-car',
                    color: 'teal',
                    value: units.value.length,
                    subtitle: 'unidades',
                    subtitleColor: 'green',
                    subtitleText: ''
                },
                {
                    title: 'Total combustible',
                    icon: 'pi-inbox',
                    color: 'yellow',
                    value: total.value.map(i => i.consumed).reduce((a, b) => a + b, 0).toFixed(1),
                    subtitle: 'galones',
                    subtitleColor: 'yellow',
                    subtitleText: ''
                },
                {
                    title: 'Total recorrido',
                    icon: 'pi-flag',
                    color: 'purple',
                    value: total.value.map(i => i.mileage).reduce((a, b) => a + b, 0).toFixed(1),
                    subtitle: 'kilometros',
                    subtitleColor: 'purple',
                    subtitleText: ''
                },
                {
                    title: 'Total horas de trabajo',
                    icon: 'pi-calendar',
                    color: 'orange',
                    value: total.value.map(i => i.engineTime).reduce((a, b) => a + b, 0).toFixed(1),
                    subtitle: 'horas',
                    subtitleColor: 'orange',
                    subtitleText: ''
                },
                {
                    title: 'Ratio General',
                    icon: 'pi-calendar',
                    color: 'blue',
                    value: (total.value.map(i => i.consumed).reduce((a, b) => a + b, 0)/total.value.map(i => i.engineTime).reduce((a, b) => a + b, 0)).toFixed(1),
                    subtitle: 'gal/h',
                    subtitleColor: 'blue',
                    subtitleText: ''
                }
            ]
        })
        const periods = ref([
            { id: 1, nm: 'Hoy' }, // muestra de 0 horas hasta ahora en tiempo real por horas
            { id: 2, nm: 'Ayer' }, // muestra todo el dia de ayer por horas
            { id: 3, nm: 'Esta semana' }, // muestra la semana desde 7 ultimos dias
            { id: 4, nm: 'Semana pasada' }, // muestra la anterior semana por dias
            { id: 5, nm: 'Este mes' }, // muestra el ultimo mes por dias
            { id: 6, nm: 'Mes pasado' }, // Muestra el pasado mes por dias
            { id: 7, nm: 'Por semana' }, // muestra todas las semanas
            { id: 8, nm: 'Por mes' } // muestra todos los meses
        ])
        const parameters = ref([
            { id: 1, nm: 'Ratio', label: 'ratio' },
            { id: 2, nm: 'Eficiencia', label: 'avgConsumed' },
            { id: 3, nm: 'Combustible', label: 'consumed' },
            { id: 4, nm: 'Recorrido', label: 'mileage' },
            { id: 5, nm: 'Horas de trabajo', label: 'engineTime' }
        ])
        const basicOptions = computed( () => {
            return {
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: pattern.value == null ? true : false,
                        title: {
                            display: true,
                            text: 'Tiempo',
                            color: '#495057'
                        }
                    },
                    y: {
                        stacked: pattern.value == null ? true : false,
                        title: {
                            display: true,
                            text: parameter.value == 1 ? 'Galones' : parameter.value == 2 ? 'Kilometros' : 'Horas',
                            color: '#495057'
                        }
                    }
                }
            }
        })
        const horizontalOptions = ref(
            {
                indexAxis: 'y',
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
                        }
                    }
                }
            }
        )
        const trips = ref([
            {
                id: 1,
                date: '2021-05-01',
                time: '12:00',
                route: 'A',
                distance: 123.4,
                fuel: 12.3,
                hours: 1.2
            },
            {
                id: 2,
                date: '2021-05-01',
                time: '12:00',
                route: 'A',
                distance: 123.4,
                fuel: 12.3,
                hours: 1.2
            },
            {
                id: 3,
                date: '2021-05-01',
                time: '12:00',
                route: 'A',
                distance: 123.4,
                fuel: 12.3,
                hours: 1.2
            },
            {
                id: 4,
                date: '2021-05-01',
                time: '12:00',
                route: 'A',
                distance: 123.4,
                fuel: 12.3,
                hours: 1.2
            },
            {
                id: 5,
                date: '2021-05-01',
                time: '12:00',
                route: 'A',
                distance: 123.4,
                fuel: 12.3,
                hours: 1.2
            },
            {
                id: 6,
                date: '2021-05-01',
                time: '12:00',
                route: 'A',
                distance: 123.4,
                fuel: 12.3,
                hours: 1.2
            },
            {
                id: 7,
                date: '2021-05-01',
                time: '12:00',
                route: 'A',
                distance: 123.4,
                fuel: 12.3,
                hours: 1.2
            },
            {
                id: 8,
                date: '2021-05-01',
                time: '12:00',
                route: 'A',
                distance: 123.4,
                fuel: 12.3,
                hours: 1.2
            }
        ])
        const patterns = ref([
            {
                id: 1,
                nm: 'Por hora'
            },
            {
                id: 2,
                nm: 'Por día'
            }
        ])
        const change_unit = async () => {
            if (pattern.value != null) {
                change_pattern()
            } else {
                await dashboard('period')
                if (period.value < 7) {
                    labels.value = data_dashboard.value.filter(i => i.turn == 'day').map((i) => new Date(i.date).toLocaleString())
                } else if (period.value == 7) {
                    labels.value = data_dashboard.value.filter(i => i.turn == 'day').map(i => `sem ${i.week}`)
                } else {
                    labels.value = data_dashboard.value.filter(i => i.turn == 'day').map((i) => `mes ${i.month}`)
                }
                data_day.value = data_dashboard.value.filter(i => i.turn == 'day').map((i) => i[`${parameters.value.find(i => i.id == parameter.value).label}`])
                data_night.value = data_dashboard.value.filter(i => i.turn == 'night').map((i) => i[`${parameters.value.find(i => i.id == parameter.value).label}`])
                // crear un array con los promedios del array data_day
                data_day_avg.value = data_day.value.map((i, index) => {
                    let sum = 0
                    for (let j = 0; j <= index; j++) {
                        sum += data_day.value[j]
                    }
                    return sum / (index + 1)
                })
                // crear un array con los promedios del array data_night
                data_night_avg.value = data_night.value.map((i, index) => {
                    let sum = 0
                    for (let j = 0; j <= index; j++) {
                        sum += data_night.value[j]
                    }
                    return sum / (index + 1)
                })
            }
        }
        const change_period = async () => {
            pattern.value = null
            await dashboard('period')
            if (period.value < 7) {
                labels.value = data_dashboard.value.filter(i => i.turn == 'day').map((i) => new Date(i.date).toLocaleString())
            } else if (period.value == 7) {
                labels.value = data_dashboard.value.filter(i => i.turn == 'day').map(i => `sem ${i.week}`)
            } else {
                labels.value = data_dashboard.value.filter(i => i.turn == 'day').map((i) => `mes ${i.month}`)
            }
            data_day.value = data_dashboard.value.filter(i => i.turn == 'day').map((i) => i[`${parameters.value.find(i => i.id == parameter.value).label}`])
            data_night.value = data_dashboard.value.filter(i => i.turn == 'night').map((i) => i[`${parameters.value.find(i => i.id == parameter.value).label}`])
            // crear un array con los promedios del array data_day
            data_day_avg.value = data_day.value.map((i, index) => {
                let sum = 0
                for (let j = 0; j <= index; j++) {
                    sum += data_day.value[j]
                }
                return sum / (index + 1)
            })
            // crear un array con los promedios del array data_night
            data_night_avg.value = data_night.value.map((i, index) => {
                let sum = 0
                for (let j = 0; j <= index; j++) {
                    sum += data_night.value[j]
                }
                return sum / (index + 1)
            })
        }
        const change_parameter = () => {
            data_day.value = data_dashboard.value.filter(i => i.turn == 'day').map((i) => i[`${parameters.value.find(i => i.id == parameter.value).label}`])
            data_night.value = data_dashboard.value.filter(i => i.turn == 'night').map((i) => i[`${parameters.value.find(i => i.id == parameter.value).label}`])
             // crear un array con los promedios del array data_day
             data_day_avg.value = data_day.value.map((i, index) => {
                let sum = 0
                for (let j = 0; j <= index; j++) {
                    sum += data_day.value[j]
                }
                return sum / (index + 1)
            })
            // crear un array con los promedios del array data_night
            data_night_avg.value = data_night.value.map((i, index) => {
                let sum = 0
                for (let j = 0; j <= index; j++) {
                    sum += data_night.value[j]
                }
                return sum / (index + 1)
            })
        }
        const change_pattern = async () => {
            await dashboard('pattern')
            labels.value = data_dashboard.value.map((i) => pattern.value == 1 ? hours[i.nrohour] : days[i.nroday - 1])
            data_day.value = data_dashboard.value.map((i) => i[`${parameters.value.find(i => i.id == parameter.value).label}`])
            data_night.value = data_dashboard.value.map((i) => i[`${parameters.value.find(i => i.id == parameter.value).label}`])
            data_day_avg.value = []
            data_night_avg.value = []
        }
        const dashboard = async (option) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL_SERVER}/api/v1/dashboard?unit=${unit.value}&period=${period.value}
                                     &parameter=${parameter.value}&pattern=${pattern.value}&option=${option}`)
            const data = await res.json()
            data_dashboard.value = data.data
            total.value = data.total
            console.log("🚀 ~ file: Main.vue:471 ~ dashboard ~ a", data_dashboard.value)
        }

        return { cards, periods, period, parameters, parameter, horizontalOptions, basicOptions, trips, patterns, pattern, units, unit, data_dashboard, labels, 
                change_unit, change_period, change_parameter, change_pattern, data_day, data_night, data_day_avg, data_night_avg, total }
    }
}
</script>

<style>
/* darle color y solid al linea del Divider */
</style>