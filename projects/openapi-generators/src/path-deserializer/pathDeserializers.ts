import { OpenAPIGenerator } from '../types'
import { PathDeserializersGenerator } from './PathDeserializersGenerator'

export function pathDeserializers(): OpenAPIGenerator {
  return new PathDeserializersGenerator()
}
