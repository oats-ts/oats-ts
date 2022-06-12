import { OpenAPIGenerator } from '../types'
import { PathSerializersGenerator } from './PathSerializersGenerator'

export function pathSerializers(): OpenAPIGenerator {
  return new PathSerializersGenerator()
}
