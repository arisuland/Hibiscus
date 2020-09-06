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
      path: '/',
      meta: {
        title: 'Monori | Homepage',
        admin: false,
        auth: false
      }
    },
    {
      component: () => import(/* webpackChunkName: "404" */ './pages/404.vue'),
      name: '404',
      path: '*',
      meta: {
        title: 'Monori | Not Found',
        admin: false,
        auth: false
      }
    }
  ]
});

router.beforeEach((to, from, done) => {
  // todo: authenication & admin lol
});

router.afterEach((to, from) => {
  // todo: add embed stuff here

  Vue.nextTick(() => {
    document.title = to.meta.title || 'Monori | Unfinished Page';
  });
});

export default router;
