import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return savedPosition ? savedPosition : {x: 0, y: 0}
  },
})
