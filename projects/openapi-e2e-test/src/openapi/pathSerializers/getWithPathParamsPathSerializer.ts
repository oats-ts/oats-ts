import { createPathSerializer, path } from '@oats-ts/openapi-parameter-serialization'
import { GetWithPathParamsPathParameters } from '../pathTypes/GetWithPathParamsPathParameters'

export const getWithPathParamsPathSerializer = createPathSerializer<GetWithPathParamsPathParameters>(
  '/path-params/{stringInPath}/{numberInPath}/{booleanInPath}/{enumInPath}/{objectInPath}/{arrayInPath}',
  {
    stringInPath: path.simple.primitive({}),
    numberInPath: path.simple.primitive({}),
    booleanInPath: path.simple.primitive({}),
    enumInPath: path.simple.primitive({}),
    objectInPath: path.simple.object({}),
    arrayInPath: path.simple.array({}),
  },
)
