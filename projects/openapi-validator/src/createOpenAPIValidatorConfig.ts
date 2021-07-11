import { isNil } from 'lodash'
import { OpenAPIValidatorConfig } from './typings'
import { openApiObject } from './validators/openApiObject'
import { operationObject } from './validators/operationObject'
import { pathItemObject } from './validators/pathItemObject'
import { pathsObject } from './validators/pathsObject'
import { componentsObject } from './validators/componentsObject'
import { requestBodyObject } from './validators/requestBodyObject'
import { contentObject } from './validators/contentObject'
import { responseObject } from './validators/responseObject'
import { responsesObject } from './validators/responsesObject'

export function createOpenAPIValidatorConfig(input: Partial<OpenAPIValidatorConfig>): OpenAPIValidatorConfig {
  const {
    headerObject: _headerObject,
    openApiObject: _openApiObject,
    operationObject: _operationObject,
    parameterObject: _parameterObject,
    pathItemObject: _pathItemObject,
    pathsObject: _pathsObject,
    requestBodyObject: _requestBodyObject,
    responseObject: _responseObject,
    schemaObject: _schemaObject,
    componentsObject: _componentsObject,
    responsesObject: _responsesObject,
    contentObject: _contentObject,
  } = input

  return {
    headerObject: isNil(_headerObject) ? null : _headerObject,
    openApiObject: isNil(_openApiObject) ? openApiObject : _openApiObject,
    operationObject: isNil(_operationObject) ? operationObject : _operationObject,
    parameterObject: isNil(_parameterObject) ? null : _parameterObject,
    pathItemObject: isNil(_pathItemObject) ? pathItemObject : _pathItemObject,
    pathsObject: isNil(_pathsObject) ? pathsObject : _pathsObject,
    requestBodyObject: isNil(_requestBodyObject) ? requestBodyObject : _requestBodyObject,
    responseObject: isNil(_responseObject) ? responseObject : _responseObject,
    schemaObject: isNil(_schemaObject) ? null : _schemaObject,
    componentsObject: isNil(_componentsObject) ? componentsObject : _componentsObject,
    responsesObject: isNil(_responsesObject) ? responsesObject : _responsesObject,
    contentObject: isNil(_contentObject) ? contentObject : _contentObject,
  }
}
