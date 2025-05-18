import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import { WagmiPlugin } from '@wagmi/vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { config } from './configs/wagmi-config.js' 

const app = createApp(App)
app.use(router)
app.use(VueQueryPlugin)
app.use(WagmiPlugin, { config })
app.mount('#app')