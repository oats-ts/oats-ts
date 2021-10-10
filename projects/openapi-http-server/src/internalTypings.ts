import { HasHeaders, HasPathParameters, HasQueryParameters, HasRequestBody } from '@oats-ts/openapi-http'

export type TypedRequest = HasRequestBody<any, any> & HasHeaders<any> & HasPathParameters<any> & HasQueryParameters<any>
