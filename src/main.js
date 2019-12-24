import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {
  Upload,
  MessageBox,
  Message,
  Button,
  Loading,
  Dialog
} from 'element-ui'

import TIM from 'tim-js-sdk';
import tim from './tim'

window.tim = tim
window.TIM = TIM
Vue.prototype.tim = tim
Vue.prototype.TIM = TIM

Vue.prototype.$loading = Loading.service;
Vue.prototype.$confirm = MessageBox.confirm;
window.$message = Message;
Vue.prototype.$message = Message;

Vue.use(Button)
Vue.use(Upload)
Vue.use(Loading)
Vue.use(Dialog)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
