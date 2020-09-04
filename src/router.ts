import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      component: () => import(/* webpackChunkName: "home" */ './pages/Home.vue'),
      name: 'Home',
      path: '/'
    }
  ]
});

export default router;
