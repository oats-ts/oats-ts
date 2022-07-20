# @oats-ts/validators

Standalone lightweight runtime validator utility functions used extensively in oats libraries.

- Created by function composition.
- Validators **NEVER** throw, if they do, please [report](https://github.com/oats-ts/oats-ts/issues) it.
- Validators returns a list of `Issue`s that can be formatted, and presented to the user.

And an example validator:

```ts
import { object, shape, string, number, array, items, boolean, union, lazy } from '@oats-ts/validators'

const personValidator = configure(
  object(
    shape({
      name: string(),
      email: optional(string()),
      occupation: union({
        programmer: literal('programmer'),
        musician: literal('musician'),
        other: literal('other'),
      }),
      married: boolean(),
      friends: array(items(lazy(() => personValidator))),
      address: object(
        shape({
          country: string(),
          zip: number(),
          city: string(),
          street: string(),
        }),
      ),
    }),
  ),
)
```

When validating simply call this function. It will return a list of `Issue`s, reporting everything that's wrong with the input:

```ts
const issues = personValidator({
  name: 'Test',
  email: 1,
})

const isOk = issues.length === 0
```
