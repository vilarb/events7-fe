import { useUser } from './user'

/**
 * Base API fetch function. Wraps the default fetch request and adds the user IP to the headers.
 *
 * @param {string} path - The path to the API endpoint
 * @param {RequestInit} options - The options for the fetch request (method, body, etc.)
 *
 * @returns {Promise<any>} The response from the API
 */
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
