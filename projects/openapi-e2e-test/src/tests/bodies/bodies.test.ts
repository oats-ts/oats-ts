import { manageServerLifecycle } from '../common/server.hooks'
import { NodeFetchClientConfiguration } from '@oats-ts/openapi-http-client/lib/node-fetch'
import { ExpressParameters, ExpressServerConfiguration } from '@oats-ts/openapi-http-server/lib/express'
import { BodiesApiImpl } from './BodiesApiImpl'
import { BodiesClientSdk, createBodiesRouter } from '../../generated/Bodies'
import YAML from 'yamljs'
import { HttpResponse, TypedHttpRequest } from '@oats-ts/openapi-http'
import { Response } from 'node-fetch'
import { range } from 'lodash'
import { datatype } from 'faker'
import {
  randomEnum,
  randomObjectWithArrays,
  randomObjectWithNestedObjects,
  randomObjectWithPrimitives,
} from './bodies.testdata'
import { arrayOf } from '../common/testData'

describe('Request and Response bodies', () => {
  class YamlExpressServerConfiguration extends ExpressServerConfiguration {
    override async getResponseBody(_: ExpressParameters, { body }: HttpResponse) {
      return YAML.stringify(body)
    }
  }

  class YamlClientConfiguration extends NodeFetchClientConfiguration {
    override async getParsedResponseBody(response: Response): Promise<any> {
      return YAML.parse(await response.text())
    }
    override async getRequestBody(response: Partial<TypedHttpRequest>): Promise<any> {
      return YAML.stringify(response.body)
    }
  }

  const configs = [
    ['application/json', ExpressServerConfiguration, NodeFetchClientConfiguration],
    ['application/yaml', YamlExpressServerConfiguration, YamlClientConfiguration],
  ] as const

  describe.each(configs)(`%s mime type`, (mimeType, ServerConfig, ClientConfig) => {
    manageServerLifecycle(createBodiesRouter(new BodiesApiImpl(), new ServerConfig()))
    const sdk = new BodiesClientSdk(new ClientConfig('http://localhost:3333'))
    const data = range(1, process.env['REPEATS'] ? parseInt(process.env['REPEATS']) + 1 : 11)
    it.each(data)('(#%d) string', async () => {
      const body = datatype.string()
      const response = await sdk.str({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(data)('(#%d) string', async () => {
      const body = datatype.number()
      const response = await sdk.num({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(data)('(#%d) boolean', async () => {
      const body = datatype.boolean()
      const response = await sdk.bool({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(data)('(#%d) enum', async () => {
      const body = randomEnum()
      const response = await sdk.enm({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(data)('(#%d) string array', async () => {
      const body = arrayOf(() => datatype.string())
      const response = await sdk.strArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(data)('(#%d) number array', async () => {
      const body = arrayOf(() => datatype.number())
      const response = await sdk.numArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(data)('(#%d) boolean array', async () => {
      const body = arrayOf(() => datatype.boolean())
      const response = await sdk.boolArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(data)('(#%d) enum array', async () => {
      const body = arrayOf(randomEnum)
      const response = await sdk.enmArr({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(data)('(#%d) object (primitives)', async () => {
      const body = randomObjectWithPrimitives()
      const response = await sdk.primObj({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(data)('(#%d) object (arrays)', async () => {
      const body = randomObjectWithArrays()
      const response = await sdk.arrObj({ body, mimeType })
      expect(response.body).toEqual(body)
    })
    it.each(data)('(#%d) object (nested)', async () => {
      const body = randomObjectWithNestedObjects()
      const response = await sdk.nestedObj({ body, mimeType })
      expect(response.body).toEqual(body)
    })
  })
})
