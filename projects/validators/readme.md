# @oats-ts/validators

Standalone lightweight runtime validator utility functions used both by `@oats-ts/openapi-reader` for sanitizing input, and `@oats-ts/openapi-validators` for generating schema validation at runtime.

- Created by function composition.
- **NEVER** throws, if it does it's a bug.
- Returns a list of `Issue`s that can be formatted, and presented to the user.
- For a throwing wrapper see `validate` function.

A validator function has the following type:

```ts
export type Validator<T> = (input: T, config?: Partial<ValidatorConfig>) => Issue[];
```

And an example validator looks like this:

```ts
import { 
  object, 
  shape, 
  string, 
  number, 
  boolean, 
  enumeration 
} from '@oats-ts/validators' 

const personValidator = object(
  shape({
    name: string(),
    email: optional(string()),
    occupation: enumeration(['programmer', 'musician', 'other']),
    married: boolean(),
    friends: array(items(/* ... */))
    address: object(
      shape({
        country: string(),
        zip: number(),
        city: string(),
        street: string(),
        // etc...
      })
    ),
  }),
);
```

When validating simply call this function:

```ts
const issues = personValidator({
  name: "Test",
  email: 1, // Issue about wrong type,
  // Issues about all the missing fields
})
```

If you want to throw an error in case of an invalid input:

```ts
import { validate } from '@oats-ts/validators' 

// This will throw an error descibing the issues in a singe message.
validate({ name: "Test" }, personValidator)

```
