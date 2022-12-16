import {
  CookieParameterRule,
  HeaderParameterRule,
  MimeTypeParameterRule,
  PathParameterRule,
  QueryParameterRule,
  ValueParameterRule,
} from './parameterRules'

import {
  ArrayParameterRule,
  BooleanParameterRule,
  NumberParameterRule,
  ObjectParameterRule,
  OptionalParameterRule,
  PrimitiveParameterRule,
  ParameterRule,
  StringParameterRule,
  UnionParameterRule,
} from './parameterRules'

const primitive =
  <P extends ParameterRule<PrimitiveParameterRule>>(location: P['location']) =>
  (style: P['style'], explode: P['explode'], required: P['required']) =>
  (value: ValueParameterRule): P =>
    ({
      explode,
      location,
      required,
      style,
      structure: { type: 'primitive', value },
    } as P)

const object =
  <P extends ParameterRule<ObjectParameterRule>>(location: P['location']) =>
  (style: P['style'], explode: P['explode'], required: P['required']) =>
  (properties: Record<string, ValueParameterRule>): P =>
    ({
      explode,
      location,
      required,
      style,
      structure: { type: 'object', properties },
    } as P)

const array =
  <P extends ParameterRule<ArrayParameterRule>>(location: P['location']) =>
  (style: P['style'], explode: P['explode'], required: P['required']) =>
  (items: ValueParameterRule): P =>
    ({
      explode,
      location,
      required,
      style,
      structure: { type: 'array', items },
    } as P)

const mimeType =
  <P extends ParameterRule<MimeTypeParameterRule>>(location: P['location']) =>
  (required: P['required']) =>
  (mimeType: string): P =>
    ({
      location,
      required,
      explode: false,
      style: 'none' as unknown as P['style'],
      structure: { type: 'mime-type', mimeType },
    } as P)

const pathPrimitive = primitive<PathParameterRule<PrimitiveParameterRule>>('path')
const queryPrimitive = primitive<QueryParameterRule<PrimitiveParameterRule>>('query')
const cookiePrimitive = primitive<CookieParameterRule<PrimitiveParameterRule>>('cookie')
const headerPrimitive = primitive<HeaderParameterRule<PrimitiveParameterRule>>('header')

const pathArray = array<PathParameterRule<ArrayParameterRule>>('path')
const queryArray = array<QueryParameterRule<ArrayParameterRule>>('query')
const headerArray = array<HeaderParameterRule<ArrayParameterRule>>('header')

const pathObject = object<PathParameterRule<ObjectParameterRule>>('path')
const queryObject = object<QueryParameterRule<ObjectParameterRule>>('query')
const headerObject = object<HeaderParameterRule<ObjectParameterRule>>('header')

const pathMimeType = mimeType<PathParameterRule<MimeTypeParameterRule>>('path')
const queryMimeType = mimeType<QueryParameterRule<MimeTypeParameterRule>>('query')
const cookieMimeType = mimeType<CookieParameterRule<MimeTypeParameterRule>>('cookie')
const headerMimeType = mimeType<HeaderParameterRule<MimeTypeParameterRule>>('header')

function string(): StringParameterRule {
  return { type: 'string' }
}

function number(): NumberParameterRule {
  return { type: 'number' }
}

function boolean(): BooleanParameterRule {
  return { type: 'boolean' }
}

function optional(value: OptionalParameterRule['value']): OptionalParameterRule {
  return {
    type: 'optional',
    value,
  }
}

function union(alternatives: UnionParameterRule['alternatives']): UnionParameterRule {
  return {
    type: 'union',
    alternatives,
  }
}

export const value = { string, number, boolean, optional, union }

export const query = {
  required: {
    schema: queryMimeType(true),
  },
  schema: queryMimeType(false),
  form: {
    exploded: {
      required: {
        primitive: queryPrimitive('form', true, true),
        array: queryArray('form', true, true),
        object: queryObject('form', true, true),
      },
      primitive: queryPrimitive('form', true, false),
      array: queryArray('form', true, false),
      object: queryObject('form', true, false),
    },
    required: {
      primitive: queryPrimitive('form', false, true),
      array: queryArray('form', false, true),
      object: queryObject('form', false, true),
    },
    primitive: queryPrimitive('form', false, false),
    array: queryArray('form', false, false),
    object: queryObject('form', false, false),
  },
  spaceDelimited: {
    exploded: {
      required: {
        array: queryArray('spaceDelimited', true, true),
      },
      array: queryArray('spaceDelimited', true, false),
    },
    required: {
      array: queryArray('spaceDelimited', false, true),
    },
    array: queryArray('spaceDelimited', false, false),
  },
  pipeDelimited: {
    exploded: {
      required: {
        array: queryArray('pipeDelimited', true, true),
      },
      array: queryArray('pipeDelimited', true, false),
    },
    required: {
      array: queryArray('pipeDelimited', false, true),
    },
    array: queryArray('pipeDelimited', false, false),
  },
  deepObject: {
    exploded: {
      required: {
        object: queryObject('deepObject', true, true),
      },
      object: queryObject('deepObject', true, false),
    },
  },
}

export const path = {
  required: {
    schema: pathMimeType(true),
  },
  simple: {
    exploded: {
      required: {
        primitive: pathPrimitive('simple', true, true),
        array: pathArray('simple', true, true),
        object: pathObject('simple', true, true),
      },
    },
    required: {
      primitive: pathPrimitive('simple', false, true),
      array: pathArray('simple', false, true),
      object: pathObject('simple', false, true),
    },
  },
  label: {
    exploded: {
      required: {
        primitive: pathPrimitive('label', true, true),
        array: pathArray('label', true, true),
        object: pathObject('label', true, true),
      },
    },
    required: {
      primitive: pathPrimitive('label', false, true),
      array: pathArray('label', false, true),
      object: pathObject('label', false, true),
    },
  },
  matrix: {
    exploded: {
      required: {
        primitive: pathPrimitive('matrix', true, true),
        array: pathArray('matrix', true, true),
        object: pathObject('matrix', true, true),
      },
    },
    required: {
      primitive: pathPrimitive('matrix', false, true),
      array: pathArray('matrix', false, true),
      object: pathObject('matrix', false, true),
    },
  },
}

export const header = {
  required: {
    schema: headerMimeType(true),
  },
  schema: headerMimeType(false),
  simple: {
    exploded: {
      required: {
        primitive: headerPrimitive('simple', true, true),
        array: headerArray('simple', true, true),
        object: headerObject('simple', true, true),
      },
      primitive: headerPrimitive('simple', true, false),
      array: headerArray('simple', true, false),
      object: headerObject('simple', true, false),
    },
    required: {
      primitive: headerPrimitive('simple', false, true),
      array: headerArray('simple', false, true),
      object: headerObject('simple', false, true),
    },
    primitive: headerPrimitive('simple', false, false),
    array: headerArray('simple', false, false),
    object: headerObject('simple', false, false),
  },
}

export const cookie = {
  required: {
    schema: cookieMimeType(true),
  },
  schema: cookieMimeType(false),
  form: {
    exploded: {
      required: {
        primitive: cookiePrimitive('form', true, true),
      },
      primitive: cookiePrimitive('form', true, false),
    },
    required: {
      primitive: cookiePrimitive('form', false, true),
    },
    primitive: cookiePrimitive('form', false, false),
  },
}
