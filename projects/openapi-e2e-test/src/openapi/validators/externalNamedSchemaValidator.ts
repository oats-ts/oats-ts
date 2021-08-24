import { lazy } from '@oats-ts/validators'
import { additionalServiceTypeValidator } from './additionalServiceTypeValidator'

export const externalNamedSchemaValidator = lazy(() => additionalServiceTypeValidator)
