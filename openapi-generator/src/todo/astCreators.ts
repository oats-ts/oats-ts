// import { Ref, ArrayType, DictionaryType, EnumType, ModelType, Type, ObjectType, UnionType } from '../../types/types'

// import {
//   factory as f,
//   SyntaxKind,
//   TypeNode,
//   PropertySignature,
//   EnumMember,
//   Statement,
//   EnumDeclaration,
//   JSDoc,
// } from 'typescript'
// import { isNil } from '../../../utils'

// export function generateDocsAst(type: Type): JSDoc {
//   if (isNil(type.description)) {
//     return undefined
//   }
//   return f.createJSDocComment(
//     type.description,
//     type.deprecated ? [f.createJSDocUnknownTag(f.createIdentifier('deprecated'))] : [],
//   )
// }

// export function generateTypeAst(name: string, input: Type): Statement {
//   if (ModelType.EnumType === input.__type) {
//     return generateEnumTypeAst(name, input)
//   }
//   return f.createTypeAliasDeclaration(
//     [],
//     [f.createModifier(SyntaxKind.ExportKeyword)],
//     name,
//     [],
//     generateTypeRighthandSideAst(input),
//   )
// }

// export function generateTypeRighthandSideAst(input: Type): TypeNode {
//   switch (input.__type) {
//     case ModelType.StringType:
//       return f.createKeywordTypeNode(SyntaxKind.StringKeyword)
//     case ModelType.NumberType:
//       return f.createKeywordTypeNode(SyntaxKind.NumberKeyword)
//     case ModelType.BooleanType:
//       return f.createKeywordTypeNode(SyntaxKind.BooleanKeyword)
//     case ModelType.DictionaryType:
//       return generateDictionaryTypeAst(input)
//     case ModelType.ObjectType:
//       return generateObjectTypeAst(input)
//     case ModelType.ArrayType:
//       return generateArrayTypeAst(input)
//     case ModelType.EnumType:
//       return generateLiteralUnionTypeAst(input)
//     case ModelType.UnionType:
//       return generateUnionTypeAst(input)
//   }
//   return f.createKeywordTypeNode(SyntaxKind.AnyKeyword)
// }

// export function generateTypeReferenceAst(ref: Ref<Type>): TypeNode {
//   const type = ref.get()
//   if (isNil(type)) {
//     // Shouldnt happen
//     return f.createKeywordTypeNode(SyntaxKind.AnyKeyword)
//   }
//   if (isNil(type.name)) {
//     return generateTypeRighthandSideAst(type)
//   }
//   return f.createTypeReferenceNode(type.name)
// }

// export function generateObjectTypeAst(input: ObjectType): TypeNode {
//   const discriminatorFields = input.discriminators.map(
//     (field): PropertySignature => {
//       return f.createPropertySignature(
//         [],
//         field.name,
//         undefined,
//         f.createLiteralTypeNode(f.createStringLiteral(field.value)),
//       )
//     },
//   )
//   const fields = input.fields.map(
//     (field): PropertySignature =>
//       f.createPropertySignature(
//         [],
//         field.name,
//         field.isRequired ? undefined : f.createToken(SyntaxKind.QuestionToken),
//         generateTypeReferenceAst(field.type),
//       ),
//   )
//   return f.createTypeLiteralNode(discriminatorFields.concat(fields))
// }

// export function generateDictionaryTypeAst(input: DictionaryType): TypeNode {
//   return f.createTypeLiteralNode([
//     f.createIndexSignature(
//       [],
//       [],
//       [
//         f.createParameterDeclaration(
//           [],
//           [],
//           undefined,
//           'key',
//           undefined,
//           f.createKeywordTypeNode(SyntaxKind.StringKeyword),
//         ),
//       ],
//       generateTypeReferenceAst(input.valueType),
//     ),
//   ])
// }

// export function generateArrayTypeAst(input: ArrayType): TypeNode {
//   return f.createArrayTypeNode(generateTypeReferenceAst(input.itemType))
// }

// function generateEnumValueAst(value: string | number | boolean) {
//   if (typeof value === 'string') {
//     return f.createStringLiteral(value)
//   } else if (typeof value === 'number') {
//     return f.createNumericLiteral(value)
//   } else if (typeof value === 'boolean') {
//     return value ? f.createTrue() : f.createFalse()
//   }
// }

// export function generateEnumTypeAst(name: string, input: EnumType): EnumDeclaration {
//   return f.createEnumDeclaration(
//     [],
//     [f.createModifier(SyntaxKind.ExportKeyword)],
//     name,
//     input.values.map(
//       (value): EnumMember => {
//         return f.createEnumMember(value.name, generateEnumValueAst(value.value))
//       },
//     ),
//   )
// }

// export function generateLiteralUnionTypeAst(input: EnumType): TypeNode {
//   return f.createUnionTypeNode(input.values.map((value) => f.createLiteralTypeNode(generateEnumValueAst(value.value))))
// }

// export function generateUnionTypeAst(input: UnionType): TypeNode {
//   return f.createUnionTypeNode(Array.from(input.types.keys()).map((ref): TypeNode => generateTypeReferenceAst(ref)))
// }
