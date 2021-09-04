import { byNameAndTarget } from './byNameAndTarget'
import { byName } from './byName'
import { byTarget } from './byTarget'
import { singleFile } from './singleFile'
import { defaultPathProvider } from './defaultPathProvider'

export const pathProviders = {
  default: defaultPathProvider,
  byName,
  byTarget,
  byNameAndTarget,
  singleFile,
}
