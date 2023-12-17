import { range } from 'lodash'
import {
  randomEnum,
  randomObjectWithArrays,
  randomObjectWithNestedObjects,
  randomObjectWithNullablePrimitives,
  randomObjectWithPrimitives,
  randomOptionalTuple,
  randomTuple,
} from './bodies.testdata'
import { testBodiesServer } from '../servers'
import { bodiesSdk } from '../sdks'
import { REPEATS } from '../constants'
import { random } from '../common/random'

describe('Request and Response bodies', () => {
  // TODO add YAML once deserialization issues have been figured out.
  const configs = ['application/json'] as const

  describe.each(configs)(`%s mime type`, (mimeType) => {
    testBodiesServer(mimeType)
    const sdk = bodiesSdk(mimeType)
    const repeats = range(1, REPEATS + 1)
    it.each(repeats)('(#%d) string', async () => {
      const body = random.string()
      const response = await sdk.str({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) number', async () => {
      const body = random.number()
      const response = await sdk.num({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) boolean', async () => {
      const body = random.boolean()
      const response = await sdk.bool({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) enum', async () => {
      const body = randomEnum()
      const response = await sdk.enm({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) string array', async () => {
      const body = random.arrayOf(() => random.string())
      const response = await sdk.strArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) number array', async () => {
      const body = random.arrayOf(() => random.number())
      const response = await sdk.numArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) boolean array', async () => {
      const body = random.arrayOf(() => random.boolean())
      const response = await sdk.boolArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) enum array', async () => {
      const body = random.arrayOf(randomEnum)
      const response = await sdk.enmArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) object (primitives)', async () => {
      const body = randomObjectWithPrimitives()
      const response = await sdk.primObj({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) object (nullable primitives)', async () => {
      const body = randomObjectWithNullablePrimitives()
      const response = await sdk.nullablePrimObj({ body, mimeType })
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
    it.each(repeats)('(#%d) tuple (primitives)', async () => {
      const body = randomTuple()
      const response = await sdk.primTuple({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(repeats)('(#%d) tuple (primitives, optional)', async () => {
      const body = randomOptionalTuple()
      const response = await sdk.optPrimTuple({ body, mimeType })
      expect(response.body).toEqual(body)
    })
  })
})
