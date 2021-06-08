import { isFailure } from './isFailure'
import { ContentReader, Generator, Writer } from './typings'

export class Harness<R, G, W> {
  private _reader: ContentReader<R>
  private _generator: Generator<R, G>
  private _writer: Writer<G, W>

  public read(reader: ContentReader<R>): this {
    this._reader = reader
    return this
  }
  public generate(generator: Generator<R, G>): this {
    this._generator = generator
    return this
  }
  public write(writer: Writer<G, W>): this {
    this._writer = writer
    return this
  }
  public async run(): Promise<W> {
    const r = await this._reader()
    if (isFailure(r)) {
      console.log(r) // TODO logging
      return undefined
    }
    const g = await this._generator(r)
    if (isFailure(g)) {
      console.log(g) // TODO logging
      return undefined
    }
    const w = await this._writer(g)
    if (isFailure(w)) {
      console.log(w) // TODO logging
      return undefined
    }
    return w
  }
}

export function harness<R, G, W>(): Harness<R, G, W> {
  return new Harness()
}
