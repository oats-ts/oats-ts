import { HasIssues, HasNoIssues } from '@oats-ts/openapi-http'
import { LabelPathParametersRequest } from '../requestTypes/LabelPathParametersRequest'

export type LabelPathParametersServerRequest =
  | (Partial<LabelPathParametersRequest> & HasIssues)
  | (LabelPathParametersRequest & HasNoIssues)
