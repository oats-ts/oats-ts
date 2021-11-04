import { createPathSerializer, path } from '@oats-ts/openapi-parameter-serialization'
import { MatrixPathParametersPathParameters } from '../pathTypes/MatrixPathParametersPathParameters'

export const matrixPathParametersPathSerializer = createPathSerializer<MatrixPathParametersPathParameters>(
  '/matrix-path-params/{s}/{se}/{n}/{ne}/{b}/{be}/{e}/{ee}/{a}/{ae}/{o}/{oe}',
  {
    s: path.matrix.primitive({}),
    se: path.matrix.primitive({ explode: true }),
    n: path.matrix.primitive({}),
    ne: path.matrix.primitive({ explode: true }),
    b: path.matrix.primitive({}),
    be: path.matrix.primitive({ explode: true }),
    e: path.matrix.primitive({}),
    ee: path.matrix.primitive({ explode: true }),
    a: path.matrix.array({}),
    ae: path.matrix.array({ explode: true }),
    o: path.matrix.object({}),
    oe: path.matrix.object({ explode: true }),
  },
)
