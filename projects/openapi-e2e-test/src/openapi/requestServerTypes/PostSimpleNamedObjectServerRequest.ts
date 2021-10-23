import { HasIssues, HasNoIssues } from '@oats-ts/openapi-http'
import { PostSimpleNamedObjectRequest } from '../requestTypes/PostSimpleNamedObjectRequest'

export type PostSimpleNamedObjectServerRequest =
  | (Partial<PostSimpleNamedObjectRequest> & HasIssues)
  | (PostSimpleNamedObjectRequest & HasNoIssues)
