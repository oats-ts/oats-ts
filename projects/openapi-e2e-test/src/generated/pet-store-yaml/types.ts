/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/pet-store-yaml.yaml (originating from oats-ts/oats-schemas)
 */

export type Error = {
  code: number
  message: string
}

export type Pet = {
  id: number
  name: string
  tag?: string
}

export type Pets = Pet[]
