import { createPathSerializer, path } from '@oats-ts/openapi-parameter-serialization'
import { LabelPathParametersPathParameters } from '../pathTypes/LabelPathParametersPathParameters'

export const labelPathParametersPathSerializer = createPathSerializer<LabelPathParametersPathParameters>(
  '/label-path-params/{s}/{se}/{n}/{ne}/{b}/{be}/{e}/{ee}/{a}/{ae}/{o}/{oe}',
  {
    s: path.label.primitive({}),
    se: path.label.primitive({ explode: true }),
    n: path.label.primitive({}),
    ne: path.label.primitive({ explode: true }),
    b: path.label.primitive({}),
    be: path.label.primitive({ explode: true }),
    e: path.label.primitive({}),
    ee: path.label.primitive({ explode: true }),
    a: path.label.array({}),
    ae: path.label.array({ explode: true }),
    o: path.label.object({}),
    oe: path.label.object({ explode: true }),
  },
)
