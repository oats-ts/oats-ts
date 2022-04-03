import { Success } from '@oats-ts/try'
import { query } from '.'
import { createQuerySerializer } from './createQuerySerializer'

type Q = {
  a: string
  b: number
  c: boolean
  d: string[]
  e: Record<string, number>
}

const serializer = createQuerySerializer<Q>({
  a: query.form.primitive<string>({}),
  b: query.form.primitive<number>({}),
  c: query.form.primitive<boolean>({}),
  d: query.form.array<string[]>({}),
  e: query.form.object<Record<string, number>>({}),
})

// TODO more full scope tests
describe('createQuerySerializer', () => {
  it('should create query string with all the parts necessary', () => {
    const queryString = serializer({
      a: 'some string',
      b: 34,
      c: true,
      d: ['a', 'b', 'c'],
      e: { foo: 1, bar: 43 },
    })
    expect((queryString as Success<string>).data).toBe('?a=some%20string&b=34&c=true&d=a&d=b&d=c&foo=1&bar=43')
  })

  it('should return undefined when none of the values are present', () => {
    const queryString = serializer({
      a: null,
      b: undefined,
      c: undefined,
      d: null,
      e: undefined,
    })

    expect((queryString as Success<string>).data).toBe(undefined)
  })
})
