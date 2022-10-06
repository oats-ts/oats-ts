import { ExpressServerAdapter, jsonBodyParser } from '@oats-ts/openapi-express-server-adapter'
import express from 'express'
import { createHttpMethodsContextHandler } from './generated/methods/expressContextHandlerFactory'
import { createHttpMethodsAppRouter } from './generated/methods/expressAppRouterFactory'
import { createParametersContextHandler } from './generated/parameters/expressContextHandlerFactory'
import { createParametersCorsRouter } from './generated/parameters/expressCorsRouterFactory'
import { createParametersAppRouter } from './generated/parameters/expressAppRouterFactory'
import { PATH, PORT } from './tests/constants'
import { HttpMethodsApiImpl } from './tests/methods/HttpMethodsApiImpl'
import { ParametersApiImpl } from './tests/parameters/ParametersApiImpl'
import { createHttpMethodsCorsRouter } from './generated/methods/expressCorsRouterFactory'

const app = express()
  .use(jsonBodyParser())
  .use(createHttpMethodsContextHandler(new HttpMethodsApiImpl(), new ExpressServerAdapter()))
  .use(createParametersContextHandler(new ParametersApiImpl(), new ExpressServerAdapter()))

createHttpMethodsCorsRouter(app)
createHttpMethodsAppRouter(app)

createParametersCorsRouter(app)
createParametersAppRouter(app)

app.listen(PORT, () => console.log(`Server is running on ${PATH}`))
