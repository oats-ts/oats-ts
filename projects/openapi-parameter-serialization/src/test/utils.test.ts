import { decode, encode } from '../utils'

describe('utils', () => {
  describe('encode', () => {
    it('should return empty string, when input missing', () => {
      expect(encode()).toBe('')
      expect(encode(undefined)).toBe('')
    })
    it('should encode forbidden characters', () => {
      expect(encode('.')).toBe('%2E')
      expect(encode(',')).toBe('%2C')
      expect(encode(';')).toBe('%3B')
      expect(encode('=')).toBe('%3D')
      expect(encode('!')).toBe('%21')
      expect(encode("'")).toBe('%27')
      expect(encode('(')).toBe('%28')
      expect(encode(')')).toBe('%29')
      expect(encode('*')).toBe('%2A')
    })
    it('should encode strings with forbidden characters', () => {
      expect(encode(`.,;=!'()*`)).toBe('%2E%2C%3B%3D%21%27%28%29%2A')
      expect(encode(`a.b,c;d=e!f'g(h)i*j`)).toBe('a%2Eb%2Cc%3Bd%3De%21f%27g%28h%29i%2Aj')
    })
  })
  describe('decode', () => {
    it('should decode strings with forbidden characters', () => {
      expect(decode('%2E%2C%3B%3D%21%27%28%29%2A')).toBe(`.,;=!'()*`)
      expect(decode('a%2Eb%2Cc%3Bd%3De%21f%27g%28h%29i%2Aj')).toBe(`a.b,c;d=e!f'g(h)i*j`)
    })
  })
})
