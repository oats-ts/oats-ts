import { createImportPath } from './createImportPath'

describe('createImportPath', () => {
  it('should do something', () => {
    const path1 = 'D:/Code/asyncapi-ws-to-ts/src/resolution.test.ts'
    const path2 = 'D:/Code/asyncapi-ws-to-ts/src/a/b/resolution.test.ts'
    console.log(createImportPath(path1, path1))
  })
})
