import { HasIssues, HasNoIssues } from '@oats-ts/openapi-http'
import { MatrixPathParametersRequest } from '../requestTypes/MatrixPathParametersRequest'

export type MatrixPathParametersServerRequest =
  | (Partial<MatrixPathParametersRequest> & HasIssues)
  | (MatrixPathParametersRequest & HasNoIssues)
