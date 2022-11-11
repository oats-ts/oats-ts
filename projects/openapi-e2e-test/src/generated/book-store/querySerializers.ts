/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/book-store.json (originating from oats-ts/oats-schemas)
 */

import { dsl, serializers } from '@oats-ts/openapi-runtime'
import { GetBooksQueryParameters } from './queryTypes'

export const getBooksQuerySerializer = serializers.createQuerySerializer<GetBooksQueryParameters>({
  offset: dsl.query.form.primitive(dsl.value.number(), { required: false }),
})
