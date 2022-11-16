import { Success, success } from '@oats-ts/try'
import { AbstractRefResolver } from './AbstractRefResolver'

export class ReadRefResolver extends AbstractRefResolver {
  public traverseReference(uri: string, fromUri: string): Success<string> {
    const fullUri = this.context.uri.resolve(uri!, fromUri)
    const documentUri = this.context.uri.document(fullUri)
    if (!this.context.cache.documents.has(documentUri)) {
      this.context.externalDocumentUris.add(documentUri)
    }
    return success(fullUri)
  }
}
