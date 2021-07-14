import { lazy } from '@oats-ts/validators'
import { refOfExternalNamedSchemaValidator } from './refOfExternalNamedSchemaValidator'

export const refOfRefOfExternalNamedSchemaValidator = lazy(() => refOfExternalNamedSchemaValidator)
