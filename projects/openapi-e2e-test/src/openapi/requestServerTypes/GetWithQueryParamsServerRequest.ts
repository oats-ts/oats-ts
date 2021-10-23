import { HasIssues, HasNoIssues } from '@oats-ts/openapi-http'
import { GetWithQueryParamsRequest } from '../requestTypes/GetWithQueryParamsRequest'

export type GetWithQueryParamsServerRequest =
  | (Partial<GetWithQueryParamsRequest> & HasIssues)
  | (GetWithQueryParamsRequest & HasNoIssues)
