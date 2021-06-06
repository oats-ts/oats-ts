import { path } from '..'
import { PathSerializers } from '../types'
import { createPathSerializer } from './createPathSerializer'

type PathParams = {
  a: string
  b: number
  foo: boolean
}

const serializers: PathSerializers<PathParams> = {
  a: path.simple.primitive<string>({}),
  b: path.simple.primitive<number>({}),
  foo: path.simple.primitive<boolean>({}),
}

describe('createPathSerializer', () => {
  it('should successfuly serialize path', () => {
    const serializer = createPathSerializer<PathParams>('/a/{a}/b/{b}/foo/{foo}', serializers)
    expect(serializer({ a: 'test', b: 42, foo: true })).toBe('/a/test/b/42/foo/true')
  })

  it('should throw on extra params', () => {
    expect(() => createPathSerializer<PathParams>('/a/{a}/b/{b}/foo/', serializers)).toThrowError()
  })

  it('should throw on missing params', () => {
    expect(() => createPathSerializer<PathParams>('/a/{a}/b/{b}/foo/{foo}/{x}', serializers)).toThrowError()
  })
})
