import { ExpressServerAdapter, jsonBodyParser } from '@oats-ts/openapi-express-server-adapter'
import express, { Handler, Router } from 'express'
import { isNil } from 'lodash'
import { argv } from 'process'
import { createBookStoreContextHandler } from './generated/book-store/expressContextHandlerFactory'
import { createBookStoreAppRouter } from './generated/book-store/expressAppRouterFactory'
import { createHttpMethodsContextHandler } from './generated/methods/expressContextHandlerFactory'
import { createHttpMethodsAppRouter } from './generated/methods/expressAppRouterFactory'
import { createParametersContextHandler } from './generated/parameters/expressContextHandlerFactory'
import { createParametersCorsRouter } from './generated/parameters/expressCorsRouterFactory'
import { createParametersAppRouter } from './generated/parameters/expressAppRouterFactory'
import { BookStoreApiImpl } from './tests/bookStore/BookStoreApiImpl'
import { PATH, PORT } from './tests/constants'
import { HttpMethodsApiImpl } from './tests/methods/HttpMethodsApiImpl'
import { ParametersApiImpl } from './tests/parameters/ParametersApiImpl'

const routers: Record<string, (Router | Handler)[]> = {
  'book-store': [
    createBookStoreContextHandler(new BookStoreApiImpl(), new ExpressServerAdapter()),
    createBookStoreAppRouter(),
  ],
  methods: [
    createHttpMethodsContextHandler(new HttpMethodsApiImpl(), new ExpressServerAdapter()),
    createHttpMethodsAppRouter(),
  ],
  parameters: [
    createParametersContextHandler(new ParametersApiImpl(), new ExpressServerAdapter()),
    createParametersCorsRouter(),
    createParametersAppRouter(),
  ],
}

const serverArg = argv[2] as keyof typeof routers
const router = routers[serverArg]

if (isNil(router)) {
  throw new TypeError(
    `Unexpected server "${serverArg}". Expected one of ${Object.keys(routers)
      .map((key) => `"${key}"`)
      .join(', ')}`,
  )
}

const app = express()
app.use(jsonBodyParser())
app.use(router)

app.listen(PORT, () => console.log(`Server "${serverArg}" running on ${PATH}`))
