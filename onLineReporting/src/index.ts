import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import * as echarts from 'echarts'

import '@/styles/normalize.styl'
import '@/styles/main.styl'

const _ = require('lodash')

Vue.use(ElementUI)
Vue.prototype.$echarts = echarts
Vue.prototype.$lodash = _

new Vue({
  render: h => h(App)
}).$mount('#app')
