import { Tool } from 'langchain/tools'

export interface RequestTool {
  onBeforeRequest?: (request: Request) => Request
  onBeforeResponse?: (response: Response) => Response
}

export class ApiRequestsTool extends Tool implements RequestTool {
  name = 'openpm_requests'
  onBeforeRequest?: (request: Request) => Request
  onBeforeResponse?: (response: Response) => Response

  constructor(options: RequestTool = {}) {
    super()
    this.onBeforeRequest = options.onBeforeRequest
    this.onBeforeResponse = options.onBeforeResponse
  }

  /** @ignore */
  async _call(input: string) {
    try {
      const { url, data, method } = JSON.parse(input) as {
        url: string
        data: any | undefined
        method: string
      }

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

  description = `A portal for making HTTP requests to OpenAPI APIs found through Openpm, the OpenAPI package manager. 
    Input should be a json string with four keys: "openapi_info_title", "url", "method" and "data".
    "openapi_info_title" is the OpenAPI spec title. "url" is a full server url and path, method is a http method string, and data is a dictionary of key-value pairs you want to send to the url as a JSON body.
    If you want to send a request with no body, you can omit the "data" key.
    The output will be the raw text response of the API response.`
}
