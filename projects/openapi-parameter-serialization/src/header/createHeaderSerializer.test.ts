import { fluent } from '@oats-ts/try'
import { header } from '.'
import { HeaderSerializers } from '../types'
import { createHeaderSerializer } from './createHeaderSerializer'

type HeaderParams = {
  'X-Str': string
  'x-num': number
  'x-Bool': boolean
  'x-Arr': string[]
  'x-obj': Record<string, string>
}

const serializers: HeaderSerializers<HeaderParams> = {
  'X-Str': header.simple.primitive<string>({}),
  'x-num': header.simple.primitive<number>({}),
  'x-Bool': header.simple.primitive<boolean>({}),
  'x-Arr': header.simple.array<string[]>({}),
  'x-obj': header.simple.object<Record<string, string>>({ explode: true }),
}

describe('createPathSerializer', () => {
  it('should successfuly serialize headers', () => {
    const serializer = createHeaderSerializer<HeaderParams>(serializers)
    expect(
      fluent(
        serializer({
          'X-Str': 'test',
          'x-num': 42,
          'x-Bool': true,
          'x-Arr': ['a', 'b'],
          'x-obj': { foo: 'bar' },
        }),
      ).getData(),
    ).toEqual({
      'x-str': 'test',
      'x-num': '42',
      'x-bool': 'true',
      'x-arr': 'a,b',
      'x-obj': 'foo=bar',
    })
  })
})
