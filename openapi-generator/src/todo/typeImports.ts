// import { factory as f, ImportDeclaration } from 'typescript'
// import { OpenAPIGeneratorContext } from '../../generatorTypes'
// import { createImportPath } from '../createImportPath'
// import { collectReferencedTypes } from './collectReferencedTypes'

// export function getTypeImports(type: Type, context: OpenAPIGeneratorContext): ImportDeclaration[] {
//   const ownPath = context.config.path(type, context.config.name)
//   const referencedTypes = collectReferencedTypes(type)
//   return referencedTypes
//     .map((refType): [Type, string] => [refType, context.config.path(refType, context.config.name)])
//     .filter(([, path]) => path !== ownPath)
//     .map(([refType, path]): ImportDeclaration => {
//       const importPath = createImportPath(ownPath, path)
//       const importedName = context.config.name(refType)
//       return f.createImportDeclaration(
//         undefined,
//         undefined,
//         f.createImportClause(
//           false,
//           undefined,
//           f.createNamedImports([f.createImportSpecifier(undefined, f.createIdentifier(importedName))]),
//         ),
//         f.createStringLiteral(importPath),
//       )
//     })
// }
