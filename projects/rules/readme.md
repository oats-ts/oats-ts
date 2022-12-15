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
const validPerson = {
  name: 'Test',
  email: 'test',
  occupation: 'other',
  married: false,
  friends: [],
  address: {
    country: 'Test',
    zip: 1243,
    city: 'Test',
    street: 'Test',
  },
}

const invalidPerson = {
  name: false,
  email: 1,
  fr_iends: [{ hi: true }],
}

// Returns an empty array
expect(personValidator(validPerson).length).toBe(0)
// Returns an array with all the issues
expect(personValidator(invalidPerson).length).toBeGreaterThan(0)
```
