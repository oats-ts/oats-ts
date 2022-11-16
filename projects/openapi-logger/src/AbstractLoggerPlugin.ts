import { red, green, blue, yellow } from 'chalk'
import {
  OatsEventEmitter,
  OatsPlugin,
  OatsEventMap,
  ReadFileCompleted,
  ReadFileProgress,
  ReadFileStarted,
  ReadStepCompleted,
  ReadStepStarted,
  ValidatorStepStarted,
  ValidateFileStarted,
  ValidateFileCompleted,
  ValidatorStepCompleted,
  GeneratorStepStarted,
  GeneratorStarted,
  GeneratorProgress,
  GeneratorCompleted,
  GeneratorStepCompleted,
  WriterStepStarted,
  WriteFileStarted,
  WriteFileCompleted,
  WriterStepCompleted,
  RuntimeDependency,
} from '@oats-ts/oats-ts'
import { EventHandler } from './typings'
import { Issue, Severity } from '@oats-ts/validators'

export class AbstractLoggerPlugin implements OatsPlugin {
  private _handlers: [keyof OatsEventMap<any, any, any, any>, EventHandler<any>][] = []

  public name(): string {
    return '@oats-ts/openapi-logger'
  }

  protected handlers() {
    return this._handlers
  }

  protected tab(): string {
    return '  '
  }

  protected warningIcon(): string {
    return yellow('!')
  }

  protected errorIcon(): string {
    return red('✕')
  }

  protected infoIcon(): string {
    return blue('i')
  }

  protected successIcon(): string {
    return green('✔')
  }

  protected severityIcon(severity: Severity): string {
    switch (severity) {
      case 'warning':
        return this.warningIcon()
      case 'info':
        return this.infoIcon()
      case 'error':
        return this.errorIcon()
      default:
        return '?'
    }
  }

  protected issueToString(issue: Issue, indent: number = 1): string {
    return `${this.tab().repeat(indent)}${this.severityIcon(issue.severity)} ${issue.message} at "${issue.path}"`
  }

  protected statusText(step: string, status: 'completed' | 'failed', name: string): string {
    return `${status === 'completed' ? this.successIcon() : this.errorIcon()} ${step} step ${status} using "${blue(
      name,
    )}"`
  }

  protected printRuntimeDependencies(deps: RuntimeDependency[], indentation: number): void {
    if (deps.length === 0) {
    }
    const sortedDeps = Array.from(deps)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name, version }) => `${name}@${version}`)

    if (deps.length <= 3) {
      console.log(`${this.infoIcon()} npm i ${blue(sortedDeps.join(' '))}`)
    } else {
      console.log(`${this.tab().repeat(indentation)}${this.infoIcon()} some outputs have runtime dependencies:`)
      console.log(`${this.tab().repeat(indentation + 1)}npm i \\`)
      const depsText = sortedDeps.map((dep) => `${this.tab().repeat(indentation + 2)}${blue(dep)}`).join(' \\\n')
      console.log(depsText)
    }
  }

  protected bindHandler<Target extends keyof OatsEventMap<any, any, any, any>>(
    emitter: OatsEventEmitter<any, any, any, any>,
    target: Target,
    fn: EventHandler<OatsEventMap<any, any, any, any>[Target]>,
  ): void {
    const handler = fn.bind(this)
    this.handlers().push([target, handler])
    emitter.addListener(target, handler)
  }

  protected onReadStepStarted(e: ReadStepStarted): void {}
  protected onReadFileStarted(e: ReadFileStarted): void {}
  protected onReadFileProgress(e: ReadFileProgress): void {}
  protected onReadFileCompleted(e: ReadFileCompleted<any>): void {}
  protected onReadStepCompleted(e: ReadStepCompleted<any>): void {}

  protected onValidatorStepStarted(e: ValidatorStepStarted): void {}
  protected onValidateFileStarted(e: ValidateFileStarted<any>): void {}
  protected onValidateFileCompleted(e: ValidateFileCompleted<any>): void {}
  protected onValidatorStepCompleted(e: ValidatorStepCompleted): void {}

  protected onGeneratorStepStarted(e: GeneratorStepStarted): void {}
  protected onGeneratorStarted(e: GeneratorStarted): void {}
  protected onGeneratorProgress(e: GeneratorProgress<any>): void {}
  protected onGeneratorCompleted(e: GeneratorCompleted<any>): void {}
  protected onGeneratorStepCompleted(e: GeneratorStepCompleted<any>): void {}

  protected onWriterStepStarted(e: WriterStepStarted): void {}
  protected onWriteFileStarted(e: WriteFileStarted<any>): void {}
  protected onWriteFileCompleted(e: WriteFileCompleted<any>): void {}
  protected onWriterStepCompleted(e: WriterStepCompleted<any>): void {}

  public addEventListeners(emitter: OatsEventEmitter<any, any, any, any>): void {
    this.bindHandler(emitter, 'read-step-started', this.onReadStepStarted)
    this.bindHandler(emitter, 'read-file-started', this.onReadFileStarted)
    this.bindHandler(emitter, 'read-file-progress', this.onReadFileProgress)
    this.bindHandler(emitter, 'read-file-completed', this.onReadFileCompleted)
    this.bindHandler(emitter, 'read-step-completed', this.onReadStepCompleted)

    this.bindHandler(emitter, 'validator-step-started', this.onValidatorStepStarted)
    this.bindHandler(emitter, 'validate-file-started', this.onValidateFileStarted)
    this.bindHandler(emitter, 'validate-file-completed', this.onValidateFileCompleted)
    this.bindHandler(emitter, 'validator-step-completed', this.onValidatorStepCompleted)

    this.bindHandler(emitter, 'generator-step-started', this.onGeneratorStepStarted)
    this.bindHandler(emitter, 'generator-started', this.onGeneratorStarted)
    this.bindHandler(emitter, 'generator-progress', this.onGeneratorProgress)
    this.bindHandler(emitter, 'generator-completed', this.onGeneratorCompleted)
    this.bindHandler(emitter, 'generator-step-completed', this.onGeneratorStepCompleted)

    this.bindHandler(emitter, 'writer-step-started', this.onWriterStepStarted)
    this.bindHandler(emitter, 'write-file-started', this.onWriteFileStarted)
    this.bindHandler(emitter, 'write-file-completed', this.onWriteFileCompleted)
    this.bindHandler(emitter, 'writer-step-completed', this.onWriterStepCompleted)
  }

  public removeEventListeners(emitter: OatsEventEmitter<any, any, any, any>): void {
    this.handlers().forEach(([target, handler]) => emitter.removeListener(target, handler))
  }
}
