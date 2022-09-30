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
import { createParametersCorsMiddleware } from '../generated/parameters/expressCorsMiddleware'
import { createParametersContextMiddleware } from '../generated/parameters/expressContextMiddleware'
import { createHttpMethodsContextMiddleware } from '../generated/methods/expressContextMiddleware'
import { createBodiesContextMiddleware } from '../generated/bodies/expressContextMiddleware'
import { createBodiesContextMiddleware as createOptBodiesContextMiddleware } from '../generated/optional-request-body/expressContextMiddleware'
import { createBookStoreContextMiddleware } from '../generated/book-store/expressContextMiddleware'

export function testBookStoreServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'each',
    handlers: () => [
      customBodyParsers.json(),
      createBookStoreContextMiddleware(new BookStoreApiImpl(), new ExpressServerAdapter()),
      createBookStoreRouter(),
    ],
  })
}

export function testOptionalBodiesServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'each',
    handlers: () => [
      customBodyParsers.json(),
      createOptBodiesContextMiddleware(new OptionalBodiesImpl(), new ExpressServerAdapter()),
      createOptionalRequestBodyRouter(),
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
      createBodiesContextMiddleware(new BodiesApiImpl(), adapter),
      createBodiesRouter(),
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
      createHttpMethodsContextMiddleware(new HttpMethodsApiImpl(), new ExpressServerAdapter()),
      createHttpMethodsRouter(),
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
      createParametersContextMiddleware(new ParametersApiImpl(), new ExpressServerAdapter()),
      createParametersRouter(),
      createParametersCorsMiddleware(),
    ],
  })
}
