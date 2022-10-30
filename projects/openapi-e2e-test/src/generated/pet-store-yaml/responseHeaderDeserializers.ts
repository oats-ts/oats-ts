/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/pet-store-yaml.yaml
 */

import { deserializers, dsl } from '@oats-ts/openapi-runtime'
import { ListPets200ResponseHeaderParameters } from './responseHeaderTypes'

export const listPetsResponseHeadersDeserializer = {
  200: deserializers.createHeaderDeserializer<ListPets200ResponseHeaderParameters>({
    'x-next': dsl.header.simple.primitive(dsl.value.string()),
  }),
} as const
