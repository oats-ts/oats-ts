import {
  stringParser,
  stringValueData,
  numberValueData,
  numberParser,
  booleanValueData,
  booleanParser,
  literalValueData,
  literalParser,
  enumValueData,
  enumParser,
  optStringValueData,
  optNumberValueData,
  optBooleanValueData,
  optLiteralValueData,
  optEnumValueData,
  optionalStringParser,
  optionalNumberParser,
  optionalBooleanParser,
  optionalLiteralParser,
  optionalEnumParser,
} from './value.testdata'
import { createValueParserTest } from './value.testutils'

createValueParserTest('string', stringValueData, stringParser)
createValueParserTest('number', numberValueData, numberParser)
createValueParserTest('boolean', booleanValueData, booleanParser)
createValueParserTest('literal', literalValueData, literalParser)
createValueParserTest('enum', enumValueData, enumParser)

createValueParserTest('string (optional)', optStringValueData, optionalStringParser)
createValueParserTest('number (optional)', optNumberValueData, optionalNumberParser)
createValueParserTest('boolean (optional)', optBooleanValueData, optionalBooleanParser)
createValueParserTest('literal (optional)', optLiteralValueData, optionalLiteralParser)
createValueParserTest('enum (optional)', optEnumValueData, optionalEnumParser)
