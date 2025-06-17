import { ref, computed } from 'vue'
import { useApiFetch } from './baseApi'

interface User {
  ip: string | null
  adsAuthorized: boolean
}

const user = ref<User>({
  ip: null,
  adsAuthorized: false,
})

const loading = ref(false)

export const useUser = () => {
  const getUserIp = async () => {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    user.value.ip = data.ip
  }

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
