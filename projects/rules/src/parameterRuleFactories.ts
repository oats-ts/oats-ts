import { CookieParameterRule, HeaderParameterRule, PathParameterRule, QueryParameterRule } from './parameterRules'

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
  <P extends ParameterRule>(
    location: P['location'],
    style: P['style'],
    explode: P['explode'],
    required: P['required'],
  ) =>
  (value: PrimitiveParameterRule['value']): P =>
    ({
      explode,
      location,
      required,
      style,
      structure: { type: 'primitive', value },
    } as P)

const object =
  <P extends ParameterRule>(
    location: P['location'],
    style: P['style'],
    explode: P['explode'],
    required: P['required'],
  ) =>
  (properties: ObjectParameterRule['properties']): P =>
    ({
      explode,
      location,
      required,
      style,
      structure: { type: 'object', properties },
    } as P)

const array =
  <P extends ParameterRule>(
    location: P['location'],
    style: P['style'],
    explode: P['explode'],
    required: P['required'],
  ) =>
  (items: ArrayParameterRule['items']): P =>
    ({
      explode,
      location,
      required,
      style,
      structure: { type: 'array', items },
    } as P)

const mimeType =
  <P extends ParameterRule>(location: P['location'], required: P['required']) =>
  (mimeType: string): P =>
    ({
      location,
      required,
      explode: false,
      style: 'none' as unknown as P['style'],
      structure: { type: 'mime-type', mimeType },
    } as P)

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
    schema: mimeType<QueryParameterRule>('query', true),
  },
  schema: mimeType<QueryParameterRule>('query', false),
  form: {
    exploded: {
      required: {
        primitive: primitive<QueryParameterRule>('query', 'form', true, true),
        array: array<QueryParameterRule>('query', 'form', true, true),
        object: object<QueryParameterRule>('query', 'form', true, true),
      },
      primitive: primitive<QueryParameterRule>('query', 'form', true, false),
      array: array<QueryParameterRule>('query', 'form', true, false),
      object: object<QueryParameterRule>('query', 'form', true, false),
    },
    required: {
      primitive: primitive<QueryParameterRule>('query', 'form', false, true),
      array: array<QueryParameterRule>('query', 'form', false, true),
      object: object<QueryParameterRule>('query', 'form', false, true),
    },
    primitive: primitive<QueryParameterRule>('query', 'form', false, false),
    array: array<QueryParameterRule>('query', 'form', false, false),
    object: object<QueryParameterRule>('query', 'form', false, false),
  },
  spaceDelimited: {
    exploded: {
      required: {
        array: array<QueryParameterRule>('query', 'spaceDelimited', true, true),
      },
      array: array<QueryParameterRule>('query', 'spaceDelimited', true, false),
    },
    required: {
      array: array<QueryParameterRule>('query', 'spaceDelimited', false, true),
    },
    array: array<QueryParameterRule>('query', 'spaceDelimited', false, false),
  },
  pipeDelimited: {
    exploded: {
      required: {
        array: array<QueryParameterRule>('query', 'pipeDelimited', true, true),
      },
      array: array<QueryParameterRule>('query', 'pipeDelimited', true, false),
    },
    required: {
      array: array<QueryParameterRule>('query', 'pipeDelimited', false, true),
    },
    array: array<QueryParameterRule>('query', 'pipeDelimited', false, false),
  },
  deepObject: {
    exploded: {
      required: {
        object: object<QueryParameterRule>('query', 'deepObject', true, true),
      },
      object: object<QueryParameterRule>('query', 'deepObject', true, false),
    },
  },
}

export const path = {
  required: {
    schema: mimeType<PathParameterRule>('path', true),
  },
  simple: {
    exploded: {
      required: {
        primitive: primitive<PathParameterRule>('path', 'simple', true, true),
        array: array<PathParameterRule>('path', 'simple', true, true),
        object: object<PathParameterRule>('path', 'simple', true, true),
      },
    },
    required: {
      primitive: primitive<PathParameterRule>('path', 'simple', false, true),
      array: array<PathParameterRule>('path', 'simple', false, true),
      object: object<PathParameterRule>('path', 'simple', false, true),
    },
  },
  label: {
    exploded: {
      required: {
        primitive: primitive<PathParameterRule>('path', 'label', true, true),
        array: array<PathParameterRule>('path', 'label', true, true),
        object: object<PathParameterRule>('path', 'label', true, true),
      },
    },
    required: {
      primitive: primitive<PathParameterRule>('path', 'label', false, true),
      array: array<PathParameterRule>('path', 'label', false, true),
      object: object<PathParameterRule>('path', 'label', false, true),
    },
  },
  matrix: {
    exploded: {
      required: {
        primitive: primitive<PathParameterRule>('path', 'matrix', true, true),
        array: array<PathParameterRule>('path', 'matrix', true, true),
        object: object<PathParameterRule>('path', 'matrix', true, true),
      },
    },
    required: {
      primitive: primitive<PathParameterRule>('path', 'matrix', false, true),
      array: array<PathParameterRule>('path', 'matrix', false, true),
      object: object<PathParameterRule>('path', 'matrix', false, true),
    },
  },
}

export const header = {
  required: {
    schema: mimeType<HeaderParameterRule>('header', true),
  },
  schema: mimeType<HeaderParameterRule>('header', false),
  simple: {
    exploded: {
      required: {
        primitive: primitive<HeaderParameterRule>('header', 'simple', true, true),
        array: array<HeaderParameterRule>('header', 'simple', true, true),
        object: object<HeaderParameterRule>('header', 'simple', true, true),
      },
      primitive: primitive<HeaderParameterRule>('header', 'simple', true, false),
      array: array<HeaderParameterRule>('header', 'simple', true, false),
      object: object<HeaderParameterRule>('header', 'simple', true, false),
    },
    required: {
      primitive: primitive<HeaderParameterRule>('header', 'simple', false, true),
      array: array<HeaderParameterRule>('header', 'simple', false, true),
      object: object<HeaderParameterRule>('header', 'simple', false, true),
    },
    primitive: primitive<HeaderParameterRule>('header', 'simple', false, false),
    array: array<HeaderParameterRule>('header', 'simple', false, false),
    object: object<HeaderParameterRule>('header', 'simple', false, false),
  },
}

export const cookie = {
  required: {
    schema: mimeType<CookieParameterRule>('cookie', true),
  },
  schema: mimeType<CookieParameterRule>('cookie', false),
  form: {
    exploded: {
      required: {
        primitive: primitive<CookieParameterRule>('cookie', 'form', true, true),
      },
      primitive: primitive<CookieParameterRule>('cookie', 'form', true, false),
    },
    required: {
      primitive: primitive<CookieParameterRule>('cookie', 'form', false, true),
    },
    primitive: primitive<CookieParameterRule>('cookie', 'form', false, false),
  },
}
