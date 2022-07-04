import { query } from '../index'
import { optionalObjectFieldParsers, objectFieldParsers } from '../../value/test/valueTestData'
import { TestDataObject, TypesObject } from '../../test/testTypes'
import { DslConfig, QueryDeserializers } from '../../../types'

function createTypesParsers(config: DslConfig): TypesObject<QueryDeserializers<any>> {
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
