import { ExpressServerAdapter, jsonBodyParser } from '@oats-ts/openapi-express-server-adapter'
import express, { Router } from 'express'
import { isNil } from 'lodash'
import { argv } from 'process'
import { createBookStoreRouter } from './generated/book-store/expressRouteFactory'
import { createHttpMethodsRouter } from './generated/methods/expressRouteFactory'
import { createParametersRouter } from './generated/parameters/expressRouteFactory'
import { BookStoreApiImpl } from './tests/bookStore/BookStoreApiImpl'
import { PATH, PORT } from './tests/constants'
import { HttpMethodsApiImpl } from './tests/methods/HttpMethodsApiImpl'
import { ParametersApiImpl } from './tests/parameters/ParametersApiImpl'

const routers: Record<string, Router> = {
  'book-store': createBookStoreRouter(new BookStoreApiImpl(), new ExpressServerAdapter()),
  methods: createHttpMethodsRouter(new HttpMethodsApiImpl(), new ExpressServerAdapter()),
  parameters: createParametersRouter(new ParametersApiImpl(), new ExpressServerAdapter()),
  // cors: Router()
  //   .options('/cors-test', (req, res) => {
  //     const origin = req.header('origin') ?? ''
  //     if (origin === 'http://localhost:8080') {
  //       res
  //         .header('Access-Control-Allow-Origin', 'http://localhost:8080')
  //         .header('Access-Control-Allow-Methods', 'GET')
  //         .header('Access-Control-Allow-Headers', 'x-custom-req-header')
  //         .header('Access-Control-Expose-Headers', 'x-custom-res-header')
  //         .end()
  //     }
  //   })
  //   .get('/cors-test', (req, res) => {
  //     res.header('x-custom-res-header', `Hi ${req.header('x-custom-req-header')}`).json({ ok: true })
  //   }),
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
