import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {
  Upload,
  MessageBox,
  Message,
  Button,
  Loading
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


Vue.config.productionTip = false

Date.prototype.format = function (format) {
  let date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
        date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
