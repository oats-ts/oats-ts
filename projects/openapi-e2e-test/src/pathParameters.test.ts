import { createClientSdk } from './createClientSdk'
import { PathParametersPayload } from './openapi/types/PathParametersPayload'

describe('Path parameters', () => {
  const sdk = createClientSdk()
  const parameters: PathParametersPayload = {
    s: 'string explode off',
    se: 'string explode on',
    n: 13,
    ne: 0.45,
    b: true,
    be: false,
    e: 'A',
    ee: 'C',
    a: [1, 2.31, 0.3],
    ae: [1.34, 0.2, 3123],
    o: {
      s: 'A string',
      n: 123.32,
      e: 'A',
      b: false,
    },
    oe: {
      s: 'A string (no explode)',
      n: 9999999,
      e: 'C',
      b: true,
    },
  }

  describe('simple', () => {
    it('should properly send and receive path parameters', async () => {
      const response = await sdk.simplePathParameters({ path: parameters })
      expect(response.body).toEqual(parameters)
      expect(response.statusCode).toBe(200)
      expect(response.mimeType).toBe('application/json')
    })
  })
  describe('label', () => {
    it('should properly send and receive path parameters', async () => {
      const response = await sdk.simplePathParameters({ path: parameters })
      expect(response.body).toEqual(parameters)
      expect(response.statusCode).toBe(200)
      expect(response.mimeType).toBe('application/json')
    })
  })
  describe('matrix', () => {
    it('should properly send and receive path parameters', async () => {
      const response = await sdk.matrixPathParameters({ path: parameters })
      expect(response.body).toEqual(parameters)
      expect(response.statusCode).toBe(200)
      expect(response.mimeType).toBe('application/json')
    })
  })
})
