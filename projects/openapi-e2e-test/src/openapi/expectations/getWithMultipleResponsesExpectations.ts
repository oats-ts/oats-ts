import { ResponseExpectations } from '@oats-ts/http'
import { namedSimpleObjectValidator } from '../validators/namedSimpleObjectValidator'
import { lazy, object, optional, shape } from '@oats-ts/validators'
import { namedDeprecatedObjectValidator } from '../validators/namedDeprecatedObjectValidator'
import { namedComplexObjectValidator } from '../validators/namedComplexObjectValidator'

export const getWithMultipleResponsesExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
  201: { 'application/json': object(shape({ test: optional(lazy(() => namedSimpleObjectValidator)) })) },
  205: { 'application/json': namedDeprecatedObjectValidator },
  default: { 'application/json': namedComplexObjectValidator },
}
