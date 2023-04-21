import { Tool } from 'langchain/tools'
import { getPackage } from '../openpm/packages'
import { jsonStripNewlines } from './utils'
import { Package } from '../openpm/types'

export interface OpenToolParams {
  apiKey?: string
  proxy?: boolean
}

export class OpenpmTool extends Tool implements OpenToolParams {
  package: Package
  apiKey?: string

  constructor(pkg: Package, params: OpenToolParams = {}) {
    super()
    this.package = pkg
    this.apiKey = params.apiKey || process.env.OPENPM_API_KEY
  }

  /** @ignore */
  async _call(_input: string) {
    const prompt = [`Usage Guide: ${this.package.machine_description}`]

    if (this.apiKey) {
      prompt.push(`Openpm API Key for requests to openpm.ai: ${this.apiKey}`)
    }

    prompt.push(`OpenAPI Spec: ${jsonStripNewlines(this.package.openapi)}`)

    return prompt.join('\n')
  }

  get name(): string {
    return this.package.name
  }

  get description(): string {
    return `Call this tool to get the OpenAPI spec (and usage guide) for interacting with the ${this.package.name} API. You should only call this ONCE! What is the ${this.package.name} API useful for? ${this.package.description}`
  }

  static async fromPackageId(packageId: string, params: OpenToolParams = {}) {
    const pkg = await getPackage(packageId, { proxy: params.proxy })
    return new OpenpmTool(pkg, params)
  }
}
