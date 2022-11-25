// function UriTemplate(template) {
//   /*
// http://tools.ietf.org/html/rfc6570#section-2.2
// expression    =  "{" [ operator ] variable-list "}"
// operator      =  op-level2 / op-level3 / op-reserve
// op-level2     =  "+" / "#"
// op-level3     =  "." / "/" / ";" / "?" / "&"
// op-reserve    =  "=" / "," / "!" / "@" / "|"
// */
//   let reTemplate = /\{([\+#\.\/;\?&=\,!@\|]?)([A-Za-z0-9_\,\.\:\*]+?)\}/g
//   let reVariable = /^([\$_a-z][\$_a-z0-9]*)((?:\:[1-9][0-9]?[0-9]?[0-9]?)?)(\*?)$/i
//   let match
//   let pieces = []
//   let glues = []
//   let offset = 0
//   let pieceCount = 0

//   while (!!(match = reTemplate.exec(template))) {
//     glues.push(template.substring(offset, match.index))
//     /*
//   The operator characters equals ("="), comma (","), exclamation ("!"),
//   at sign ("@"), and pipe ("|") are reserved for future extensions.
//   */
//     if (match[1] && ~'=,!@|'.indexOf(match[1])) {
//       throw new Error("operator '" + match[1] + "' is reserved for future extensions")
//     }

//     offset = match.index
//     pieces.push({
//       operator: match[1],
//       variables: match[2].split(',').map(variableMapper),
//     })
//     offset += match[0].length
//     pieceCount++
//   }

//   function variableMapper(variable) {
//     let match = reVariable.exec(variable)
//     return {
//       name: match[1],
//       maxLength: match[2] && parseInt(match[2].substring(1), 10),
//       composite: !!match[3],
//     }
//   }

//   glues.push(template.substring(offset))

//   this.parse = function (str) {
//     let data = {}
//     let offset = 0
//     let offsets = []

//     if (
//       !glues.every(function (glue, glueIndex) {
//         let index
//         if (glueIndex > 0 && glue === '') index = str.length
//         else index = str.indexOf(glue, offset)

//         offset = index
//         offsets.push(offset)
//         offset += glue.length

//         return ~index
//       })
//     )
//       return false

//     if (
//       !pieces.every(function (piece, pieceIndex) {
//         let options = operatorOptions[piece.operator]
//         let value, values
//         let offsetBegin = offsets[pieceIndex] + glues[pieceIndex].length
//         let offsetEnd = offsets[pieceIndex + 1]

//         value = str.substring(offsetBegin, offsetEnd)
//         if (value.length === 0) return true
//         if (value.substring(0, options.prefix.length) !== options.prefix) return false
//         value = value.substring(options.prefix.length)
//         values = value.split(options.seperator)

//         if (
//           !piece.variables.every(function (variable, variableIndex) {
//             let value = values[variableIndex]
//             let name

//             if (value === undefined) return true

//             name = variable.name

//             if (options.assignment) {
//               if (value.substring(0, name.length) !== name) return false
//               value = value.substring(name.length)
//               if (value.length === 0 && options.assignEmpty) return false
//               if (value.length > 0) {
//                 if (value[0] !== '=') return false
//                 value = value.substring(1)
//               }
//             }
//             value = decodeURIComponent(value)
//             data[name] = value

//             return true
//           })
//         )
//           return false

//         return true
//       })
//     )
//       return false

//     return data
//   } //parse

//   this.stringify = function (data) {
//     let str = ''
//     data = data || {}

//     str += glues[0]
//     if (
//       !pieces.every(function (piece, pieceIndex) {
//         let options = operatorOptions[piece.operator]
//         let parts

//         parts = piece.variables.map(function (variable) {
//           let value = data[variable.name]

//           if (!Array.isArray(value)) value = [value]

//           value = value.filter(isDefined)

//           if (isUndefined(value)) return null

//           if (variable.composite) {
//             value = value.map(function (value) {
//               if (typeof value === 'object') {
//                 value = Object.keys(value)
//                   .map(function (key) {
//                     let keyValue = value[key]
//                     if (variable.maxLength) keyValue = keyValue.substring(0, variable.maxLength)

//                     keyValue = options.encode(keyValue)

//                     if (keyValue) keyValue = key + '=' + keyValue
//                     else {
//                       keyValue = key
//                       if (options.assignEmpty) keyValue += '='
//                     }

//                     return keyValue
//                   })
//                   .join(options.seperator)
//               } else {
//                 if (variable.maxLength) value = value.substring(0, variable.maxLength)

//                 value = options.encode(value)

//                 if (options.assignment) {
//                   if (value) value = variable.name + '=' + value
//                   else {
//                     value = variable.name
//                     if (options.assignEmpty) value += '='
//                   }
//                 }
//               }

//               return value
//             })

//             value = value.join(options.seperator)
//           } else {
//             value = value.map(function (value) {
//               if (typeof value === 'object') {
//                 return Object.keys(value)
//                   .map(function (key) {
//                     let keyValue = value[key]
//                     if (variable.maxLength) keyValue = keyValue.substring(0, variable.maxLength)
//                     return key + ',' + options.encode(keyValue)
//                   })
//                   .join(',')
//               } else {
//                 if (variable.maxLength) value = value.substring(0, variable.maxLength)

//                 return options.encode(value)
//               }
//             })
//             value = value.join(',')

//             if (options.assignment) {
//               if (value) value = variable.name + '=' + value
//               else {
//                 value = variable.name
//                 if (options.assignEmpty) value += '='
//               }
//             }
//           }

//           return value
//         })

//         parts = parts.filter(isDefined)
//         if (isDefined(parts)) {
//           str += options.prefix
//           str += parts.join(options.seperator)
//         }

//         str += glues[pieceIndex + 1]
//         return true
//       })
//     )
//       return false

//     return str
//   } //stringify
// }
