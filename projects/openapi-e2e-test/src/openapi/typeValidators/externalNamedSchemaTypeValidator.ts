import { lazy } from '@oats-ts/validators'
import { additionalServiceTypeTypeValidator } from './additionalServiceTypeTypeValidator'

export const externalNamedSchemaTypeValidator = lazy(() => additionalServiceTypeTypeValidator)
