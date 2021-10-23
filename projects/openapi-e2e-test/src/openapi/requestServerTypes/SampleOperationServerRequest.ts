import { HasIssues, HasNoIssues } from '@oats-ts/openapi-http'
import { SampleOperationRequest } from '../requestTypes/SampleOperationRequest'

export type SampleOperationServerRequest =
  | (Partial<SampleOperationRequest> & HasIssues)
  | (SampleOperationRequest & HasNoIssues)
