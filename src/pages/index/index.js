// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './index.vue'
import Router from 'vue-router'
import Promise from 'promise-polyfill'
import axios from 'axios'
import qs from 'qs'
import { Button, Select,Dialog,Input,Dropdown,Message,Radio,MessageBox } from 'element-ui';
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Dropdown)
Vue.use(Radio)
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
if (!window.Promise) {
  window.Promise = Promise
}
Vue.config.productionTip = false
function goPAGE () {
  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    // window.location.href="移动端url";
    return 'mobile'
  } else {
    // window.location.href="pc端url";
    return 'pc'
  }
}
Vue.prototype.$dev = goPAGE()
Vue.use(Router)
let router = new Router()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  message:Message,
  template: '<App/>',
  components: { App }
})
