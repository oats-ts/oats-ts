import { ExpressServerAdapter, ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { HttpResponse } from '@oats-ts/openapi-http'
import { testExpressServer } from '@oats-ts/openapi-test-utils'
import YAML from 'yamljs'
import { createBodiesRouter } from '../generated/bodies'
import { createBookStoreRouter } from '../generated/book-store'
import { createHttpMethodsRouter } from '../generated/methods'
import { createParametersRouter } from '../generated/Parameters'
import { BodiesApiImpl } from './bodies/BodiesApiImpl'
import { BookStoreApiImpl } from './bookStore/BookStoreApiImpl'
import { customBodyParsers } from './common/customBodyParsers'
import { PORT } from './constants'
import { HttpMethodsApiImpl } from './methods/HttpMethodsApiImpl'
import { ParametersApiImpl } from './parameters/ParametersApiImpl'

export function testBookStoreServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'each',
    handlers: () => [
      customBodyParsers.json(),
      createBookStoreRouter(new BookStoreApiImpl(), new ExpressServerAdapter()),
    ],
  })
}

export function testBodiesServer(mimeType: 'application/json' | 'application/yaml') {
  class YamlExpressServerAdapter extends ExpressServerAdapter {
    override async getResponseBody(_: ExpressToolkit, { body }: HttpResponse) {
      return YAML.stringify(body)
    }
  }

  const adapter = mimeType === 'application/json' ? new ExpressServerAdapter() : new YamlExpressServerAdapter()

  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'all',
    handlers: () => [
      customBodyParsers.yaml(),
      customBodyParsers.json(),
      createBodiesRouter(new BodiesApiImpl(), adapter),
    ],
  })
}

export function testHttpMethodsServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'all',
    handlers: () => [
      customBodyParsers.yaml(),
      customBodyParsers.json(),
      createHttpMethodsRouter(new HttpMethodsApiImpl(), new ExpressServerAdapter()),
    ],
  })
}

export function testParametersServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'all',
    handlers: () => [
      customBodyParsers.yaml(),
      customBodyParsers.json(),
      createParametersRouter(new ParametersApiImpl(), new ExpressServerAdapter()),
    ],
  })
}
