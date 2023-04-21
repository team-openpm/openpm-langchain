import { StructuredTool, ToolParams } from 'langchain/dist/tools/base'
import { z } from 'zod'

export interface RequestTool extends ToolParams {
  onBeforeRequest?: (request: Request) => Request
  onBeforeResponse?: (response: Response) => Response
}

export class ApiRequestsTool extends StructuredTool {
  name = 'api_requests'
  onBeforeRequest?: (request: Request) => Request
  onBeforeResponse?: (response: Response) => Response

  schema = z.object({
    url: z.string(),
    method: z.string(),
    data: z.any().optional(),
  })

  constructor({
    verbose,
    callbacks,
    onBeforeRequest,
    onBeforeResponse,
  }: RequestTool = {}) {
    super(verbose, callbacks)
    this.onBeforeRequest = onBeforeRequest
    this.onBeforeResponse = onBeforeResponse
  }

  /** @ignore */
  async _call({ url, data, method }: z.infer<typeof this.schema>) {
    try {
      const headers = new Headers()

      if (data) {
        headers.set('Content-Type', 'application/json')
      }

      let request = new Request(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      })

      if (this.onBeforeRequest) {
        request = this.onBeforeRequest(request)
      }

      let response = await fetch(request)

      if (this.onBeforeResponse) {
        response = this.onBeforeResponse(response)
      }

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status} ${response.statusText}`
        )
      }

      return response.text()
    } catch (error) {
      return `${error}`
    }
  }

  description = `A portal for making GET, POST, PUT, and DELETE requests to any APIs found through Openpm. 
    Use this tool only for requests made to APIs that you already have the OpenAPI spec for.
    Input should be a json string with three keys: "url", "method" and "data".
    Url is a string, method is a string, and data is a dictionary of key-value pairs you want to send to the url as a JSON body.
    If you want to send a request with no body, you can omit the "data" key.
    The output will be the raw text response of the API response.`
}
