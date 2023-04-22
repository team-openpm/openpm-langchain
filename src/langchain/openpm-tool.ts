import { StructuredTool } from 'langchain/tools'
import { getPackage } from '../openpm/packages'
import { jsonStripNewlines } from './utils'
import { Package } from '../openpm/types'
import { z } from 'zod'
import { Callbacks } from 'langchain/callbacks'

export class OpenpmTool extends StructuredTool {
  package: Package

  schema = z
    .object({ input: z.string().optional() })
    .transform(obj => obj.input)

  constructor(pkg: Package) {
    super()
    this.package = pkg
  }

  call(
    arg: string | z.input<this['schema']>,
    callbacks?: Callbacks
  ): Promise<string> {
    return super.call(
      typeof arg === 'string' || !arg ? { input: arg } : arg,
      callbacks
    )
  }

  /** @ignore */
  async _call(_input: string) {
    return [
      `Usage Guide: ${this.package.machine_description ||
        this.package.description}`,
      `OpenAPI Spec: ${jsonStripNewlines(this.package.openapi)}`,
    ].join('\n')
  }

  get name(): string {
    return `openapi-fetcher-${this.package.name}`
  }

  get description(): string {
    return `Call this tool to get the OpenAPI spec (and usage guide) for interacting with the ${this.package.name} API. You should only call this ONCE! What is the ${this.package.name} API useful for? ${this.package.description}`
  }

  static async fromPackageId(packageId: string, { proxy = false } = {}) {
    const pkg = await getPackage(packageId, { proxy })
    return new OpenpmTool(pkg)
  }
}
