import { ResponseExpectations } from '@oats-ts/openapi-http'
import { lazy, object, optional, shape } from '@oats-ts/validators'
import { namedComplexObjectValidator } from '../validators/namedComplexObjectValidator'
import { namedDeprecatedObjectValidator } from '../validators/namedDeprecatedObjectValidator'
import { namedSimpleObjectValidator } from '../validators/namedSimpleObjectValidator'

export const getWithMultipleResponsesExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
  201: { 'application/json': object(shape({ test: optional(lazy(() => namedSimpleObjectValidator)) })) },
  205: { 'application/json': namedDeprecatedObjectValidator },
  default: { 'application/json': namedComplexObjectValidator },
}
