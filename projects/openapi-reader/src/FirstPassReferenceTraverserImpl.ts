import { Success, success } from '@oats-ts/try'
import { AbstractReferenceTraverser } from './AbstractReferenceTraverser'

export class FirstPassReferenceTraverserImpl extends AbstractReferenceTraverser {
  public traverseReference(uri: string, fromUri: string): Success<string> {
    const fullUri = this.context.uri.resolve(uri!, fromUri)
    const documentUri = this.context.uri.document(fullUri)
    if (!this.context.cache.documents.has(documentUri)) {
      this.context.externalDocumentUris.add(documentUri)
    }
    return success(fullUri)
  }
}
