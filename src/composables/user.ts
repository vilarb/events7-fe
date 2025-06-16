import { ref, computed } from 'vue'

interface User {
  ip: string | null
}

const user = ref<User>({
  ip: null,
})

const loading = ref(false)

export const useUser = () => {
  const getUserIp = async () => {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    user.value.ip = data.ip
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
  }
}
