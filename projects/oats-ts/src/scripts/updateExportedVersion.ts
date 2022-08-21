import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { format } from 'prettier'
import {
  createPrinter,
  createSourceFile,
  factory,
  isIdentifier,
  isVariableStatement,
  NodeFlags,
  ScriptTarget,
  SourceFile,
  SyntaxKind,
} from 'typescript'

const INDEX_TS_LOCATION = resolve('src', 'index.ts')
const PACKAGE_JSON_LOCATION = resolve('package.json')
const PRETTIER_CONFIG_LOCATION = resolve('../', '../', '.prettierrc')
const VERSION_NAME = 'version'

const indexTsContent = readFileSync(INDEX_TS_LOCATION, 'utf-8')
const version = JSON.parse(readFileSync(PACKAGE_JSON_LOCATION, 'utf-8')).version as string
const prettierConfig = JSON.parse(readFileSync(PRETTIER_CONFIG_LOCATION, 'utf-8'))

const inputSourceFile: SourceFile = createSourceFile('index.ts', indexTsContent, ScriptTarget.ES2020, false)

const remaningStatements = inputSourceFile.statements.filter((statement) => {
  if (!isVariableStatement(statement)) {
    return true
  }
  const { declarationList } = statement
  if (declarationList.declarations.length !== 1) {
    return true
  }
  const [declaration] = declarationList.declarations
  if (!isIdentifier(declaration.name)) {
    return true
  }
  const { name } = declaration
  return name.text !== VERSION_NAME
})

const versionStatement = factory.createVariableStatement(
  [factory.createModifier(SyntaxKind.ExportKeyword)],
  factory.createVariableDeclarationList(
    [
      factory.createVariableDeclaration(
        factory.createIdentifier(VERSION_NAME),
        undefined,
        undefined,
        factory.createStringLiteral(version),
      ),
    ],
    NodeFlags.Const,
  ),
)

const statements = [...remaningStatements, versionStatement]

const outputSourceFile = factory.createSourceFile(
  statements,
  factory.createToken(SyntaxKind.EndOfFileToken),
  NodeFlags.None,
)

const outputContent = createPrinter().printFile(outputSourceFile)
const formattedOutputContent = format(outputContent, prettierConfig)

writeFileSync(INDEX_TS_LOCATION, formattedOutputContent, 'utf-8')
