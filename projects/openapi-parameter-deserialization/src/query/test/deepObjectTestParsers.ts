import { query } from '../index'
import { QueryValueDeserializers, QueryOptions } from '../../types'
import { optionalObjectFieldParsers, objectFieldParsers } from '../../value/test/valueTestData'
import { TestDataObject, TypesObject } from '../../test/testTypes'

function createTypesParsers(config: QueryOptions): TypesObject<QueryValueDeserializers<any>> {
  return {
    object: {
      optionalFields: { value: query.deepObject.object(optionalObjectFieldParsers, config) },
      requiredFields: { value: query.deepObject.object(objectFieldParsers, config) },
    },
  }
}

export const deepObjectTestParsers: TestDataObject<QueryValueDeserializers<any>> = {
  explode: {
    required: createTypesParsers({ explode: true, required: true }),
    optional: createTypesParsers({ explode: true, required: false }),
  },
}