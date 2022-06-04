import { factory, NodeFlags, SyntaxKind } from 'typescript'

describe('mergeSourceFiles', () => {
  it('should bb', () => {
    const file = factory.createSourceFile([], factory.createToken(SyntaxKind.EndOfFileToken), NodeFlags.None)
    file.fileName = '/foo/cat.ts'

    console.log(file.fileName)
  })
})
