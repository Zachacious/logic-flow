import './style.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as lf from 'logic-flow-vue'

const app = createApp(App)

app.use(router)

app.use(lf.ComponentLibrary)

app.mount('#app')
