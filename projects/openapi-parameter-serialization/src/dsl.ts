import {
  arrayDsl,
  booleanDsl,
  enumDsl,
  literalDsl,
  numberDsl,
  objectDsl,
  optionalDsl,
  primitiveDsl,
  stringDsl,
} from './factories'

export const dsl = {
  value: {
    optional: optionalDsl,
    string: stringDsl,
    number: numberDsl,
    boolean: booleanDsl,
    literal: literalDsl,
    enum: enumDsl,
  },
  path: {
    simple: {
      primitive: primitiveDsl('path', 'simple', { explode: false, required: true }),
      array: arrayDsl('path', 'simple', { explode: false, required: true }),
      object: objectDsl('path', 'simple', { explode: false, required: true }),
    },
    label: {
      primitive: primitiveDsl('path', 'label', { explode: false, required: true }),
      array: arrayDsl('path', 'label', { explode: false, required: true }),
      object: objectDsl('path', 'label', { explode: false, required: true }),
    },
    matrix: {
      primitive: primitiveDsl('path', 'matrix', { explode: false, required: true }),
      array: arrayDsl('path', 'matrix', { explode: false, required: true }),
      object: objectDsl('path', 'matrix', { explode: false, required: true }),
    },
  },
  query: {
    form: {
      primitive: primitiveDsl('query', 'form', { explode: true, required: false }),
      array: arrayDsl('query', 'form', { explode: true, required: false }),
      object: objectDsl('query', 'form', { explode: true, required: false }),
    },
    spaceDelimited: {
      array: arrayDsl('query', 'spaceDelimited', { explode: true, required: false }),
    },
    pipeDelimited: {
      array: arrayDsl('query', 'pipeDelimited', { explode: true, required: false }),
    },
    deepObject: {
      object: objectDsl('query', 'deepObject', { explode: true, required: false }),
    },
  },
  header: {
    simple: {
      primitive: primitiveDsl('header', 'simple', { explode: false, required: false }),
      array: arrayDsl('header', 'simple', { explode: false, required: false }),
      object: objectDsl('header', 'simple', { explode: false, required: false }),
    },
  },
  cookie: {
    simple: {
      primitive: primitiveDsl('cookie', 'form', { explode: true, required: false }),
    },
  },
}
