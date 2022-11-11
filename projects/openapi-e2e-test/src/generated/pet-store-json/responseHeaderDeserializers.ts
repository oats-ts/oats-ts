/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/pet-store-json.json (originating from oats-ts/oats-schemas)
 */

import { deserializers, dsl } from '@oats-ts/openapi-runtime'
import { ListPets200ResponseHeaderParameters } from './responseHeaderTypes'

export const listPetsResponseHeadersDeserializer = {
  200: deserializers.createHeaderDeserializer<ListPets200ResponseHeaderParameters>({
    'x-next': dsl.header.simple.primitive(dsl.value.string()),
  }),
} as const
