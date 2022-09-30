import { ExpressServerAdapter, jsonBodyParser } from '@oats-ts/openapi-express-server-adapter'
import express, { Handler, Router } from 'express'
import { isNil } from 'lodash'
import { argv } from 'process'
import { createBookStoreContextMiddleware } from './generated/book-store/expressContextMiddleware'
import { createBookStoreRouter } from './generated/book-store/expressRouteFactory'
import { createHttpMethodsContextMiddleware } from './generated/methods/expressContextMiddleware'
import { createHttpMethodsRouter } from './generated/methods/expressRouteFactory'
import { createParametersContextMiddleware } from './generated/parameters/expressContextMiddleware'
import { createParametersCorsMiddleware } from './generated/parameters/expressCorsMiddleware'
import { createParametersRouter } from './generated/parameters/expressRouteFactory'
import { BookStoreApiImpl } from './tests/bookStore/BookStoreApiImpl'
import { PATH, PORT } from './tests/constants'
import { HttpMethodsApiImpl } from './tests/methods/HttpMethodsApiImpl'
import { ParametersApiImpl } from './tests/parameters/ParametersApiImpl'

const routers: Record<string, (Router | Handler)[]> = {
  'book-store': [
    createBookStoreContextMiddleware(new BookStoreApiImpl(), new ExpressServerAdapter()),
    createBookStoreRouter(),
  ],
  methods: [
    createHttpMethodsContextMiddleware(new HttpMethodsApiImpl(), new ExpressServerAdapter()),
    createHttpMethodsRouter(),
  ],
  parameters: [
    createParametersContextMiddleware(new ParametersApiImpl(), new ExpressServerAdapter()),
    createParametersCorsMiddleware(),
    createParametersRouter(),
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
