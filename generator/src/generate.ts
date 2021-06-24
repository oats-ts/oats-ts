import { isFailure } from './isFailure'
import { GeneratorInput, Try } from './typings'

export async function generate<R, G, W>(input: GeneratorInput<R, G, W>): Promise<Try<W>> {
  const { reader, generator, writer } = input

  const r = await reader()
  if (isFailure(r)) {
    console.log(r)
    return r
  }

  const g = await generator(r)
  if (isFailure(g)) {
    console.log(g)
    return g
  }

  const w = await writer(g)
  if (isFailure(w)) {
    console.log(w)
    return w
  }

  return w
}
