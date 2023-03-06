import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import io from 'socket.io-client'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Menubar from 'primevue/menubar'
import Avatar from 'primevue/avatar'
import Slider from 'primevue/slider'
import InputSwitch from 'primevue/inputswitch'
import CascadeSelect from 'primevue/cascadeselect'
import DataTable from 'primevue/datatable'
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Row from 'primevue/row'
import Toast from 'primevue/toast'
import Toolbar from 'primevue/toolbar'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
import Rating from 'primevue/rating'
import MultiSelect from 'primevue/multiselect'
import Chip from 'primevue/chip'
import Message from 'primevue/message'
import Divider from 'primevue/divider'
import Password from 'primevue/password'
import Skeleton from 'primevue/skeleton'
import Chart from 'primevue/chart'
import Card from 'primevue/card'
import SplitButton from 'primevue/splitbutton'
import SelectButton from 'primevue/selectbutton'

// Services
import ToastService from 'primevue/toastservice'

import 'primevue/resources/themes/tailwind-light/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import 'primeflex/primeflex.css'

const app = createApp(App)
const socket = io(import.meta.env.VITE_API_URL_HTTP)
app.provide('socket', socket)

app.use(router)
app.use(store)
app.use(PrimeVue)
app.use(ToastService)

app.component('Checkbox', Checkbox)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Menubar', Menubar)
app.component('Avatar', Avatar)
app.component('Slider', Slider)
app.component('InputSwitch', InputSwitch)
app.component('CascadeSelect', CascadeSelect)
app.component('DataTable', DataTable)
app.component('TreeTable', TreeTable)
app.component('Column', Column)
app.component('ColumnGroup', ColumnGroup)
app.component('Row', Row)
app.component('Toast', Toast)
app.component('Toolbar', Toolbar)
app.component('Dialog', Dialog)
app.component('Textarea', Textarea)
app.component('Dropdown', Dropdown)
app.component('RadioButton', RadioButton)
app.component('InputNumber', InputNumber)
app.component('FileUpload', FileUpload)
app.component('Rating', Rating)
app.component('MultiSelect', MultiSelect)
app.component('Chip', Chip)
app.component('Message', Message)
app.component('Divider', Divider)
app.component('Password', Password)
app.component('Skeleton', Skeleton)
app.component('Chart', Chart)
app.component('Card', Card)
app.component('SplitButton', SplitButton)
app.component('SelectButton', SelectButton)

app.mount('#app')