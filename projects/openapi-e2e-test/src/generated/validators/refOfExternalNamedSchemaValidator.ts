import { lazy } from '@oats-ts/validators'
import { externalNamedSchemaValidator } from './externalNamedSchemaValidator'

export const refOfExternalNamedSchemaValidator = lazy(() => externalNamedSchemaValidator)
