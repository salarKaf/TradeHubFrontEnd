
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { getItemImages, getItemImageById } from './Items'
import { uploadLogo } from './website'


vi.mock('axios')
const mockedAxios = vi.mocked(axios)


vi.mock('./api', () => ({
  coreBaseURL: 'http://core.localhost/api/v1',
  mediaBaseURL: 'http://media.localhost/api/v1'
}))


const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock


global.URL = {
  createObjectURL: vi.fn()
}

describe('Media Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('valid-token-123')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })


  describe('getItemImages', () => {
    test('should successfully get item images list', async () => {
      const itemId = '12345'
      const mockResponse = {
        data: [
          { image_id: 'img1', is_main: true },
          { image_id: 'img2', is_main: false },
          { image_id: 'img3', is_main: false }
        ]
      }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const result = await getItemImages(itemId)

      expect(localStorageMock.getItem).toHaveBeenCalledWith('token')
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `http://media.localhost/api/v1/item/get_item_images/${itemId}`,
        {
          headers: {
            Authorization: 'Bearer valid-token-123',
          },
        }
      )
      expect(result).toEqual(mockResponse.data)
    })

    test('should handle empty images list', async () => {
      const itemId = '67890'
      const mockResponse = { data: [] }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const result = await getItemImages(itemId)

      expect(result).toEqual([])
    })

    test('should throw error when unauthorized', async () => {
      const itemId = '12345'
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized access' }
        }
      }

      mockedAxios.get.mockRejectedValueOnce(mockError)

      await expect(getItemImages(itemId)).rejects.toThrow()
    })

    test('should handle missing token', async () => {
      const itemId = '12345'
      localStorageMock.getItem.mockReturnValue(null)


      const mockResponse = { data: [] }
      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const result = await getItemImages(itemId)

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `http://media.localhost/api/v1/item/get_item_images/${itemId}`,
        {
          headers: {
            Authorization: 'Bearer null',
          },
        }
      )
      expect(result).toEqual([])
    })
  })


  describe('getItemImageById', () => {
    test('should successfully get image blob and create object URL', async () => {
      const imageId = 'img123'
      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' })
      const mockResponse = { data: mockBlob }
      const mockObjectURL = 'blob:http://localhost/fake-url'

      mockedAxios.get.mockResolvedValueOnce(mockResponse)
      global.URL.createObjectURL.mockReturnValue(mockObjectURL)

      const result = await getItemImageById(imageId)

      expect(localStorageMock.getItem).toHaveBeenCalledWith('token')
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `http://media.localhost/api/v1/item/get_item_image/${imageId}`,
        {
          headers: {
            Authorization: 'Bearer valid-token-123',
          },
          responseType: 'blob',
        }
      )
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(result).toBe(mockObjectURL)
    })

    test('should handle image not found', async () => {
      const imageId = 'nonexistent'
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Image not found' }
        }
      }

      mockedAxios.get.mockRejectedValueOnce(mockError)

      await expect(getItemImageById(imageId)).rejects.toThrow()
    })

    test('should use correct response type for blob', async () => {
      const imageId = 'img456'
      const mockResponse = { data: new Blob() }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)
      global.URL.createObjectURL.mockReturnValue('blob-url')

      await getItemImageById(imageId)

      const callArgs = mockedAxios.get.mock.calls[0]
      expect(callArgs[1].responseType).toBe('blob')
    })
  })


  describe('uploadLogo', () => {
    test('should successfully upload logo', async () => {
      const websiteId = 'website123'
      const mockFile = new File(['logo content'], 'logo.png', { type: 'image/png' })
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Logo uploaded successfully',
          logo_url: 'https://example.com/logo.png'
        }
      }

      mockedAxios.put.mockResolvedValueOnce(mockResponse)


      const result = await uploadLogo(websiteId, mockFile)

      expect(localStorageMock.getItem).toHaveBeenCalledWith('token')
      

      expect(mockedAxios.put).toHaveBeenCalledTimes(1)
      
      const [url, sentFormData, config] = mockedAxios.put.mock.calls[0]
      
      expect(url).toBe(`http://media.localhost/api/v1/website/upload_logo/${websiteId}`)
      expect(sentFormData).toBeInstanceOf(FormData)
      expect(config.headers.Authorization).toBe('Bearer valid-token-123')
      expect(config.headers['Content-Type']).toBe('multipart/form-data')
      
      expect(result).toEqual(mockResponse.data)
    })

    test('should handle file size too large error', async () => {
      const websiteId = 'website123'
      const mockFile = new File(['large content'], 'large-logo.png', { type: 'image/png' })
      const mockError = {
        response: {
          status: 413,
          data: { message: 'File size too large' }
        }
      }

      mockedAxios.put.mockRejectedValueOnce(mockError)

      await expect(uploadLogo(websiteId, mockFile)).rejects.toThrow()
    })

    test('should handle invalid file type error', async () => {
      const websiteId = 'website123'
      const mockFile = new File(['content'], 'document.txt', { type: 'text/plain' })
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Invalid file type' }
        }
      }

      mockedAxios.put.mockRejectedValueOnce(mockError)

      await expect(uploadLogo(websiteId, mockFile)).rejects.toThrow()
    })

    test('should send correct headers for file upload', async () => {
      const websiteId = 'test-site'
      const mockFile = new File(['test content'], 'test-logo.png', { type: 'image/png' })
      const mockResponse = { data: { success: true } }

      mockedAxios.put.mockResolvedValueOnce(mockResponse)

      await uploadLogo(websiteId, mockFile)

      const callArgs = mockedAxios.put.mock.calls[0]
      const headers = callArgs[2].headers

      expect(headers.Authorization).toBe('Bearer valid-token-123')
      expect(headers['Content-Type']).toBe('multipart/form-data')
    })
  })
})