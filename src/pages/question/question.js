/**
 * Created by Administrator on 2019/3/13.
 */
import Vue from 'vue'
import App from './question.vue'
import Promise from 'promise-polyfill'
if (!window.Promise) {
    window.Promise = Promise
}
Vue.config.productionTip = false
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
})