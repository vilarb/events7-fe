import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/event/:id',
          name: 'event',
          component: () => import('@/views/EventView.vue'),
        },
      ],
    },
  ],
})

export default router
