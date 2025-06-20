import { ref, computed } from 'vue'
import { useApiFetch } from './baseApi'
import type { User } from '@/types/user'

// User state
const user = ref<User>({
  ip: null,
  adsAuthorized: false,
})

// Get user IP loading state
const loading = ref(false)

/**
 * User composable to manage the user data and authorization
 * It is used to fetch the user IP and authorize the ads type
 *
 * @property {User} user - The user data
 * @property {boolean} loading - The loading state
 * @property {Function} getUserIp - The function to fetch the user IP
 * @property {Function} authorizeAdsType - The function to authorize the ads type
 *
 * @returns {Object} User composable
 */
export const useUser = () => {
  /**
   * Fetch the user IP
   */
  const getUserIp = async () => {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    user.value.ip = data.ip
  }

  /**
   * Authorize the ads type based on the user IP
   */
  const authorizeAdsType = async () => {
    try {
      await useApiFetch(`/users/authorize?ip=${user.value.ip}`)
      user.value.adsAuthorized = true
    } catch (e) {
      console.log('error', e)
      user.value.adsAuthorized = false
    }
  }

  return {
    user: computed({
      get: () => user.value,
      set: (value) => {
        user.value = value
      },
    }),

    loading: computed({
      get: () => loading.value,
      set: (value) => {
        loading.value = value
      },
    }),

    getUserIp,
    authorizeAdsType,
  }
}
