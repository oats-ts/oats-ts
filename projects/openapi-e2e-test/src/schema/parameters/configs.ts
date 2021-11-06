import { ParameterGeneratorConfig } from './typings'

export const configs: ParameterGeneratorConfig[] = [
  {
    location: 'path',
    style: 'simple',
    explodeValues: [true, false],
    requiredValues: [true],
    schemaTypes: ['primitive', 'array', 'object'],
  },
  {
    location: 'path',
    style: 'label',
    explodeValues: [true, false],
    requiredValues: [true],
    schemaTypes: ['primitive', 'array', 'object'],
  },
  {
    location: 'path',
    style: 'matrix',
    explodeValues: [true, false],
    requiredValues: [true],
    schemaTypes: ['primitive', 'array', 'object'],
  },
  {
    location: 'query',
    style: 'form',
    explodeValues: [true, false],
    requiredValues: [true, false],
    schemaTypes: ['primitive', 'array', 'object'],
  },
  {
    location: 'query',
    style: 'spaceDelimited',
    explodeValues: [true],
    requiredValues: [true, false],
    schemaTypes: ['array'],
  },
  {
    location: 'query',
    style: 'pipeDelimited',
    explodeValues: [true],
    requiredValues: [true, false],
    schemaTypes: ['array'],
  },
  {
    location: 'query',
    style: 'deepObject',
    explodeValues: [true],
    requiredValues: [true, false],
    schemaTypes: ['object'],
  },
  {
    location: 'header',
    style: 'simple',
    explodeValues: [true, false],
    requiredValues: [true, false],
    schemaTypes: ['primitive', 'array', 'object'],
  },
]
