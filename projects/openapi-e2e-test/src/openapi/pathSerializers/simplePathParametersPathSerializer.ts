import { createPathSerializer, path } from '@oats-ts/openapi-parameter-serialization'
import { SimplePathParametersPathParameters } from '../pathTypes/SimplePathParametersPathParameters'

export const simplePathParametersPathSerializer = createPathSerializer<SimplePathParametersPathParameters>(
  '/simple-path-params/{s}/{se}/{n}/{ne}/{b}/{be}/{e}/{ee}/{a}/{ae}/{o}/{oe}',
  {
    s: path.simple.primitive({}),
    se: path.simple.primitive({ explode: true }),
    n: path.simple.primitive({}),
    ne: path.simple.primitive({ explode: true }),
    b: path.simple.primitive({}),
    be: path.simple.primitive({ explode: true }),
    e: path.simple.primitive({}),
    ee: path.simple.primitive({ explode: true }),
    a: path.simple.array({}),
    ae: path.simple.array({ explode: true }),
    o: path.simple.object({}),
    oe: path.simple.object({ explode: true }),
  },
)
