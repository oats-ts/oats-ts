import { query } from '../index'
import { QueryDeserializers, QueryOptions } from '../../types'
import { optionalObjectFieldParsers, objectFieldParsers } from '../../value/test/value.testdata'
import { TestDataObject, TypesObject } from '../../testTypes'

function createTypesParsers(config: QueryOptions): TypesObject<QueryDeserializers<any>> {
  return {
    object: {
      optionalFields: { value: query.deepObject.object(optionalObjectFieldParsers, config) },
      requiredFields: { value: query.deepObject.object(objectFieldParsers, config) },
    },
  }
}

export const deepObjectTestParsers: TestDataObject<QueryDeserializers<any>> = {
  explode: {
    required: createTypesParsers({ explode: true, required: true }),
    optional: createTypesParsers({ explode: true, required: false }),
  },
}
