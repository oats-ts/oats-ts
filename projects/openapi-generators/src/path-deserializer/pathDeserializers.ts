import { PathDeserializersGenerator } from './PathDeserializersGenerator'

export function pathDeserializers(): PathDeserializersGenerator {
  return new PathDeserializersGenerator()
}
