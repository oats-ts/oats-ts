import { ExpressServerAdapter, jsonBodyParser } from '@oats-ts/openapi-express-server-adapter'
import express, { IRouter, Router } from 'express'
import { createHttpMethodsContextHandler } from './generated/methods/expressContextHandlerFactory'
import { createHttpMethodsAppRouter } from './generated/methods/expressAppRouterFactory'
import { createParametersContextHandler } from './generated/parameters/expressContextHandlerFactory'
import { createParametersCorsRouter } from './generated/parameters/expressCorsRouterFactory'
import { createParametersAppRouter } from './generated/parameters/expressAppRouterFactory'
import { PATH, PORT } from './tests/constants'
import { HttpMethodsApiImpl } from './tests/methods/HttpMethodsApiImpl'
import { ParametersApiImpl } from './tests/parameters/ParametersApiImpl'
import { createHttpMethodsCorsRouter } from './generated/methods/expressCorsRouterFactory'
import { createBookStoreContextHandler } from './generated/book-store/expressContextHandlerFactory'
import { BookStoreApiImpl } from './tests/bookStore/BookStoreApiImpl'
import { createBookStoreAppRouter } from './generated/book-store/expressAppRouterFactory'
import { createBookStoreCorsRouter } from './generated/book-store/expressCorsRouterFactory'

const app = express().use(jsonBodyParser())

export function methodsRouter(): IRouter {
  const router = Router()
  createHttpMethodsContextHandler(router, new HttpMethodsApiImpl(), new ExpressServerAdapter())
  createHttpMethodsCorsRouter(router)
  createHttpMethodsAppRouter(router)
  return router
}

export function parametersRouter(): IRouter {
  const router = Router()
  createParametersContextHandler(router, new ParametersApiImpl(), new ExpressServerAdapter())
  createParametersCorsRouter(router)
  createParametersAppRouter(router)
  return router
}

export function bookStoreRouter(): IRouter {
  const router = Router()
  createBookStoreContextHandler(router, new BookStoreApiImpl(), new ExpressServerAdapter())
  createBookStoreCorsRouter(router)
  createBookStoreAppRouter(router)
  return router
}

app.use('/parameters', parametersRouter())
app.use('/methods', methodsRouter())
app.use('/book-store', bookStoreRouter())

app.listen(PORT, () => console.log(`Server is running on ${PATH}`))
