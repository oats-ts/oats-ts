# @oats-ts/openapi-parameter-serialization

This package implements all possible options for parameter generation described by the OpenAPI spec: https://swagger.io/docs/specification/serialization/

It's main goal is to support the `@oats-ts/openapi-operations-generator` package, but you can use it independently for your own goals:

```ts
import { query, createQuerySerializer } from '@oats-ts/openapi-parameter-serialization'

export type MyParams = {
  stringInQuery: string
  numberInQuery: number
  booleanInQuery: boolean
  enumInQuery: 'bear' | 'racoon' | 'cat'
}

export const myParamsSerializer = createQuerySerializer<MyParams>({
  stringInQuery: query.form.primitive({ required: true }),
  numberInQuery: query.form.primitive({ required: true }),
  booleanInQuery: query.form.primitive({ required: true }),
  enumInQuery: query.form.primitive({ required: true }),
})

const queryString = myParamsSerializer({
  booleanInQuery: true,
  enumInQuery: 'cat',
  numberInQuery: 12,
  stringInQuery: 'foo',
})

console.log(queryString)
```

Which will print:

```
?stringInQuery=foo&numberInQuery=12&booleanInQuery=true&enumInQuery=cat
```

Works for the more complicated serialization methods too, explore unit tests to see more examples!
