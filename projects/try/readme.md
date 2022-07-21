# @oats-ts/try

This library wraps the result of a synchronous operation, expressing either a success or a failure.

## motivation

In typescript we have no built in way of conveying what errors might a function fail with. This is ok, if you are using errors as a "panic" mechanism, and you don't want to recover. But for libraries, where errors should be well defined, and users should be able to recover from them this is not suitable. The reason this library was created is to support typed errors for [oats](https://oats-ts.github.io/docs)

## basic usage

```ts
import { success, failure, isSuccess, Try } from '@oats-ts/try'

function divide(a: number, b: number): Try<number> {
  if (b === 0) {
    return failure([
      {
        message: 'cannot be 0',
        severity: 'error',
        path: 'b',
      },
    ])
  }
  return success(a / b)
}

const result = divide(1, 2)

// isSuccess and isFailure are type guards, without type narrowing you can't access neither .data nor .issues
if (isSuccess(result)) {
  console.log('divide was successful', result.data)
} else {
  console.log('divide failed', result.issues)
}
```

## utilities

There are some common utility methods exposed that make it easier to work with `Try`s

### fromArray

Creates a `Try<T[]>` from `Try<T>[]`. Useful when have a list of tries as a result of `Array.map`, but you care about the correctness of all results.

```ts
import { fromArray } from '@oats-ts/try'

const numbers: number[] = getNumbersFromUser()

const dividedNumbers = fromArray(numbers.map((num) => divide(5, num)))

if (isSuccess(dividedNumbers)) {
  console.log('Here are the results:', dividedNumbers.data)
} else {
  console.log('Some of your inputs are wrong:', dividedNumbers.issues)
}
```

### fromRecord

Creates a `Try<Record<A, B>>` from `Record<A, Try<B>>`. Useful when you have an object, where each field is a computed value, and you care about the correctness of each.

```ts
import { fromRecord } from '@oats-ts/try'

const resultObject = {
  by5: divide(10, 5),
  by3: divide(10, 3),
  by1: divide(10, 1),
} as const

// result is of type Try<Record<'by5' | 'by3' | 'by1', number>>
const result = fromRecord(resultObject)
```

### zip

Wrapper on top of `fromArray`, but works with statically typed tuples

```ts
import { zip } from '@oats-ts/try'

const divisionResult = divide(5, 3)
const stringResult = success("")

// result is of type Try<[number, string]>
const result = zip(divisionResult, stringResult)
```

### fluent

The fluent method exposes some functional behaviour on the wrapped `Try`:

```ts
const result = fluent(divide(a, b))
  // .map runs performs the given transformation on .data if the Try is a success, otherise delegates the failure
  .map((result) => result - 1)
  // .map runs performs the given transformation on .data if the Try is a success, and carries on with the returned try
  .flatMap((result) => divide(5, result))
  // .get unwraps the Try, you have to provide a callback for both the success and the error case
  .get(
    (data) => data,
    (issues) => NaN,
  )
```
