import { Tool } from 'langchain/tools'
import { AIPluginTool } from 'langchain/tools'
import { getPackage } from '../openpm/packages'
import { jsonStripNewlines } from './utils'

export interface OpenToolParams {
  name: string
  description: string
  apiSpec: string
}

export class OpenpmTool extends Tool implements OpenToolParams {
  private _name: string

  private _description: string

  apiSpec: string

  get name() {
    return this._name
  }

  get description() {
    return this._description
  }

  constructor(params: OpenToolParams) {
    super()
    this._name = params.name
    this._description = params.description
    this.apiSpec = params.apiSpec
  }

  /** @ignore */
  async _call(_input: string) {
    return this.apiSpec
  }

  static async fromPackageId(packageId: string) {
    const pkg = await getPackage(packageId)

    return new AIPluginTool({
      name: pkg.machine_name,
      description: `Call this tool to get the OpenAPI spec (and usage guide) for interacting with the ${pkg.name} API. You should only call this ONCE! What is the ${pkg.name} API useful for? ${pkg.description}`,
      apiSpec: `Usage Guide: ${pkg.machine_description}

OpenAPI Spec: ${jsonStripNewlines(pkg.openapi)}`,
    })
  }
}
