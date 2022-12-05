import { parsePathToSegments } from '../parsePathToSegments'
import { PathSegment } from '../types'

const data: [string, PathSegment[]][] = [
  // Empty
  ['', []],

  // Just text
  ['/', [{ type: 'text', value: '/' }]],
  ['/test/foo/bar', [{ type: 'text', value: '/test/foo/bar' }]],
  ['/test/}}', [{ type: 'text', value: '/test/}}' }]],

  // Just parameters
  ['{a}', [{ type: 'parameter', name: 'a' }]],
  [
    '{a}{b}{c}',
    [
      { type: 'parameter', name: 'a' },
      { type: 'parameter', name: 'b' },
      { type: 'parameter', name: 'c' },
    ],
  ],

  // Mixed params and text
  [
    'foo/{a}/{bar}',
    [
      { type: 'text', value: 'foo/' },
      { type: 'parameter', name: 'a' },
      { type: 'text', value: '/' },
      { type: 'parameter', name: 'bar' },
    ],
  ],
  [
    '/foo/{a}{foo}{c}/bar/',
    [
      { type: 'text', value: '/foo/' },
      { type: 'parameter', name: 'a' },
      { type: 'parameter', name: 'foo' },
      { type: 'parameter', name: 'c' },
      { type: 'text', value: '/bar/' },
    ],
  ],

  // Query parameters
  [
    '/foo/{a}?foo=bar',
    [
      { type: 'text', value: '/foo/' },
      { type: 'parameter', name: 'a' },
      { type: 'query', value: '?foo=bar' },
    ],
  ],
  [
    '/foo/{a}?foo={bar}',
    [
      { type: 'text', value: '/foo/' },
      { type: 'parameter', name: 'a' },
      { type: 'query', value: '?foo={bar}' },
    ],
  ],
  [
    '/foo/{a}?foo={bar}&bar=foo',
    [
      { type: 'text', value: '/foo/' },
      { type: 'parameter', name: 'a' },
      { type: 'query', value: '?foo={bar}&bar=foo' },
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
