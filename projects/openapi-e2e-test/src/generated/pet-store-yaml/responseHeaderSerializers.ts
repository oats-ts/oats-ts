/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/pet-store-yaml.yaml (originating from oats-ts/oats-schemas)
 */

import { dsl, serializers } from '@oats-ts/openapi-runtime'
import { ListPets200ResponseHeaderParameters } from './responseHeaderTypes'

export const listPetsResponseHeadersSerializer = {
  200: serializers.createHeaderSerializer<ListPets200ResponseHeaderParameters>({
    'x-next': dsl.header.simple.primitive(dsl.value.string()),
  }),
} as const
