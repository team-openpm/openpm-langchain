import { Tool } from 'langchain/tools'
import { getPackage } from '../openpm/packages'
import { jsonStripNewlines } from './utils'
import { Package } from '../openpm/types'

export class OpenpmTool extends Tool {
  package: Package

  constructor(pkg: Package) {
    super()
    this.package = pkg
  }

  /** @ignore */
  async _call(_input: string) {
    return [
      `Usage Guide: ${this.package.machine_description}`,
      `OpenAPI Spec: ${jsonStripNewlines(this.package.openapi)}`,
    ].join('\n')
  }

  get name(): string {
    return this.package.id
  }

  get description(): string {
    return `Call this tool to get the OpenAPI spec (and usage guide) for interacting with the ${this.package.name} API. You should only call this ONCE! What is the ${this.package.name} API useful for? ${this.package.description}`
  }

  static async fromPackageId(packageId: string, { proxy = false } = {}) {
    const pkg = await getPackage(packageId, { proxy })
    return new OpenpmTool(pkg)
  }
}
