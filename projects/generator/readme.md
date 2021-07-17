# @oats-ts/generator

This package contains the generator harness for anything you might want to generate with oats. The generator expects the following configuration:

```ts
import { generate, ContentReader, ContentValidator, CodeGenerator, ContentWriter } from '@oats-ts/generator'

// Responsible for reading the your content and ensuring it's structurally correct.
const reader: ContentReader<R> = null

// Responsible for determining if your content is semantically valid. Runs after reader.
const validator: ContentValidator<R> = null

// Responsible for generating your modules. Uses the validated content.
const generator1: CodeGenerator<R, G> = null
const generator2: CodeGenerator<R, G> = null

// Responsible for writing the generated modules to disk.
const writer: ContentWriter<G> = null

// In an async context.
await generate({
  // Set to false if you don't want logging.
  log: true,
  reader: reader,
  validator: validator,
  generators: [
    generator1,
    generator2
  ],
  writer: writer
}
```
