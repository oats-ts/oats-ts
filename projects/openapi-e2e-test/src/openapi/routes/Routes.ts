import { Router } from 'express'

export type Routes = {
  getSimpleNamedObjectRoute: Router
  getWithDefaultResponseRoute: Router
  getWithHeaderParamsRoute: Router
  getWithMultipleResponsesRoute: Router
  getWithPathParamsRoute: Router
  getWithQueryParamsRoute: Router
  postSimpleNamedObjectRoute: Router
  sampleOperationRoute: Router
}
