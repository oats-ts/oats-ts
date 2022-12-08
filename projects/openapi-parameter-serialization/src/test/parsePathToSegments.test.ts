import { parsePathToSegments } from '../parsePathToSegments'
import { PathSegment } from '../types'

const data: [string, PathSegment[]][] = [
  // Empty
  ['', []],

  // Just text
  ['/', [{ type: 'text', value: '/', location: 'path' }]],
  ['/test/foo/bar', [{ type: 'text', value: '/test/foo/bar', location: 'path' }]],
  ['/test/}}', [{ type: 'text', value: '/test/}}', location: 'path' }]],

  // Just parameters
  ['{a}', [{ type: 'parameter', name: 'a', location: 'path' }]],
  [
    '{a}{b}{c}',
    [
      { type: 'parameter', name: 'a', location: 'path' },
      { type: 'parameter', name: 'b', location: 'path' },
      { type: 'parameter', name: 'c', location: 'path' },
    ],
  ],

  // Mixed params and text
  [
    'foo/{a}/{bar}',
    [
      { type: 'text', value: 'foo/', location: 'path' },
      { type: 'parameter', name: 'a', location: 'path' },
      { type: 'text', value: '/', location: 'path' },
      { type: 'parameter', name: 'bar', location: 'path' },
    ],
  ],
  [
    '/foo/{a}{foo}{c}/bar/',
    [
      { type: 'text', value: '/foo/', location: 'path' },
      { type: 'parameter', name: 'a', location: 'path' },
      { type: 'parameter', name: 'foo', location: 'path' },
      { type: 'parameter', name: 'c', location: 'path' },
      { type: 'text', value: '/bar/', location: 'path' },
    ],
  ],

  // Query parameters
  [
    '/foo?foo',
    [
      { type: 'text', value: '/foo', location: 'path' },
      { type: 'text', value: '?foo', location: 'query' },
    ],
  ],
  [
    '/foo?{x}',
    [
      { type: 'text', value: '/foo', location: 'path' },
      { type: 'text', value: '?', location: 'query' },
      { type: 'parameter', name: 'x', location: 'query' },
    ],
  ],
  [
    '/foo/{a}?foo=bar',
    [
      { type: 'text', value: '/foo/', location: 'path' },
      { type: 'parameter', name: 'a', location: 'path' },
      { type: 'text', value: '?foo=bar', location: 'query' },
    ],
  ],
  [
    '/foo/{a}?foo={bar}',
    [
      { type: 'text', value: '/foo/', location: 'path' },
      { type: 'parameter', name: 'a', location: 'path' },
      { type: 'text', value: '?foo=', location: 'query' },
      { type: 'parameter', name: 'bar', location: 'query' },
    ],
  ],
  [
    '/foo/{a}?foo={bar}&bar=foo',
    [
      { type: 'text', value: '/foo/', location: 'path' },
      { type: 'parameter', name: 'a', location: 'path' },
      { type: 'text', value: '?foo=', location: 'query' },
      { type: 'parameter', name: 'bar', location: 'query' },
      { type: 'text', value: '&bar=foo', location: 'query' },
    ],
  ],
  [
    '{a}{b}{c}?{e}{f}{g}',
    [
      { type: 'parameter', name: 'a', location: 'path' },
      { type: 'parameter', name: 'b', location: 'path' },
      { type: 'parameter', name: 'c', location: 'path' },
      { type: 'text', value: '?', location: 'query' },
      { type: 'parameter', name: 'e', location: 'query' },
      { type: 'parameter', name: 'f', location: 'query' },
      { type: 'parameter', name: 'g', location: 'query' },
    ],
  ],
]

const error: string[] = ['/{', '/{foo}{', '/{}{', '/{}bar{']

describe('parsePathToSegments', () => {
  it.each(data)('should parse "%s" to %j', (path: string, expected: PathSegment[]) => {
    expect(parsePathToSegments(path)).toEqual(expected)
  })

  it.each(error)('should throw when parsing "%s"', (path: string) => {
    expect(() => parsePathToSegments(path)).toThrowError()
  })
})
