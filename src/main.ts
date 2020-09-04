import './service-worker';
import router from './router';
import store from './store';
import App from './App.vue';
import Vue from 'vue';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
