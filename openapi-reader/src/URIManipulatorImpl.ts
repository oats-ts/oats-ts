import { URIManipulator } from './_typings'
import URI, { encode, decode } from 'urijs'
import p from 'path'
import { pathToFileURL } from 'url'
import { isUri } from 'valid-url'
import isEmpty from 'lodash/isEmpty'
import dropHead from 'lodash/drop'

const AcceptedSchemes = ['http', 'https', 'file']

export class URIManipulatorImpl implements URIManipulator {
  protected setFragments(uri: string, fragments: string[]): string {
    const fragment = fragments.length > 0 ? `/${fragments.map(encode).join('/')}` : null
    return new URI(uri).fragment(fragment).valueOf()
  }

  append(uri: string, ...pieces: string[]): string {
    return this.setFragments(uri, this.fragments(uri).concat(pieces))
  }

  resolve(ref: string, parent: string): string {
    const parentUri = new URI(parent)
    const uri = new URI(ref)
    if (!isEmpty(uri.hostname()) && !isEmpty(uri.protocol())) {
      return uri.valueOf()
    }
    return uri.absoluteTo(parentUri).valueOf()
  }

  sanitize(path: string): string {
    if (isUri(path)) {
      const uri = new URI(path)
      if (AcceptedSchemes.indexOf(uri.scheme()) < 0) {
        throw new TypeError(
          `Unexpected URI scheme: "${uri.scheme()}" in "${path}", expected one of ${AcceptedSchemes.join(', ')}.`,
        )
      }
      return path
    }
    return pathToFileURL(p.resolve(path)).toString()
  }

  document(path: string): string {
    return new URI(path).fragment('').hash('').valueOf()
  }

  fragments(uri: string): string[] {
    const fragment = new URI(uri).fragment()
    if (isEmpty(fragment)) {
      return []
    }
    if (fragment[0] !== '/') {
      throw new TypeError(`Malformed URI: ${uri}.`)
    }
    return dropHead(fragment.split('/')).map(decode)
  }
}
