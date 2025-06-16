import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useUser } from '@/composables/user'

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

/**
 * Before each route, check if the user IP is null and fetch it if it is.
 * As this relies on an external API, it is possible that it fails, but it should not break navigation.
 * If it fails it will be repeated in all api calls until the API becomes available.
 */
router.beforeEach(async () => {
  try {
    const { user, getUserIp, loading } = useUser()
    if (user.value.ip === null) {
      loading.value = true
      await getUserIp()
      loading.value = false
    }
  } catch (error) {
    console.error(error)
  }
})

export default router
