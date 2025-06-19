import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApiFetch } from '../baseApi'

// Mock the useUser composable
const mockUser = {
  value: { ip: '127.0.0.1' as string | null, adsAuthorized: false },
  effect: vi.fn(),
  fn: vi.fn(),
  setter: vi.fn(),
}

const mockLoading = {
  value: false,
  effect: vi.fn(),
  fn: vi.fn(),
  setter: vi.fn(),
}

vi.mock('../user', () => ({
  useUser: vi.fn(() => ({
    user: mockUser,
    loading: mockLoading,
    getUserIp: vi.fn(),
    authorizeAdsType: vi.fn(),
  })),
}))

describe('useApiFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should make a successful API call', async () => {
    const mockResponse = { data: 'test data' }
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
    global.fetch = mockFetch

    const result = await useApiFetch('/test')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Client-IP': '127.0.0.1',
        }),
      }),
    )
    expect(result).toEqual(mockResponse)
  })

  it('should throw an error when the response is not ok', async () => {
    const mockError = { message: 'Test error' }
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.reject(mockError),
    })
    global.fetch = mockFetch

    await expect(useApiFetch('/test')).rejects.toThrow('Test error')
  })

  it('should not return data for DELETE requests', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })
    global.fetch = mockFetch

    const result = await useApiFetch('/test', { method: 'DELETE' })
    expect(result).toBeUndefined()
  })
})
