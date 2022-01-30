import { range } from 'lodash'
import { datatype } from 'faker'
import {
  randomEnum,
  randomObjectWithArrays,
  randomObjectWithNestedObjects,
  randomObjectWithPrimitives,
} from './bodies.testdata'
import { arrayOf } from '../common/testData'
import { testBodiesServer } from '../servers'
import { bodiesSdk } from '../sdks'
import { REPEATS } from '../constants'

describe('Request and Response bodies', () => {
  const configs = ['application/json', 'application/yaml'] as const

  describe.each(configs)(`%s mime type`, (mimeType) => {
    testBodiesServer(mimeType)
    const sdk = bodiesSdk(mimeType)
    const repeats = range(1, REPEATS)
    it.each(repeats)('(#%d) string', async () => {
      const body = datatype.string(10)
      const response = await sdk.str({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) number', async () => {
      const body = datatype.number()
      const response = await sdk.num({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) boolean', async () => {
      const body = datatype.boolean()
      const response = await sdk.bool({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) enum', async () => {
      const body = randomEnum()
      const response = await sdk.enm({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) string array', async () => {
      const body = arrayOf(() => datatype.string())
      const response = await sdk.strArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) number array', async () => {
      const body = arrayOf(() => datatype.number())
      const response = await sdk.numArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) boolean array', async () => {
      const body = arrayOf(() => datatype.boolean())
      const response = await sdk.boolArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) enum array', async () => {
      const body = arrayOf(randomEnum)
      const response = await sdk.enmArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) object (primitives)', async () => {
      const body = randomObjectWithPrimitives()
      const response = await sdk.primObj({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) object (arrays)', async () => {
      const body = randomObjectWithArrays()
      const response = await sdk.arrObj({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) object (nested)', async () => {
      const body = randomObjectWithNestedObjects()
      const response = await sdk.nestedObj({ body, mimeType })
      expect(response.body).toEqual(body)
    })
  })
})
