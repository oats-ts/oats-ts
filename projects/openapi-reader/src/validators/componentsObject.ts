import { ComponentsObject } from 'openapi3-ts'
import { shape, object, optional } from '@oats-ts/validators'
import { recordOfObjects } from './recordOfObjects'

export const componentsObject = object(
  shape<ComponentsObject>(
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
