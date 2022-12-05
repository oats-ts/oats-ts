import { getPathTemplate } from '../getPathTemplate'

const data: [string, string][] = [
  // Empty
  ['', ''],

  // Just text
  ['/', '/'],
  ['/test/foo/bar', '/test/foo/bar'],
  ['/test/}}', '/test/}}'],

  // Just parameters
  ['{a}', ':a'],
  ['{a}{b}{c}', ':a:b:c'],

  // Mixed params and text
  ['foo/{a}/{bar}', 'foo/:a/:bar'],
  ['/foo/{a}{foo}{c}/bar/', '/foo/:a:foo:c/bar/'],

  // Query parameters
  ['/foo/{a}?foo=bar', '/foo/:a'],
  ['/foo/{a}?foo={bar}', '/foo/:a'],
  ['/foo/{a}?foo={bar}&bar=foo', '/foo/:a'],
  ['/foo/abc?foo={bar}', '/foo/abc'],
  ['/foo/abc/?foo={bar}', '/foo/abc/'],
]

const error: string[] = ['/{', '/{foo}{', '/{}{', '/{}bar{']

describe('getPathTemplate', () => {
  it.each(data)('should turn "%s" to %j', (path: string, template: string) => {
    expect(getPathTemplate(path)).toEqual(template)
  })

  it.each(error)('should throw when processing "%s"', (path: string) => {
    expect(() => getPathTemplate(path)).toThrowError()
  })
})
