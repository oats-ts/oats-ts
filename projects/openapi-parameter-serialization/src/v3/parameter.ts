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

export const parameter = {
  value: {
    optional: optionalDsl,
    string: stringDsl,
    number: numberDsl,
    boolean: booleanDsl,
    literal: literalDsl,
    enum: enumDsl,
  },
  query: {
    form: {
      exploded: {
        required: {
          primitive: primitiveDsl('query', 'form', true, true),
          array: arrayDsl('query', 'form', true, true),
          object: objectDsl('query', 'form', true, true),
        },
        primitive: primitiveDsl('query', 'form', true, false),
        array: arrayDsl('query', 'form', true, false),
        object: objectDsl('query', 'form', true, false),
      },
      required: {
        primitive: primitiveDsl('query', 'form', false, true),
        array: arrayDsl('query', 'form', false, true),
        object: objectDsl('query', 'form', false, true),
      },
      primitive: primitiveDsl('query', 'form', false, false),
      array: arrayDsl('query', 'form', false, false),
      object: objectDsl('query', 'form', false, false),
    },
    spaceDelimited: {
      exploded: {
        required: {
          array: arrayDsl('query', 'spaceDelimited', true, true),
        },
        array: arrayDsl('query', 'spaceDelimited', true, false),
      },
      required: {
        array: arrayDsl('query', 'spaceDelimited', false, true),
      },
      array: arrayDsl('query', 'spaceDelimited', false, false),
    },
    pipeDelimited: {
      exploded: {
        required: {
          array: arrayDsl('query', 'pipeDelimited', true, true),
        },
        array: arrayDsl('query', 'pipeDelimited', true, false),
      },
      required: {
        array: arrayDsl('query', 'pipeDelimited', false, true),
      },
      array: arrayDsl('query', 'pipeDelimited', false, false),
    },
    deepObject: {
      exploded: {
        required: {
          object: objectDsl('query', 'deepObject', true, true),
        },
        object: objectDsl('query', 'deepObject', true, false),
      },
    },
  },
  path: {
    simple: {
      exploded: {
        required: {
          primitive: primitiveDsl('path', 'simple', true, true),
          array: arrayDsl('path', 'simple', true, true),
          object: objectDsl('path', 'simple', true, true),
        },
      },
      required: {
        primitive: primitiveDsl('path', 'simple', false, true),
        array: arrayDsl('path', 'simple', false, true),
        object: objectDsl('path', 'simple', false, true),
      },
    },
    label: {
      exploded: {
        required: {
          primitive: primitiveDsl('path', 'label', true, true),
          array: arrayDsl('path', 'label', true, true),
          object: objectDsl('path', 'label', true, true),
        },
      },
      required: {
        primitive: primitiveDsl('path', 'label', false, true),
        array: arrayDsl('path', 'label', false, true),
        object: objectDsl('path', 'label', false, true),
      },
    },
    matrix: {
      exploded: {
        required: {
          primitive: primitiveDsl('path', 'matrix', true, true),
          array: arrayDsl('path', 'matrix', true, true),
          object: objectDsl('path', 'matrix', true, true),
        },
      },
      required: {
        primitive: primitiveDsl('path', 'matrix', false, true),
        array: arrayDsl('path', 'matrix', false, true),
        object: objectDsl('path', 'matrix', false, true),
      },
    },
  },
  header: {
    simple: {
      exploded: {
        required: {
          primitive: primitiveDsl('header', 'simple', true, true),
          array: arrayDsl('header', 'simple', true, true),
          object: objectDsl('header', 'simple', true, true),
        },
        primitive: primitiveDsl('header', 'simple', true, false),
        array: arrayDsl('header', 'simple', true, false),
        object: objectDsl('header', 'simple', true, false),
      },
      required: {
        primitive: primitiveDsl('header', 'simple', false, true),
        array: arrayDsl('header', 'simple', false, true),
        object: objectDsl('header', 'simple', false, true),
      },
      primitive: primitiveDsl('header', 'simple', false, false),
      array: arrayDsl('header', 'simple', false, false),
      object: objectDsl('header', 'simple', false, false),
    },
  },
  cookie: {
    form: {
      exploded: {
        required: {
          primitive: primitiveDsl('cookie', 'form', true, true),
        },
        primitive: primitiveDsl('cookie', 'form', true, false),
      },
      required: {
        primitive: primitiveDsl('cookie', 'form', false, true),
      },
      primitive: primitiveDsl('cookie', 'form', false, false),
    },
  },
}
