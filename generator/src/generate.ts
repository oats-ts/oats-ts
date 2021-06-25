import { isFailure } from './isFailure'
import { GeneratorInput, Try, Module } from './typings'

// TODO proper logging
export async function generate<R, G extends Module, W>(input: GeneratorInput<R, G, W>): Promise<Try<W>> {
  const { reader, generators, writer } = input

  const r = await reader()
  if (isFailure(r)) {
    console.log(r)
    return r
  }

  const modules: G[] = []

  for (const generator of generators) {
    const result = await generator.generate(r)
    if (isFailure(result)) {
      console.log(result)
      return result
    }
    modules.push(...result)
  }

  const w = await writer(modules)
  if (isFailure(w)) {
    console.log(w)
    return w
  }

  return w
}
