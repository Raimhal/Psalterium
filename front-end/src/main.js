import { createApp} from 'vue'
import App from '@/App.vue'
import components from '@/components/UI'
import router from "@/router/router"
import directives from "@/directives/directives"
import store from '@/store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App)

components.forEach(component =>{
    app.component(component.name, component)
})

directives.forEach(directive =>
    app.directive(directive.name, directive))

const options = {
    confirmButtonColor: '#7072F7',
    cancelButtonColor: '#ff7674',
    background: 'rgba(56, 58, 73)',
};

app
    .use(router)
    .use(store)
    .use(VueSweetalert2, options)
    .mount('#app')

// app.config.errorHandler = function(err, vm, info) {}
