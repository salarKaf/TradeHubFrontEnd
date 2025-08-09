import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { getCouponsByWebsite, createCoupon } from './coupons'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

describe('Coupon Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('valid-token-123')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getCouponsByWebsite', () => {
    test('should successfully get coupons list for website', async () => {
      const websiteId = 'website123'
      const mockResponse = {
        data: [
          {
            id: 'coupon1',
            code: 'SAVE20',
            discount_percent: 20,
            is_active: true
          },
          {
            id: 'coupon2', 
            code: 'FREESHIP',
            discount_amount: 50,
            is_active: true
          }
        ]
      }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const result = await getCouponsByWebsite(websiteId)

      expect(localStorageMock.getItem).toHaveBeenCalledWith('token')
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/coupon/website/${websiteId}/coupons`),
        {
          headers: {
            Authorization: 'Bearer valid-token-123',
          },
        }
      )
      expect(result).toEqual(mockResponse.data)
    })

    test('should handle empty coupons list', async () => {
      const websiteId = 'website456'
      const mockResponse = { data: [] }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const result = await getCouponsByWebsite(websiteId)

      expect(result).toEqual([])
    })

    test('should throw error when unauthorized', async () => {
      const websiteId = 'website123'
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized access' }
        }
      }

      mockedAxios.get.mockRejectedValueOnce(mockError)

      await expect(getCouponsByWebsite(websiteId)).rejects.toThrow()
    })

    test('should handle missing token', async () => {
      const websiteId = 'website123'
      localStorageMock.getItem.mockReturnValue(null)
      
      const mockResponse = {
        data: []
      }
      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const result = await getCouponsByWebsite(websiteId)

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.anything(),
        {
          headers: {
            Authorization: 'Bearer null',
          },
        }
      )
      expect(result).toEqual([])
    })

    test('should handle network error', async () => {
      const websiteId = 'website123'
      const mockError = new Error('Network Error')

      mockedAxios.get.mockRejectedValueOnce(mockError)

      await expect(getCouponsByWebsite(websiteId)).rejects.toThrow('Network Error')
    })
  })

  describe('createCoupon', () => {
    test('should successfully create new coupon', async () => {
      const couponData = {
        code: 'NEWCOUPON',
        discount_percent: 15,
        website_id: 'website123',
        is_active: true,
        expiry_date: '2024-12-31'
      }
      
      const mockResponse = {
        data: {
          id: 'coupon_new_123',
          code: 'NEWCOUPON',
          discount_percent: 15,
          website_id: 'website123',
          is_active: true,
          created_at: '2024-08-02T10:00:00Z'
        }
      }

      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await createCoupon(couponData)

      expect(localStorageMock.getItem).toHaveBeenCalledWith('token')
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/coupon/create_coupon'),
        couponData,
        {
          headers: {
            Authorization: 'Bearer valid-token-123',
          },
        }
      )
      expect(result).toEqual(mockResponse.data)
    })

    test('should handle duplicate coupon code error', async () => {
      const couponData = {
        code: 'EXISTING_CODE',
        discount_percent: 10,
        website_id: 'website123'
      }
      
      const mockError = {
        response: {
          status: 409,
          data: { message: 'Coupon code already exists' }
        }
      }

      mockedAxios.post.mockRejectedValueOnce(mockError)

      await expect(createCoupon(couponData)).rejects.toThrow()
    })

    test('should handle validation errors', async () => {
      const invalidCouponData = {
        code: '', 
        discount_percent: -5, 
        website_id: 'website123'
      }
      
      const mockError = {
        response: {
          status: 400,
          data: { 
            message: 'Validation failed',
            errors: ['Code cannot be empty', 'Discount must be positive']
          }
        }
      }

      mockedAxios.post.mockRejectedValueOnce(mockError)

      await expect(createCoupon(invalidCouponData)).rejects.toThrow()
    })

    test('should send correct coupon data structure', async () => {
      const couponData = {
        code: 'TEST50',
        discount_amount: 100,
        website_id: 'site456',
        minimum_order_amount: 500,
        usage_limit: 10
      }
      
      const mockResponse = { data: { id: 'new_coupon' } }

      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      await createCoupon(couponData)

      const callArgs = mockedAxios.post.mock.calls[0]
      expect(callArgs[1]).toEqual(couponData)
    })

    test('should handle server error', async () => {
      const couponData = { code: 'SERVER_ERROR' }
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      }

      mockedAxios.post.mockRejectedValueOnce(mockError)

      await expect(createCoupon(couponData)).rejects.toThrow()
    })
  })
})