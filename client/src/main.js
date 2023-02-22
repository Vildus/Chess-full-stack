// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import io from 'socket.io-client'

const socket = io(':3000')

const app = createApp(App)

app.config.globalProperties.$socket = socket
app.config.devtoold = true

app.use(router)

app.mount('#app')
