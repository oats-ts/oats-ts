import {
  arrayDescriptor,
  booleanDescriptor,
  enumDescriptor,
  literalDescriptor,
  numberDescriptor,
  objectDescriptor,
  optionalDescriptor,
  primitiveDescriptor,
  stringDescriptor,
} from './factories'

export const parameter = {
  value: {
    optional: optionalDescriptor,
    string: stringDescriptor,
    number: numberDescriptor,
    boolean: booleanDescriptor,
    literal: literalDescriptor,
    enum: enumDescriptor,
  },
  query: {
    form: {
      exploded: {
        required: {
          primitive: primitiveDescriptor('query', 'form', true, true),
          array: arrayDescriptor('query', 'form', true, true),
          object: objectDescriptor('query', 'form', true, true),
        },
        primitive: primitiveDescriptor('query', 'form', true, false),
        array: arrayDescriptor('query', 'form', true, false),
        object: objectDescriptor('query', 'form', true, false),
      },
      required: {
        primitive: primitiveDescriptor('query', 'form', false, true),
        array: arrayDescriptor('query', 'form', false, true),
        object: objectDescriptor('query', 'form', false, true),
      },
      primitive: primitiveDescriptor('query', 'form', false, false),
      array: arrayDescriptor('query', 'form', false, false),
      object: objectDescriptor('query', 'form', false, false),
    },
    spaceDelimited: {
      exploded: {
        required: {
          array: arrayDescriptor('query', 'spaceDelimited', true, true),
        },
        array: arrayDescriptor('query', 'spaceDelimited', true, false),
      },
      required: {
        array: arrayDescriptor('query', 'spaceDelimited', false, true),
      },
      array: arrayDescriptor('query', 'spaceDelimited', false, false),
    },
    pipeDelimited: {
      exploded: {
        required: {
          array: arrayDescriptor('query', 'pipeDelimited', true, true),
        },
        array: arrayDescriptor('query', 'pipeDelimited', true, false),
      },
      required: {
        array: arrayDescriptor('query', 'pipeDelimited', false, true),
      },
      array: arrayDescriptor('query', 'pipeDelimited', false, false),
    },
    deepObject: {
      exploded: {
        required: {
          object: objectDescriptor('query', 'deepObject', true, true),
        },
        object: objectDescriptor('query', 'deepObject', true, false),
      },
    },
  },
  path: {
    simple: {
      exploded: {
        required: {
          primitive: primitiveDescriptor('path', 'simple', true, true),
          array: arrayDescriptor('path', 'simple', true, true),
          object: objectDescriptor('path', 'simple', true, true),
        },
      },
      required: {
        primitive: primitiveDescriptor('path', 'simple', false, true),
        array: arrayDescriptor('path', 'simple', false, true),
        object: objectDescriptor('path', 'simple', false, true),
      },
    },
    label: {
      exploded: {
        required: {
          primitive: primitiveDescriptor('path', 'label', true, true),
          array: arrayDescriptor('path', 'label', true, true),
          object: objectDescriptor('path', 'label', true, true),
        },
      },
      required: {
        primitive: primitiveDescriptor('path', 'label', false, true),
        array: arrayDescriptor('path', 'label', false, true),
        object: objectDescriptor('path', 'label', false, true),
      },
    },
    matrix: {
      exploded: {
        required: {
          primitive: primitiveDescriptor('path', 'matrix', true, true),
          array: arrayDescriptor('path', 'matrix', true, true),
          object: objectDescriptor('path', 'matrix', true, true),
        },
      },
      required: {
        primitive: primitiveDescriptor('path', 'matrix', false, true),
        array: arrayDescriptor('path', 'matrix', false, true),
        object: objectDescriptor('path', 'matrix', false, true),
      },
    },
  },
  header: {
    simple: {
      exploded: {
        required: {
          primitive: primitiveDescriptor('header', 'simple', true, true),
          array: arrayDescriptor('header', 'simple', true, true),
          object: objectDescriptor('header', 'simple', true, true),
        },
        primitive: primitiveDescriptor('header', 'simple', true, false),
        array: arrayDescriptor('header', 'simple', true, false),
        object: objectDescriptor('header', 'simple', true, false),
      },
      required: {
        primitive: primitiveDescriptor('header', 'simple', false, true),
        array: arrayDescriptor('header', 'simple', false, true),
        object: objectDescriptor('header', 'simple', false, true),
      },
      primitive: primitiveDescriptor('header', 'simple', false, false),
      array: arrayDescriptor('header', 'simple', false, false),
      object: objectDescriptor('header', 'simple', false, false),
    },
  },
  cookie: {
    form: {
      exploded: {
        required: {
          primitive: primitiveDescriptor('cookie', 'form', true, true),
        },
        primitive: primitiveDescriptor('cookie', 'form', true, false),
      },
      required: {
        primitive: primitiveDescriptor('cookie', 'form', false, true),
      },
      primitive: primitiveDescriptor('cookie', 'form', false, false),
    },
  },
}
