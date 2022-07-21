# @oats-ts/openapi-parameter-serialization

This package implements all possible options for parameter serialization/deserialization described by the [OpenAPI spec](https://swagger.io/docs/specification/serialization)

The package's main goal is to support [oats](https://oats-ts.github.io/docs), but it can be used on it's own, if you have an OpenAPI related project, that needs parameter serialization/deserialization.

## Model

**Since this is not 100% clear from the OpenAPI spec**, you can serialize and deserialize the following structures (**if the serialization method is defined**) as a parmeter:

- primitives (`string`, `number`, `boolean`)
- arrays with primitive values (`string[]`, `number[]`, `boolean[]`)
- objects with primitive-valued fields (`{ s: string, n: number, b: boolean }`)

Anything else is not defined behaviour, and this project does not handle it. In case you need to serialize something more complex, you should consider using the request body instead. Details in the [OpenAPI repo](https://github.com/OAI/OpenAPI-Specification/issues/2594).

With that in mind, let's consider you have the following structure, that you would like to express as query parameters:

```ts
export type AnimalType = 'canine' | 'feline' | 'marsupial'

export type AnimalDimension = {
  weight: number
  height: number
  length: number
}

// We want to put this in the query
export type AnimalQueryParams = {
  type?: AnimalType
  name: string
  isPredator?: boolean
  legs?: number
  aliases?: string[]
  dimensions: AnimalDimension
}
```

## Dsl

After you have your model, you need a model description on how you want each of the fields to be serialized/deserialized. Notice that you can mix and match different parameter serialization methods (here I use `form`, `pipeDelimited` and `deepObject`), and you can also change the `explode` and `required` options for each of these, just like in an OpenAPI document:

```ts
import { dsl, QueryDslRoot } from '@oats-ts/openapi-parameter-serialization'

const animalQueryParamsDsl: QueryDslRoot<AnimalQueryParams> = {
  type: dsl.query.form.primitive(dsl.value.string(dsl.value.enum(['canine', 'feline', 'marsupial']))),
  name: dsl.query.form.primitive(dsl.value.string(), { required: true }),
  isPredator: dsl.query.form.primitive(dsl.value.boolean()),
  legs: dsl.query.form.primitive(dsl.value.number()),
  aliases: dsl.query.pipeDelimited.array(dsl.value.string(), { explode: false }),
  dimensions: dsl.query.deepObject.object(
    {
      weight: dsl.value.number(),
      height: dsl.value.number(),
      length: dsl.value.number(),
    },
    { required: true },
  ),
}
```

**Notice**, that there is no strict typing requirements between this dsl and the actual type itself.

## Serializing

This DSL then can be used to serialize your model objects. The result of each serializer and deserializer will be a [Try](https://www.npmjs.com/package/@oats-ts/try), which is a wrapper object either containing the expected `data`, or a list of `issues` detailing what went wrong:

```ts
import { createQuerySerializer } from '@oats-ts/openapi-parameter-serialization'
import { isSuccess } from '@oats-ts/try'

const animalQueryParamsSerializer = createQuerySerializer(animalQueryParamsDsl)

const queryString = animalQueryParamsSerializer({
  type: 'canine',
  name: 'fox',
  aliases: ['vixen', 'kit', 'reynard'],
  isPredator: true,
  legs: 4,
  dimensions: {
    height: 60,
    weight: 8,
    length: 120,
  },
})

if (isSuccess(queryString)) {
  console.log(queryString.data)
} else {
  console.log(queryString.issues)
}
```

Which will print:

```ts
'?type=canine&isPredator=true&legs=4&name=fox&aliases=vixen|kit|reynard&dimensions[height]=60&dimensions[weight]=8&dimensions[length]=120'
```

## Deserializing

In case you need to deserialize the same structure, you can create a deserializer using the same DSL, which does the opposite:

```ts
import { createQueryDeserializer } from '@oats-ts/openapi-parameter-serialization'
import { isSuccess } from '@oats-ts/try'

const animalQueryParamsDeserializer = createQuerySerializer(animalQueryParamsDsl)

const queryString =
  '?type=canine&isPredator=true&legs=4&name=fox&aliases=vixen|kit|reynard&dimensions[height]=60&dimensions[weight]=8&dimensions[length]=120'

const fox = animalQueryParamsDeserializer(queryString)

if (isSuccess(fox)) {
  console.log(fox.data)
} else {
  console.log(fox.issues)
}
```

Which will print:

```ts
{
  type: 'canine',
  isPredator: true,
  legs: 4,
  name: 'fox',
  aliases: ['vixen', 'kit', 'reynard'],
  dimensions: { weight: 8, height: 60, length: 120 },
}
```
