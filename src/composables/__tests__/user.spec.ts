import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useUser } from '../user'

// Mock the baseApi composable
vi.mock('../baseApi', () => ({
  useApiFetch: vi.fn(),
}))

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useUser', () => {
  let userComposable: ReturnType<typeof useUser>

  beforeEach(() => {
    vi.clearAllMocks()
    userComposable = useUser()
    // Reset user state to ensure clean state between tests
    userComposable.user.value = { ip: null, adsAuthorized: false }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with default values', () => {
      expect(userComposable.user.value).toEqual({
        ip: null,
        adsAuthorized: false,
      })
    })

    it('should initialize loading as false', () => {
      expect(userComposable.loading.value).toBe(false)
    })
  })

  describe('getUserIp', () => {
    it('should fetch and set user IP successfully', async () => {
      const mockIpResponse = { ip: '192.168.1.1' }
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockIpResponse),
      })

      await userComposable.getUserIp()

      expect(mockFetch).toHaveBeenCalledWith('https://api.ipify.org?format=json')
      expect(userComposable.user.value.ip).toBe('192.168.1.1')
    })

    it('should handle fetch errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(userComposable.getUserIp()).rejects.toThrow('Network error')
      expect(userComposable.user.value.ip).toBe(null)
    })
  })

  describe('authorizeAdsType', () => {
    it('should authorize ads successfully when IP is available', async () => {
      // Set up user with IP
      userComposable.user.value.ip = '192.168.1.1'

      const { useApiFetch } = await import('../baseApi')
      vi.mocked(useApiFetch).mockResolvedValueOnce({ success: true })

      await userComposable.authorizeAdsType()

      expect(useApiFetch).toHaveBeenCalledWith('/users/authorize?ip=192.168.1.1')
      expect(userComposable.user.value.adsAuthorized).toBe(true)
    })

    it('should set adsAuthorized to false when API call fails', async () => {
      // Set up user with IP
      userComposable.user.value.ip = '192.168.1.1'

      const { useApiFetch } = await import('../baseApi')
      vi.mocked(useApiFetch).mockRejectedValueOnce(new Error('API Error'))

      await userComposable.authorizeAdsType()

      expect(useApiFetch).toHaveBeenCalledWith('/users/authorize?ip=192.168.1.1')
      expect(userComposable.user.value.adsAuthorized).toBe(false)
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete user flow: get IP then authorize ads', async () => {
      // Mock IP fetch
      const mockIpResponse = { ip: '203.0.113.1' }
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockIpResponse),
      })

      // Mock authorization API
      const { useApiFetch } = await import('../baseApi')
      vi.mocked(useApiFetch).mockResolvedValueOnce({ success: true })

      // Execute flow
      await userComposable.getUserIp()
      await userComposable.authorizeAdsType()

      // Verify final state
      expect(userComposable.user.value.ip).toBe('203.0.113.1')
      expect(userComposable.user.value.adsAuthorized).toBe(true)
    })

    it('should handle failed authorization after successful IP fetch', async () => {
      // Mock IP fetch
      const mockIpResponse = { ip: '198.51.100.1' }
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockIpResponse),
      })

      // Mock failed authorization API
      const { useApiFetch } = await import('../baseApi')
      vi.mocked(useApiFetch).mockRejectedValueOnce(new Error('Authorization failed'))

      // Execute flow
      await userComposable.getUserIp()
      await userComposable.authorizeAdsType()

      // Verify final state
      expect(userComposable.user.value.ip).toBe('198.51.100.1')
      expect(userComposable.user.value.adsAuthorized).toBe(false)
    })
  })
})
