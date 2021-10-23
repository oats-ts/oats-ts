import { HasIssues, HasNoIssues } from '@oats-ts/openapi-http'
import { GetWithPathParamsRequest } from '../requestTypes/GetWithPathParamsRequest'

export type GetWithPathParamsServerRequest =
  | (Partial<GetWithPathParamsRequest> & HasIssues)
  | (GetWithPathParamsRequest & HasNoIssues)
