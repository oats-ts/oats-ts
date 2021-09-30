import { HasRequestBody } from '@oats-ts/openapi-http'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type PostSimpleNamedObjectRequest = HasRequestBody<'application/json', NamedSimpleObject>
