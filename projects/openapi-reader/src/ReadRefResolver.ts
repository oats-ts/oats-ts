import { Success, success } from '@oats-ts/try'
import { AbstractRefResolver } from './AbstractRefResolver'

export class ReadRefResolver extends AbstractRefResolver {
  public resolveReferenceUri(data: string, uri: string): Success<string> {
    const fullUri = this.context.uri.resolve(data!, uri)
    const documentUri = this.context.uri.document(fullUri)
    if (!this.context.cache.documents.has(documentUri)) {
      this.context.externalDocumentUris.add(documentUri)
    }
    return success(fullUri)
  }
}
