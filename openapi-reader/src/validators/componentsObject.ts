import { ComponentsObject } from 'openapi3-ts'
import { fields, object, optional } from '@oats-ts/validators'
import { recordOfObjects } from './recordOfObjects'

export const componentsObject = object(
  fields<ComponentsObject>(
    {
      schemas: optional(recordOfObjects),
      responses: optional(recordOfObjects),
      parameters: optional(recordOfObjects),
      examples: optional(recordOfObjects),
      requestBodies: optional(recordOfObjects),
      headers: optional(recordOfObjects),
      securitySchemes: optional(recordOfObjects),
      links: optional(recordOfObjects),
      callbacks: optional(recordOfObjects),
    },
    true,
  ),
)
