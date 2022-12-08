import { URIManipulatorType } from './typings'
import URI, { encode, decode } from 'urijs'
import { drop, isEmpty } from 'lodash'

/** Default implementation of URIManipulator. Extensible class. */
export class URIManipulator implements URIManipulatorType {
  public setFragments(uri: string, fragments: string[]): string {
    const fragment = fragments.length > 0 ? `/${fragments.map((piece) => this.encode(piece)).join('/')}` : null
    return new URI(uri).fragment(fragment!).valueOf()
  }
  /**
   * @param uri A URI fragment.
   * @param pieces Possibly other URI fragment pieces.
   * @returns A URI fragment composed from the pieces
   */
  public append(uri: string, ...pieces: (string | number)[]): string {
    return this.setFragments(uri, this.fragments(uri).concat(pieces.map((piece) => piece.toString())))
  }

  /**
   * @param ref A partial or full URI (possibly just a fragment).
   * @param parent A full URI.
   * @returns A resolved full URI.
   */
  public resolve(ref: string, parent: string): string {
    const parentUri = new URI(parent)
    const uri = new URI(ref)
    if (!isEmpty(uri.hostname()) && !isEmpty(uri.protocol())) {
      return uri.valueOf()
    }
    return uri.absoluteTo(parentUri).valueOf()
  }

  /**
   * @param path A full URI.
   * @returns The URI without any fragments.
   */
  public document(path: string): string {
    return new URI(path).fragment('').hash('').valueOf()
  }

  /**
   * @param uri A full or partial URI.
   * @returns It's fragments split by "/"
   */
  public fragments(uri: string): string[] {
    const fragment = new URI(uri).fragment()
    if (isEmpty(fragment)) {
      return []
    }
    if (fragment[0] !== '/') {
      throw new TypeError(`Malformed URI: ${uri}.`)
    }
    return drop(fragment.split('/')).map((piece) => this.decode(piece))
  }

  public encode(piece: string): string {
    return encode(piece.replace(/~/g, '~0').replace(/\//g, '~1'))
  }

  public decode(piece: string): string {
    return decode(piece.replace(/~0/g, '~').replace(/~1/g, '/'))
  }
}
