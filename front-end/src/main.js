import { createApp} from 'vue'
import App from '@/App.vue'
import components from '@/components/UI'
import router from "@/router/router"
import directives from "@/directives/directives"
import store from '@/store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


const app = createApp(App)

components.forEach(component =>{
    app.component(component.name, component)
})

directives.forEach(directive =>
    app.directive(directive.name, directive))

app
    .use(router)
    .use(store)
    .mount('#app')

// app.config.errorHandler = function(err, vm, info) {
// }

