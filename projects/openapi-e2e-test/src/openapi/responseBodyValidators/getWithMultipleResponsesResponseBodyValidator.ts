import { lazy, object, optional, shape } from '@oats-ts/validators'
import { namedComplexObjectTypeValidator } from '../typeValidators/namedComplexObjectTypeValidator'
import { namedDeprecatedObjectTypeValidator } from '../typeValidators/namedDeprecatedObjectTypeValidator'
import { namedSimpleObjectTypeValidator } from '../typeValidators/namedSimpleObjectTypeValidator'

export const getWithMultipleResponsesResponseBodyValidator = {
  200: { 'application/json': namedSimpleObjectTypeValidator },
  201: { 'application/json': object(shape({ test: optional(lazy(() => namedSimpleObjectTypeValidator)) })) },
  205: { 'application/json': namedDeprecatedObjectTypeValidator },
  default: { 'application/json': namedComplexObjectTypeValidator },
} as const
