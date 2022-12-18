/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/irregular-parameters.json (originating from oats-ts/oats-schemas)
 */

export type IrregularParametersServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: {
        multiTypeEnum: 'str' | 125 | 0.13 | true
        primitiveIntersection: string & string
        primitiveUnion: string | number | boolean
      }
    }
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: {
        message: string
      }[]
    }
