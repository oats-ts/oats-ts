import { createPathSerializer, path } from '@oats-ts/openapi-parameter-serialization'
import { SimplePathParametersPathParameters } from '../pathTypes/SimplePathParametersPathParameters'

export const simplePathParametersPathSerializer = createPathSerializer<SimplePathParametersPathParameters>(
  '/simple-path-params/{s}/{n}/{b}/{e}/{a}/{o}/{oe}',
  {
    s: path.simple.primitive({}),
    n: path.simple.primitive({}),
    b: path.simple.primitive({}),
    e: path.simple.primitive({}),
    a: path.simple.array({}),
    o: path.simple.object({}),
    oe: path.simple.object({ explode: true }),
  },
)
