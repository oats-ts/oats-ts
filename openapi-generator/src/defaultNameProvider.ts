// import { ModelType, OpenAPIModelType } from '../types/types'
// import pascalCase from 'pascalcase'
// import camelCase from 'camelcase'

// export function defaultNameProvider(input: OpenAPIModelType): string {
//   switch (input.__type) {
//     case ModelType.AnyType:
//     case ModelType.NumberType:
//     case ModelType.StringType:
//     case ModelType.BooleanType:
//     case ModelType.EnumType:
//     case ModelType.ArrayType:
//     case ModelType.ObjectType:
//     case ModelType.UnionType:
//     case ModelType.IntersectionType:
//     case ModelType.DictionaryType:
//       return pascalCase(input.name)
//     case ModelType.ObjectField:
//     case ModelType.DiscriminatorField:
//       return camelCase(input.name)
//     case ModelType.OperationType:
//       return pascalCase(input.name)
//     default:
//       throw new TypeError(`Unexpected ${input.__type}.`)
//   }
// }
