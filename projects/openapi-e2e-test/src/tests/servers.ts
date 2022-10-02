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
import { createBookStoreAppRouter } from '../generated/book-store/expressAppRouterFactory'
import { createOptionalBodiesAppRouter } from '../generated/optional-request-body/expressAppRouterFactory'
import { createBodiesAppRouter } from '../generated/bodies/expressAppRouterFactory'
import { createHttpMethodsAppRouter } from '../generated/methods/expressAppRouterFactory'
import { createParametersAppRouter } from '../generated/parameters/expressAppRouterFactory'
import { createParametersCorsRouter } from '../generated/parameters/expressCorsRouterFactory'
import { createParametersContextHandler } from '../generated/parameters/expressContextHandlerFactory'
import { createHttpMethodsContextHandler } from '../generated/methods/expressContextHandlerFactory'
import { createBodiesContextHandler } from '../generated/bodies/expressContextHandlerFactory'
import { createOptionalBodiesContextHandler } from '../generated/optional-request-body/expressContextHandlerFactory'
import { createBookStoreContextHandler } from '../generated/book-store/expressContextHandlerFactory'
import { Router } from 'express'
import { createFormQueryParametersRouter } from '../generated/parameters/expressRouterFactories'

export function testBookStoreServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'each',
    handlers: () => [
      customBodyParsers.json(),
      createBookStoreContextHandler(new BookStoreApiImpl(), new ExpressServerAdapter()),
      createBookStoreAppRouter(),
    ],
  })
}

export function testOptionalBodiesServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'each',
    handlers: () => [
      customBodyParsers.json(),
      createOptionalBodiesContextHandler(new OptionalBodiesImpl(), new ExpressServerAdapter()),
      createOptionalBodiesAppRouter(),
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
      createBodiesContextHandler(new BodiesApiImpl(), adapter),
      createBodiesAppRouter(),
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
      createHttpMethodsContextHandler(new HttpMethodsApiImpl(), new ExpressServerAdapter()),
      createHttpMethodsAppRouter(),
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
      createParametersContextHandler(new ParametersApiImpl(), new ExpressServerAdapter()),
      createParametersAppRouter(createParametersCorsRouter(Router()), {
        createFormQueryParametersRouter: () => createFormQueryParametersRouter(),
      }),
    ],
  })
}
