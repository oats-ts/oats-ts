/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/additional-properties-boolean.json (originating from oats-ts/oats-schemas)
 */

import { validators } from '@oats-ts/openapi-runtime'

export const additionaPropertiesFalseWithPropsTypeValidator = validators.object(
  validators.shape({ foo: validators.string() }),
)

export const additionaPropertiesTrueWithPropsTypeValidator = validators.any()

export const additionalPropertiesFalseTypeValidator = validators.object(validators.shape({}))

export const additionalPropertiesTrueTypeValidator = validators.any()