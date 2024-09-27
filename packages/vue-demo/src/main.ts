import './style.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import { ComponentLibrary } from 'logic-flow-vue'

const app = createApp(App)

app.use(router)

// app.use(ComponentLibrary)

app.mount('#app')
