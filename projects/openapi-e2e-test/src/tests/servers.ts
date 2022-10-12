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
import { createParametersContextRouter } from '../generated/parameters/expressContextRouterFactory'
import { createHttpMethodsContextRouter } from '../generated/methods/expressContextRouterFactory'
import { createBodiesContextRouter } from '../generated/bodies/expressContextRouterFactory'
import { createOptionalBodiesContextRouter } from '../generated/optional-request-body/expressContextRouterFactory'
import { createBookStoreContextRouter } from '../generated/book-store/expressContextRouterFactory'
import { Router } from 'express'
import { createFormQueryParametersRouter } from '../generated/parameters/expressRouterFactories'

export function testBookStoreServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'each',
    attachHandlers: (router) => {
      router.use(customBodyParsers.json())
      createBookStoreContextRouter(router, new BookStoreApiImpl(), new ExpressServerAdapter())
      createBookStoreAppRouter(router)
    },
  })
}

export function testOptionalBodiesServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'each',
    attachHandlers: (router) => {
      router.use(customBodyParsers.json())
      createOptionalBodiesContextRouter(router, new OptionalBodiesImpl(), new ExpressServerAdapter())
      createOptionalBodiesAppRouter(router)
    },
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
    attachHandlers: (router) => {
      router.use(customBodyParsers.yaml())
      router.use(customBodyParsers.json())
      createBodiesContextRouter(router, new BodiesApiImpl(), adapter)
      createBodiesAppRouter(router)
    },
  })
}

export function testHttpMethodsServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'all',
    attachHandlers: (router) => {
      router.use(customBodyParsers.yaml())
      router.use(customBodyParsers.json())
      createHttpMethodsContextRouter(router, new HttpMethodsApiImpl(), new ExpressServerAdapter())
      createHttpMethodsAppRouter(router)
    },
  })
}

export function testParametersServer() {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'all',
    attachHandlers: (router) => {
      router.use(customBodyParsers.yaml())
      router.use(customBodyParsers.json())
      router.use(createParametersContextRouter(undefined, new ParametersApiImpl(), new ExpressServerAdapter())),
        router.use(
          createParametersAppRouter(createParametersCorsRouter(Router()), {
            createFormQueryParametersRouter: () => createFormQueryParametersRouter(),
          }),
        )
    },
  })
}
