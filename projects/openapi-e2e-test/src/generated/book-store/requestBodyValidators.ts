/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/book-store.json
 */

import { validators } from '@oats-ts/openapi-runtime'
import { bookTypeValidator } from './typeValidators'

export const addBookRequestBodyValidator = { 'application/json': validators.lazy(() => bookTypeValidator) } as const
