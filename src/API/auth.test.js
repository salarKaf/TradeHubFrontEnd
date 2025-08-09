import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { login, getMe } from './auth'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

describe('Auth Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('login', () => {
    test('should successfully login user', async () => {
      const mockLoginData = { email: 'test@example.com', password: 'password123' }
      const mockResponse = {
        data: {
          access_token: 'token123',
          refresh_token: 'refresh123',
          user: { id: 1, email: 'test@example.com' }
        }
      }

      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await login(mockLoginData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/users/login'),
        expect.any(URLSearchParams),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      expect(result).toEqual(mockResponse.data)
    })

    test('should throw error for invalid credentials', async () => {
      const mockLoginData = { email: 'test@example.com', password: 'wrongpassword' }
      const mockError = {
        response: {
          data: { message: 'Invalid credentials' }
        }
      }

      mockedAxios.post.mockRejectedValueOnce(mockError)

      await expect(login(mockLoginData)).rejects.toThrow()
    })

    test('should send correct URLSearchParams format', async () => {
      const mockLoginData = { email: 'user@test.com', password: 'mypass' }
      const mockResponse = { data: { access_token: 'token' } }

      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      await login(mockLoginData)

      const callArgs = mockedAxios.post.mock.calls[0]
      const sentParams = callArgs[1]
      
      expect(sentParams.get('grant_type')).toBe('password')
      expect(sentParams.get('username')).toBe('user@test.com')
      expect(sentParams.get('password')).toBe('mypass')
      expect(sentParams.get('client_id')).toBe('frontend-client')
      expect(sentParams.get('client_secret')).toBe('frontend-secret')
    })
  })

  describe('getMe', () => {
    test('should return user data when token is valid', async () => {
      const mockUser = { 
        id: 1, 
        email: 'test@example.com', 
        first_name: 'John',
        last_name: 'Doe' 
      }
      const mockResponse = { data: mockUser }

      localStorageMock.getItem.mockReturnValue('valid-token-123')
      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const result = await getMe()

      expect(localStorageMock.getItem).toHaveBeenCalledWith('token')
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/users/Me'),
        {
          headers: {
            'Authorization': 'Bearer valid-token-123',
            'Content-Type': 'application/json',
          },
        }
      )
      expect(result).toEqual(mockUser)
    })

    test('should throw error when token is invalid', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      }

      localStorageMock.getItem.mockReturnValue('invalid-token')
      mockedAxios.get.mockRejectedValueOnce(mockError)

      await expect(getMe()).rejects.toThrow()
    })

    test('should handle missing token', async () => {
      localStorageMock.getItem.mockReturnValue(null)
      mockedAxios.get.mockRejectedValueOnce(new Error('No token provided'))

      await expect(getMe()).rejects.toThrow()
    })

    test('should handle network errors', async () => {
      localStorageMock.getItem.mockReturnValue('valid-token')
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'))

      await expect(getMe()).rejects.toThrow('Network Error')
    })
  })
})