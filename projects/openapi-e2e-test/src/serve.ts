import { ExpressServerAdapter, jsonBodyParser } from '@oats-ts/openapi-express-server-adapter'
import express, { Router } from 'express'
import { isNil } from 'lodash'
import { argv } from 'process'
import { createBookStoreRouter } from './generated/book-store'
import { createHttpMethodsRouter } from './generated/methods'
import { createParametersRouter } from './generated/parameters'
import { BookStoreApiImpl } from './tests/bookStore/BookStoreApiImpl'
import { HttpMethodsApiImpl } from './tests/methods/HttpMethodsApiImpl'
import { ParametersApiImpl } from './tests/parameters/ParametersApiImpl'

const routers: Record<string, Router> = {
  'book-store': createBookStoreRouter(new BookStoreApiImpl(), new ExpressServerAdapter()),
  methods: createHttpMethodsRouter(new HttpMethodsApiImpl(), new ExpressServerAdapter()),
  parameters: createParametersRouter(new ParametersApiImpl(), new ExpressServerAdapter()),
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

app.listen(5000, () => console.log(`Server "${serverArg}" running on http://localhost:5000`))
