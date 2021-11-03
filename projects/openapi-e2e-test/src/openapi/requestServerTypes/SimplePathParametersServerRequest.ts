import { HasIssues, HasNoIssues } from '@oats-ts/openapi-http'
import { SimplePathParametersRequest } from '../requestTypes/SimplePathParametersRequest'

export type SimplePathParametersServerRequest =
  | (Partial<SimplePathParametersRequest> & HasIssues)
  | (SimplePathParametersRequest & HasNoIssues)
