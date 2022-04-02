import { isSuccess, Success } from '@oats-ts/try'
import { fileRead, httpsRead } from './readers'
import { fileUriSanitizer } from './sanitizers'

describe('readers', () => {
  describe('File', () => {
    it('should read a local file', async () => {
      const pathTry = fileUriSanitizer('package.json')
      expect(isSuccess(pathTry)).toBe(true)
      const path = (pathTry as Success<string>).data
      const contentTry = await fileRead(path)
      expect(isSuccess(contentTry)).toBe(true)
      const content = (contentTry as Success<string>).data
      expect(typeof content).toBe('string')
    })
  })
  describe('HTTPS', () => {
    it('should read a local file', async () => {
      const contentTry = await httpsRead(
        'https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/book-store.json',
      )
      expect(isSuccess(contentTry)).toBe(true)
      const content = (contentTry as Success<string>).data
      expect(typeof content).toBe('string')
    })
  })
  describe('HTTP', () => {
    // TODO
  })
})
