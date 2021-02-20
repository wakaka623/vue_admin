import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
axios.defaults.baseURL = "http://212.64.66.21:8080/api/private/v1/"
    // 全局挂载axios
Vue.prototype.$http = axios

axios.interceptors.request.use(config=>{
    //为请求头对象，添加token验证的Authorization字段
    config.headers.Authorization=window.sessionStorage.getItem('token')
    return config
})

Vue.config.productionTip = false


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')