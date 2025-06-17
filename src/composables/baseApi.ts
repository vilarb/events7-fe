import { useUser } from './user'

export const useApiFetch = async (path: string, options: RequestInit = {}) => {
  const { user, getUserIp } = useUser()

  if (user.value.ip === null) {
    await getUserIp()
  }

  const { headers, ...rest } = options

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Client-IP': user.value.ip || '',
      ...headers,
    },
    ...rest,
  }

  const response = await fetch(import.meta.env.VITE_API_URL + path, defaultOptions)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Fetch error')
  }

  if (options.method === 'DELETE') return

  return await response.json()
}
