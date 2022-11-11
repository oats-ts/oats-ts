/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/pet-store-yaml.yaml (originating from oats-ts/oats-schemas)
 */

import { deserializers, dsl } from '@oats-ts/openapi-runtime'
import { ShowPetByIdPathParameters } from './pathTypes'

export const showPetByIdPathDeserializer = deserializers.createPathDeserializer<ShowPetByIdPathParameters>(
  { petId: dsl.path.simple.primitive(dsl.value.string()) },
  ['petId'],
  /^\/pets(?:\/([^\/#\?]+?))[\/#\?]?$/i,
)
