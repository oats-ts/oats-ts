/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/pet-store-json.json (originating from oats-ts/oats-schemas)
 */

import { validators } from '@oats-ts/openapi-runtime'
import { errorTypeValidator, petTypeValidator, petsTypeValidator } from './typeValidators'

export const createPetsResponseBodyValidator = {
  201: { 'application/json': validators.lazy(() => petTypeValidator) },
  default: { 'application/json': validators.lazy(() => errorTypeValidator) },
} as const

export const listPetsResponseBodyValidator = {
  200: { 'application/json': validators.lazy(() => petsTypeValidator) },
  default: { 'application/json': validators.lazy(() => errorTypeValidator) },
} as const

export const showPetByIdResponseBodyValidator = {
  200: { 'application/json': validators.lazy(() => petTypeValidator) },
  default: { 'application/json': validators.lazy(() => errorTypeValidator) },
} as const
