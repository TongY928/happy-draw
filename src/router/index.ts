import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/draw',
      children: [
        {
          path: '/login',
          component: () => import('../pages/login/index.vue')
        },
        {
          path: '/draw',
          component: () => import('../pages/draw/index.vue')
        }
      ]
    }
  ],
  strict: true
})
export default router
