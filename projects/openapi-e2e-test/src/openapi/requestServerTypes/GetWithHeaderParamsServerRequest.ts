import { HasIssues, HasNoIssues } from '@oats-ts/openapi-http'
import { GetWithHeaderParamsRequest } from '../requestTypes/GetWithHeaderParamsRequest'

export type GetWithHeaderParamsServerRequest =
  | (Partial<GetWithHeaderParamsRequest> & HasIssues)
  | (GetWithHeaderParamsRequest & HasNoIssues)
