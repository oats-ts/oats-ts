import { ExpressServerAdapter, ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { HttpResponse } from '@oats-ts/openapi-http'
import YAML from 'yamljs'
import { BodiesApiImpl } from './bodies/BodiesApiImpl'
import { OptionalBodiesImpl } from './bodies/OptionalBodiesApiImpl'
import { BookStoreApiImpl } from './bookStore/BookStoreApiImpl'
import { customBodyParsers } from './common/customBodyParsers'
import { PORT } from './constants'
import { HttpMethodsApiImpl } from './methods/HttpMethodsApiImpl'
import { ParametersApiImpl } from './parameters/ParametersApiImpl'
import { testExpressServer } from '../testExpressServer'
import { createBookStoreRouter } from '../generated/book-store/expressRouteFactory'
import { createBodiesRouter as createOptionalRequestBodyRouter } from '../generated/optional-request-body/expressRouteFactory'
import { createBodiesRouter } from '../generated/bodies/expressRouteFactory'
import { createHttpMethodsRouter } from '../generated/methods/expressRouteFactory'
import { createParametersRouter } from '../generated/parameters/expressRouteFactory'

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

export function testOptionalBodiesServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'each',
    handlers: () => [
      customBodyParsers.json(),
      createOptionalRequestBodyRouter(new OptionalBodiesImpl(), new ExpressServerAdapter()),
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
