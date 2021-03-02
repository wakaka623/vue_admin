import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
//导入vue-quill-editor（富文本编辑器）
import VueQuillEditor from 'vue-quill-editor'
//导入vue-quill-editor的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
axios.defaults.baseURL = "http://212.64.66.21:8080/api/private/v1/"
    // 全局挂载axios
Vue.prototype.$http = axios

axios.interceptors.request.use(config=>{
    //为请求头对象，添加token验证的Authorization字段
    config.headers.Authorization=window.sessionStorage.getItem('token')
    return config
})
//阻止显示生产模式的消息
Vue.config.productionTip = false
//全局注册组件
Vue.component('tree-table', TreeTable)
//全局注册富文本组件
Vue.use(VueQuillEditor)

//创建过滤器将秒数过滤为年月日，时分秒
Vue.filter('dateFormat',function(originVal){
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth()+1+'').padStart(2,'0')
    const d = (dt.getDate()+'').padStart(2,'0')
  
    const hh = (dt.getHours()+'').padStart(2,'0')
    const mm = (dt.getMinutes()+'').padStart(2,'0')
    const ss = (dt.getSeconds()+'').padStart(2,'0')
  
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  })


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')