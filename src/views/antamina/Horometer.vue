<template>
    <div class="surface-section px-4 py-5 md:px-6 lg:px-8 text-xs font-light md:text-xl">
        <FullCalendar :options="options" />
    </div>
</template>

<script>
import { ref } from 'vue'
import '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
    components: {
        FullCalendar
    },
    setup() {
        const options =  ref({
            plugins:[dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialDate : new Date().toJSON().substring(0,10),  /// tambien se puede usars 1537302134028 (milisegundos)
            headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: 'today'
            },
            editable: true,
            selectable:true,
            selectMirror: true, 
            dayMaxEvents: true,
            events: [
                { title: 'HT57 65749h', start: new Date().toJSON().substring(0,10), color: 'primary'},
                { title: 'HT61 65549h', start: new Date().toJSON().substring(0,10), color: '#F5716C'},
                { title: 'HT62 65348h', start: new Date().toJSON().substring(0,10), color: '#0A0E0F'},
                { title: 'HT57 (125h)', start: new Date(new Date().getTime() + 75*60*60*1000).toJSON().substring(0,10), color: '#F5716C'},
                { title: 'HT61 (125h)', start: new Date(new Date().getTime() + 95*60*60*1000).toJSON().substring(0,10), color: 'primery'},
                { title: 'HT62 (125h)', start: new Date(new Date().getTime() + 125*60*60*1000).toJSON().substring(0,10), color: '#0A0E0F '},
                { title: 'HT57 (250h)', start: new Date(new Date().getTime() + 200*60*60*1000).toJSON().substring(0,10), color: '#F5716C'},
                { title: 'HT61 (250h)', start: new Date(new Date().getTime() + 230*60*60*1000).toJSON().substring(0,10), color: 'primery'},
                { title: 'HT62 (250h)', start: new Date(new Date().getTime() + 220*60*60*1000).toJSON().substring(0,10), color: '#0A0E0F '},
                { title: 'HT57 (500h)', start: new Date(new Date().getTime() + 500*60*60*1000).toJSON().substring(0,10), color: '#F5716C'},
                { title: 'HT61 (500h)', start: new Date(new Date().getTime() + 500*60*60*1000).toJSON().substring(0,10), color: '#482D29'},
                { title: 'HT62 (500h)', start: new Date(new Date().getTime() + 500*60*60*1000).toJSON().substring(0,10), color: '#0A0E0F '}
            ]
        })

        return { options }
    }
}
</script>

<style scoped>
/* @media screen and (max-width: 960px) {
    ::v-deep(.fc-header-toolbar) {
        display: flex;
        flex-wrap: wrap;
    }
} */
.text {
    font-size: 0.5em;
    color: 'white'
}
</style>