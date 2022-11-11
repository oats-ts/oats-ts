/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/pet-store-yaml.yaml (originating from oats-ts/oats-schemas)
 */

import { ListPets200ResponseHeaderParameters } from './responseHeaderTypes'
import { Error, Pet, Pets } from './types'

export type CreatePetsResponse =
  | {
      statusCode: 201
      mimeType: 'application/json'
      body: Pet
    }
  | {
      statusCode: Exclude<number, 201>
      mimeType: 'application/json'
      body: Error
    }

export type ListPetsResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: Pets
      headers: ListPets200ResponseHeaderParameters
    }
  | {
      statusCode: Exclude<number, 200>
      mimeType: 'application/json'
      body: Error
    }

export type ShowPetByIdResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: Pet
    }
  | {
      statusCode: Exclude<number, 200>
      mimeType: 'application/json'
      body: Error
    }
