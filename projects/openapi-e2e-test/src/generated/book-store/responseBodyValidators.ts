/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/book-store.json
 */

import { validators } from '@oats-ts/openapi-runtime'
import { appErrorTypeValidator, bookTypeValidator } from './typeValidators'

export const addBookResponseBodyValidator = {
  201: { 'application/json': validators.lazy(() => bookTypeValidator) },
  400: { 'application/json': validators.array(validators.items(validators.lazy(() => appErrorTypeValidator))) },
  500: { 'application/json': validators.array(validators.items(validators.lazy(() => appErrorTypeValidator))) },
} as const

export const getBookResponseBodyValidator = {
  200: { 'application/json': validators.lazy(() => bookTypeValidator) },
  400: { 'application/json': validators.array(validators.items(validators.lazy(() => appErrorTypeValidator))) },
  500: { 'application/json': validators.array(validators.items(validators.lazy(() => appErrorTypeValidator))) },
} as const

export const getBooksResponseBodyValidator = {
  200: { 'application/json': validators.array(validators.items(validators.lazy(() => bookTypeValidator))) },
  400: { 'application/json': validators.array(validators.items(validators.lazy(() => appErrorTypeValidator))) },
  500: { 'application/json': validators.array(validators.items(validators.lazy(() => appErrorTypeValidator))) },
} as const
