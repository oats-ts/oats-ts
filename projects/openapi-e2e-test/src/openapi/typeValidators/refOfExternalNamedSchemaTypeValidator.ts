import { lazy } from '@oats-ts/validators'
import { externalNamedSchemaTypeValidator } from './externalNamedSchemaTypeValidator'

export const refOfExternalNamedSchemaTypeValidator = lazy(() => externalNamedSchemaTypeValidator)
